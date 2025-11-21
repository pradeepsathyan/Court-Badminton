// Run this in browser console to add test session with 40 players

console.log('🚀 Setting up test data...\n');

// ============================================
// Step 1: Create Test User Account
// ============================================

const testUser = {
    username: 'Dropshot Agent',
    password: 'test123'
};

// Register the user
const existingUsers = JSON.parse(localStorage.getItem('badmintonAgents') || '[]');
const userExists = existingUsers.some(u => u.username === testUser.username);

if (!userExists) {
    existingUsers.push(testUser);
    localStorage.setItem('badmintonAgents', JSON.stringify(existingUsers));
    console.log('✅ Created test user account');
} else {
    console.log('ℹ️  Test user account already exists');
}

console.log('\n📝 Login Credentials:');
console.log('━━━━━━━━━━━━━━━━━━━━━━');
console.log('Username: Dropshot Agent');
console.log('Password: test123');
console.log('━━━━━━━━━━━━━━━━━━━━━━\n');


// ============================================
// Step 2: Generate 40 Random Players
// ============================================

const firstNames = ['John', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia', 'James', 'Ava', 'Robert', 'Isabella',
    'David', 'Mia', 'Richard', 'Charlotte', 'Joseph', 'Amelia', 'Thomas', 'Harper', 'Charles', 'Evelyn',
    'Daniel', 'Abigail', 'Matthew', 'Emily', 'Anthony', 'Elizabeth', 'Donald', 'Sofia', 'Mark', 'Avery',
    'Paul', 'Ella', 'Steven', 'Madison', 'Andrew', 'Scarlett', 'Joshua', 'Victoria', 'Kenneth', 'Aria'];

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
    'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker'];

const categories = ['Beginner', 'Intermediate', 'Expert'];

// Generate 40 random players
const players = [];
for (let i = 0; i < 40; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];

    players.push({
        id: Date.now() + i,
        name: `${firstName} ${lastName}`,
        category: category,
        gamesPlayed: 0,
        isWaiting: false
    });
}


// ============================================
// Step 3: Create Session with Players
// ============================================

// Create session
const testSession = {
    id: Date.now().toString(),
    agentName: 'Dropshot Agent',
    courtName: 'Fortune Sports Academy',
    date: '2025-11-24',
    startTime: '20:00',
    endTime: '23:00',
    locationUrl: 'https://maps.google.com/?q=Fortune+Sports+Academy',
    players: players,
    matches: [],
    waitingList: [],
    courtCount: 1,
    createdBy: 'Dropshot Agent'
};

// Get existing sessions
const existingSessions = JSON.parse(localStorage.getItem('badmintonSessions') || '[]');

// Check if Dropshot Agent session already exists
const dropshotIndex = existingSessions.findIndex(s => s.agentName === 'Dropshot Agent');

if (dropshotIndex !== -1) {
    // Update existing session
    existingSessions[dropshotIndex] = testSession;
    console.log('✅ Updated existing Dropshot Agent session with 40 players');
} else {
    // Add new session
    existingSessions.push(testSession);
    console.log('✅ Created new Dropshot Agent session with 40 players');
}

// Save to localStorage
localStorage.setItem('badmintonSessions', JSON.stringify(existingSessions));


// ============================================
// Summary
// ============================================

console.log('\n📊 Session Details:');
console.log('━━━━━━━━━━━━━━━━━━━━━━');
console.log('Agent: Dropshot Agent');
console.log('Court: Fortune Sports Academy');
console.log('Date: Nov 24, 2025');
console.log('Time: 8:00 PM - 11:00 PM');
console.log('Players: 40');

console.log('\n👥 Player Distribution:');
const beginners = players.filter(p => p.category === 'Beginner').length;
const intermediate = players.filter(p => p.category === 'Intermediate').length;
const experts = players.filter(p => p.category === 'Expert').length;
console.log(`Beginners: ${beginners}`);
console.log(`Intermediate: ${intermediate}`);
console.log(`Experts: ${experts}`);

console.log('\n🎯 Next Steps:');
console.log('1. Refresh the page');
console.log('2. Click "Agent Login"');
console.log('3. Use the credentials above');
console.log('4. Click "Manage" on the session to test matching!');
console.log('\n✨ Test data setup complete!\n');
