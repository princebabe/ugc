// Temporary Email Backend Server
// A simple Node.js/Express server for handling temporary email operations

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// In-memory storage
const emailSessions = new Map(); // sessionId -> { email, inbox, createdAt, expiresAt }
const EMAIL_EXPIRY_TIME = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

// Available domains
const DOMAINS = [
    'tempmail.com',
    'disposable.email',
    'throwaway.email',
    'temp-inbox.com',
    'quickmail.io',
    'privateemail.net'
];

// Helper functions
function generateRandomUsername() {
    const adjectives = ['quick', 'lazy', 'happy', 'cool', 'smart', 'blue', 'red', 'green', 'bright', 'swift'];
    const nouns = ['fox', 'cat', 'dog', 'bird', 'fish', 'tiger', 'bear', 'wolf', 'lion', 'eagle'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 1000);
    return `${adj}${noun}${num}`;
}

function generateSessionId() {
    return crypto.randomBytes(16).toString('hex');
}

function cleanupExpiredSessions() {
    const now = Date.now();
    for (const [sessionId, session] of emailSessions.entries()) {
        if (session.expiresAt < now) {
            emailSessions.delete(sessionId);
            console.log(`Cleaned up expired session: ${sessionId}`);
        }
    }
}

// Run cleanup every 10 minutes
setInterval(cleanupExpiredSessions, 10 * 60 * 1000);

// Mock email generator for demonstration
function generateMockEmail(toEmail) {
    const senders = [
        { from: 'noreply@github.com', subject: 'Welcome to GitHub!', preview: 'Thanks for signing up. Here are some tips to get started...' },
        { from: 'support@netflix.com', subject: 'Verify your email address', preview: 'Please verify your email to complete registration...' },
        { from: 'newsletter@techcrunch.com', subject: 'Daily Tech News Digest', preview: 'Today\'s top stories in technology and startups...' },
        { from: 'team@slack.com', subject: 'You\'ve been invited to join a workspace', preview: 'Click here to join your team on Slack...' },
        { from: 'security@amazon.com', subject: 'Security alert for your account', preview: 'We detected a new sign-in to your Amazon account...' },
        { from: 'notifications@linkedin.com', subject: 'You have 5 new connections', preview: 'See who wants to connect with you...' }
    ];

    const randomSender = senders[Math.floor(Math.random() * senders.length)];
    
    return {
        id: crypto.randomBytes(8).toString('hex'),
        to: toEmail,
        from: randomSender.from,
        subject: randomSender.subject,
        preview: randomSender.preview,
        body: `<p>${randomSender.preview}</p><p>This is a simulated email message. In a production environment, this would be a real email received from ${randomSender.from}.</p>`,
        timestamp: new Date().toISOString(),
        time: 'Just now',
        read: false,
        hasAttachment: Math.random() > 0.7
    };
}

// API Routes

// Generate a new temporary email
app.post('/api/email/generate', (req, res) => {
    const { username, domain } = req.body;
    
    const emailUsername = username || generateRandomUsername();
    const emailDomain = domain || DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
    const email = `${emailUsername}@${emailDomain}`;
    
    const sessionId = generateSessionId();
    const now = Date.now();
    
    const session = {
        email,
        inbox: [],
        createdAt: now,
        expiresAt: now + EMAIL_EXPIRY_TIME,
        lastAccessed: now
    };
    
    emailSessions.set(sessionId, session);
    
    console.log(`Generated new email: ${email} (Session: ${sessionId})`);
    
    res.json({
        success: true,
        sessionId,
        email,
        expiresAt: session.expiresAt
    });
});

// Get inbox for a session
app.get('/api/inbox/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const session = emailSessions.get(sessionId);
    
    if (!session) {
        return res.status(404).json({
            success: false,
            error: 'Session not found or expired'
        });
    }
    
    // Update last accessed time
    session.lastAccessed = Date.now();
    
    // Check if session has expired
    if (session.expiresAt < Date.now()) {
        emailSessions.delete(sessionId);
        return res.status(410).json({
            success: false,
            error: 'Session has expired'
        });
    }
    
    res.json({
        success: true,
        email: session.email,
        inbox: session.inbox,
        expiresAt: session.expiresAt
    });
});

// Get a specific email
app.get('/api/email/:sessionId/:emailId', (req, res) => {
    const { sessionId, emailId } = req.params;
    const session = emailSessions.get(sessionId);
    
    if (!session) {
        return res.status(404).json({
            success: false,
            error: 'Session not found or expired'
        });
    }
    
    const email = session.inbox.find(e => e.id === emailId);
    
    if (!email) {
        return res.status(404).json({
            success: false,
            error: 'Email not found'
        });
    }
    
    // Mark as read
    email.read = true;
    
    res.json({
        success: true,
        email
    });
});

// Delete inbox (clear all emails)
app.delete('/api/inbox/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const session = emailSessions.get(sessionId);
    
    if (!session) {
        return res.status(404).json({
            success: false,
            error: 'Session not found or expired'
        });
    }
    
    session.inbox = [];
    
    res.json({
        success: true,
        message: 'Inbox cleared'
    });
});

// Simulate receiving an email (for demonstration)
app.post('/api/email/simulate/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const session = emailSessions.get(sessionId);
    
    if (!session) {
        return res.status(404).json({
            success: false,
            error: 'Session not found or expired'
        });
    }
    
    const newEmail = generateMockEmail(session.email);
    session.inbox.unshift(newEmail);
    
    console.log(`Simulated email received for ${session.email}`);
    
    res.json({
        success: true,
        email: newEmail
    });
});

// Get available domains
app.get('/api/domains', (req, res) => {
    res.json({
        success: true,
        domains: DOMAINS
    });
});

// Get server statistics
app.get('/api/stats', (req, res) => {
    const activeSessions = emailSessions.size;
    let totalEmails = 0;
    
    for (const session of emailSessions.values()) {
        totalEmails += session.inbox.length;
    }
    
    res.json({
        success: true,
        stats: {
            activeSessions,
            totalEmails,
            availableDomains: DOMAINS.length,
            uptime: process.uptime()
        }
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Temp Mail Server running on port ${PORT}`);
    console.log(`📧 Frontend: http://localhost:${PORT}`);
    console.log(`🔌 API: http://localhost:${PORT}/api`);
    console.log(`📊 Available domains: ${DOMAINS.length}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    process.exit(0);
});

module.exports = app;
