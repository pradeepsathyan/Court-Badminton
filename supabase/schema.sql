-- Court-Badminton Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Agents/Users table
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    agent_name TEXT NOT NULL,
    court_name TEXT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location_url TEXT,
    court_count INTEGER DEFAULT 1,
    shareable_slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('Beginner', 'Intermediate', 'Expert')) DEFAULT 'Intermediate',
    games_played INTEGER DEFAULT 0,
    is_waiting BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches table
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    court_id INTEGER NOT NULL,
    team1_player1_id UUID REFERENCES players(id) ON DELETE CASCADE,
    team1_player2_id UUID REFERENCES players(id) ON DELETE CASCADE,
    team2_player1_id UUID REFERENCES players(id) ON DELETE CASCADE,
    team2_player2_id UUID REFERENCES players(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved Players Pool table (for agents to save frequently used players)
CREATE TABLE saved_players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('Beginner', 'Intermediate', 'Expert')) DEFAULT 'Intermediate',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(agent_id, name)
);

-- Indexes for better query performance
CREATE INDEX idx_sessions_agent_id ON sessions(agent_id);
CREATE INDEX idx_sessions_slug ON sessions(shareable_slug);
CREATE INDEX idx_sessions_date ON sessions(date);
CREATE INDEX idx_players_session_id ON players(session_id);
CREATE INDEX idx_matches_session_id ON matches(session_id);
CREATE INDEX idx_saved_players_agent_id ON saved_players(agent_id);

-- Row Level Security (RLS) Policies
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_players ENABLE ROW LEVEL SECURITY;

-- Agents: Users can only read their own data
CREATE POLICY "Users can read own data" ON agents
    FOR SELECT USING (auth.uid() = id);

-- Sessions: Anyone can read, only owner can modify
CREATE POLICY "Anyone can view sessions" ON sessions
    FOR SELECT USING (true);

CREATE POLICY "Users can create own sessions" ON sessions
    FOR INSERT WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Users can update own sessions" ON sessions
    FOR UPDATE USING (auth.uid() = agent_id);

CREATE POLICY "Users can delete own sessions" ON sessions
    FOR DELETE USING (auth.uid() = agent_id);

-- Players: Anyone can read, only session owner can modify
CREATE POLICY "Anyone can view players" ON players
    FOR SELECT USING (true);

CREATE POLICY "Session owner can manage players" ON players
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM sessions 
            WHERE sessions.id = players.session_id 
            AND sessions.agent_id = auth.uid()
        )
    );

-- Matches: Same as players
CREATE POLICY "Anyone can view matches" ON matches
    FOR SELECT USING (true);

CREATE POLICY "Session owner can manage matches" ON matches
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM sessions 
            WHERE sessions.id = matches.session_id 
            AND sessions.agent_id = auth.uid()
        )
    );

-- Saved Players: Only owner can access
CREATE POLICY "Users can manage own saved players" ON saved_players
    FOR ALL USING (auth.uid() = agent_id);

-- Function to generate unique shareable slug
CREATE OR REPLACE FUNCTION generate_session_slug()
RETURNS TEXT AS $$
DECLARE
    new_slug TEXT;
    done BOOLEAN := false;
BEGIN
    WHILE NOT done LOOP
        -- Generate random 8-character alphanumeric string
        new_slug := lower(substring(md5(random()::text) from 1 for 8));
        
        -- Check if slug already exists
        IF NOT EXISTS (SELECT 1 FROM sessions WHERE shareable_slug = new_slug) THEN
            done := true;
        END IF;
    END LOOP;
    
    RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug on insert
CREATE OR REPLACE FUNCTION set_session_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.shareable_slug IS NULL OR NEW.shareable_slug = '' THEN
        NEW.shareable_slug := generate_session_slug();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_session_slug
    BEFORE INSERT ON sessions
    FOR EACH ROW
    EXECUTE FUNCTION set_session_slug();
