import { supabase } from '../config/supabase';
import bcrypt from 'bcryptjs';

/**
 * Authentication Services
 */

// Register a new agent
export const registerAgent = async (username, password) => {
    try {
        // Check if username already exists
        const { data: existing } = await supabase
            .from('agents')
            .select('id')
            .eq('username', username)
            .single();

        if (existing) {
            throw new Error('Username already exists');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create agent
        const { data, error } = await supabase
            .from('agents')
            .insert([{ username, password_hash: passwordHash }])
            .select()
            .single();

        if (error) throw error;

        return { success: true, agent: data };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: error.message };
    }
};

// Login an agent
export const loginAgent = async (username, password) => {
    try {
        // Get agent by username
        const { data: agent, error } = await supabase
            .from('agents')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !agent) {
            throw new Error('Invalid credentials');
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, agent.password_hash);

        if (!passwordMatch) {
            throw new Error('Invalid credentials');
        }

        // Don't return password hash
        const { password_hash, ...agentData } = agent;

        return { success: true, agent: agentData };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Session Services
 */

// Generate a random slug for shareable URLs
const generateSlug = () => {
    return Math.random().toString(36).substring(2, 10);
};

// Create a new session
export const createSession = async (sessionData) => {
    try {
        const slug = generateSlug();

        const { data, error } = await supabase
            .from('sessions')
            .insert([{
                ...sessionData,
                shareable_slug: slug
            }])
            .select()
            .single();

        if (error) throw error;

        return { success: true, session: data };
    } catch (error) {
        console.error('Create session error:', error);
        return { success: false, error: error.message };
    }
};

// Get all sessions (optionally filter by agent)
export const getSessions = async (agentId = null) => {
    try {
        let query = supabase
            .from('sessions')
            .select(`
                *,
                players(count)
            `)
            .order('created_at', { ascending: false });

        if (agentId) {
            query = query.eq('agent_id', agentId);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform data to include player_count
        const sessionsWithCount = data.map(session => ({
            ...session,
            player_count: session.players?.[0]?.count || 0
        }));

        return { success: true, sessions: sessionsWithCount };
    } catch (error) {
        console.error('Get sessions error:', error);
        return { success: false, error: error.message };
    }
};

// Get session by ID
export const getSessionById = async (sessionId) => {
    try {
        const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('id', sessionId)
            .single();

        if (error) throw error;

        return { success: true, session: data };
    } catch (error) {
        console.error('Get session error:', error);
        return { success: false, error: error.message };
    }
};

// Get session by shareable slug
export const getSessionBySlug = async (slug) => {
    try {
        const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('shareable_slug', slug)
            .single();

        if (error) throw error;

        return { success: true, session: data };
    } catch (error) {
        console.error('Get session by slug error:', error);
        return { success: false, error: error.message };
    }
};

// Update session
export const updateSession = async (sessionId, updates) => {
    try {
        const { data, error } = await supabase
            .from('sessions')
            .update(updates)
            .eq('id', sessionId)
            .select()
            .single();

        if (error) throw error;

        return { success: true, session: data };
    } catch (error) {
        console.error('Update session error:', error);
        return { success: false, error: error.message };
    }
};

// Delete session
export const deleteSession = async (sessionId) => {
    try {
        const { error } = await supabase
            .from('sessions')
            .delete()
            .eq('id', sessionId);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Delete session error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Player Services
 */

// Get players for a session
export const getPlayers = async (sessionId) => {
    try {
        const { data, error } = await supabase
            .from('players')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        return { success: true, players: data };
    } catch (error) {
        console.error('Get players error:', error);
        return { success: false, error: error.message };
    }
};

// Add player to session
export const addPlayer = async (sessionId, playerData) => {
    try {
        const { data, error } = await supabase
            .from('players')
            .insert([{
                session_id: sessionId,
                ...playerData
            }])
            .select()
            .single();

        if (error) throw error;

        return { success: true, player: data };
    } catch (error) {
        console.error('Add player error:', error);
        return { success: false, error: error.message };
    }
};

// Update player
export const updatePlayer = async (playerId, updates) => {
    try {
        const { data, error } = await supabase
            .from('players')
            .update(updates)
            .eq('id', playerId)
            .select()
            .single();

        if (error) throw error;

        return { success: true, player: data };
    } catch (error) {
        console.error('Update player error:', error);
        return { success: false, error: error.message };
    }
};

// Delete player
export const deletePlayer = async (playerId) => {
    try {
        const { error } = await supabase
            .from('players')
            .delete()
            .eq('id', playerId);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Delete player error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Match Services
 */

// Get matches for a session
export const getMatches = async (sessionId) => {
    try {
        const { data, error } = await supabase
            .from('matches')
            .select(`
                *,
                team1_player1:players!matches_team1_player1_id_fkey(*),
                team1_player2:players!matches_team1_player2_id_fkey(*),
                team2_player1:players!matches_team2_player1_id_fkey(*),
                team2_player2:players!matches_team2_player2_id_fkey(*)
            `)
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        return { success: true, matches: data };
    } catch (error) {
        console.error('Get matches error:', error);
        return { success: false, error: error.message };
    }
};

// Create match
export const createMatch = async (sessionId, matchData) => {
    try {
        const { data, error } = await supabase
            .from('matches')
            .insert([{
                session_id: sessionId,
                ...matchData
            }])
            .select()
            .single();

        if (error) throw error;

        return { success: true, match: data };
    } catch (error) {
        console.error('Create match error:', error);
        return { success: false, error: error.message };
    }
};

// Delete match
export const deleteMatch = async (matchId) => {
    try {
        const { error } = await supabase
            .from('matches')
            .delete()
            .eq('id', matchId);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Delete match error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Saved Players Pool Services
 */

// Get saved players for an agent
export const getSavedPlayers = async (agentId) => {
    try {
        const { data, error } = await supabase
            .from('saved_players')
            .select('*')
            .eq('agent_id', agentId)
            .order('name', { ascending: true });

        if (error) throw error;

        return { success: true, players: data };
    } catch (error) {
        console.error('Get saved players error:', error);
        return { success: false, error: error.message };
    }
};

// Add player to saved pool
export const savePlayerToPool = async (agentId, playerData) => {
    try {
        const { data, error } = await supabase
            .from('saved_players')
            .insert([{
                agent_id: agentId,
                ...playerData
            }])
            .select()
            .single();

        if (error) {
            // Check if it's a unique constraint error
            if (error.message.includes('duplicate') || error.message.includes('unique')) {
                throw new Error('Player already saved to pool');
            }
            throw error;
        }

        return { success: true, player: data };
    } catch (error) {
        console.error('Save player error:', error);
        return { success: false, error: error.message };
    }
};
