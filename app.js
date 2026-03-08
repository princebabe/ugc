// Temp Mail Application - Integrated with Backend
// This file connects the frontend UI with the backend API

// Configuration
const API_BASE_URL = window.location.origin + '/api';
let sessionId = localStorage.getItem('tempmail_session_id');
let currentEmail = '';
let inbox = [];
let refreshTimer = 30;
let autoRefreshInterval;
let isDarkMode = false;

// DOM elements
const tempEmailInput = document.getElementById('tempEmail');
const copyEmailBtn = document.getElementById('copyEmailBtn');
const refreshEmailBtn = document.getElementById('refreshEmailBtn');
const changeUsernameBtn = document.getElementById('changeUsernameBtn');
const qrCodeBtn = document.getElementById('qrCodeBtn');
const deleteInboxBtn = document.getElementById('deleteInboxBtn');
const historyBtn = document.getElementById('historyBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const emailList = document.getElementById('emailList');
const emptyInbox = document.getElementById('emptyInbox');
const emailViewer = document.getElementById('emailViewer');
const closeViewer = document.getElementById('closeViewer');
const refreshTimerEl = document.getElementById('refreshTimer');
const autoRefreshIndicator = document.getElementById('autoRefreshIndicator');

// Statistics elements
const emailsGeneratedEl = document.getElementById('emailsGenerated');
const messagesReceivedEl = document.getElementById('messagesReceived');
const activeUsersEl = document.getElementById('activeUsers');
const domainsAvailableEl = document.getElementById('domainsAvailable');

// API Helper Functions
async function apiCall(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (body) {
            options.body = JSON.stringify(body);
        }
        
        const response = await fetch(API_BASE_URL + endpoint, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Initialize application
async function init() {
    checkDarkMode();
    setupEventListeners();
    startAutoRefresh();
    
    // Try to restore existing session or generate new email
    if (sessionId) {
        try {
            await loadInbox();
        } catch (error) {
            console.log('Session expired or invalid, generating new email');
            sessionId = null;
            localStorage.removeItem('tempmail_session_id');
            await generateEmail();
        }
    } else {
        await generateEmail();
    }
    
    // Load statistics
    await loadStats();
    
    // Simulate receiving emails for demo purposes
    setTimeout(() => simulateReceiveEmail(), 5000);
    setTimeout(() => simulateReceiveEmail(), 12000);
    setTimeout(() => simulateReceiveEmail(), 20000);
}

// Generate new temporary email
async function generateEmail(username = null, domain = null) {
    try {
        tempEmailInput.value = 'Generating...';
        
        const data = await apiCall('/email/generate', 'POST', { username, domain });
        
        sessionId = data.sessionId;
        currentEmail = data.email;
        localStorage.setItem('tempmail_session_id', sessionId);
        
        tempEmailInput.value = currentEmail;
        inbox = [];
        renderInbox();
        
        // Add animation
        tempEmailInput.classList.add('fade-in');
        setTimeout(() => {
            tempEmailInput.classList.remove('fade-in');
        }, 500);
        
        console.log('Generated email:', currentEmail);
    } catch (error) {
        console.error('Failed to generate email:', error);
        tempEmailInput.value = 'Error generating email';
        alert('Failed to generate email. Please try again.');
    }
}

// Load inbox from backend
async function loadInbox() {
    try {
        if (!sessionId) {
            throw new Error('No active session');
        }
        
        const data = await apiCall(`/inbox/${sessionId}`);
        
        currentEmail = data.email;
        tempEmailInput.value = currentEmail;
        inbox = data.inbox || [];
        renderInbox();
        
        console.log(`Loaded ${inbox.length} emails from inbox`);
    } catch (error) {
        console.error('Failed to load inbox:', error);
        throw error;
    }
}

// Simulate receiving an email (for demonstration)
async function simulateReceiveEmail() {
    try {
        if (!sessionId) return;
        
        const data = await apiCall(`/email/simulate/${sessionId}`, 'POST');
        
        if (data.success) {
            // Reload inbox to get the new email
            await loadInbox();
            updateStats();
        }
    } catch (error) {
        console.error('Failed to simulate email:', error);
    }
}

// Copy email to clipboard
function copyToClipboard() {
    // Visual feedback function
    const showCopiedFeedback = () => {
        const originalText = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
        copyEmailBtn.classList.add('bg-green-600');
        
        setTimeout(() => {
            copyEmailBtn.innerHTML = originalText;
            copyEmailBtn.classList.remove('bg-green-600');
        }, 2000);
    };
    
    // Check if Clipboard API is available (requires HTTPS/secure context)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(currentEmail).then(() => {
            showCopiedFeedback();
        }).catch(err => {
            console.error('Clipboard API failed:', err);
            // Fallback to older method
            fallbackCopy();
        });
    } else {
        // Use fallback for browsers without Clipboard API or non-secure contexts
        fallbackCopy();
    }
    
    function fallbackCopy() {
        try {
            tempEmailInput.select();
            tempEmailInput.setSelectionRange(0, 99999); // For mobile devices
            document.execCommand('copy');
            showCopiedFeedback();
        } catch (err) {
            console.error('Copy failed:', err);
            alert('Failed to copy email. Please copy manually.');
        }
    }
}

// Refresh email address
async function refreshEmail() {
    await generateEmail();
    
    // Show animation
    autoRefreshIndicator.classList.remove('hidden');
    setTimeout(() => {
        autoRefreshIndicator.classList.add('hidden');
    }, 1000);
}

// Change username with prompt
async function changeUsername() {
    const newUsername = prompt('Enter your custom username:', '');
    if (newUsername && newUsername.trim()) {
        await generateEmail(newUsername.trim());
    }
}

// Show QR code modal
function showQRCode() {
    alert(`QR Code for: ${currentEmail}\n\nIn a real implementation, this would show a scannable QR code.`);
}

// Delete inbox
async function clearInbox() {
    if (!confirm('Are you sure you want to delete all emails?')) {
        return;
    }
    
    try {
        await apiCall(`/inbox/${sessionId}`, 'DELETE');
        inbox = [];
        renderInbox();
    } catch (error) {
        console.error('Failed to clear inbox:', error);
        alert('Failed to clear inbox. Please try again.');
    }
}

// Show history
function showHistory() {
    alert('Email History\n\nIn a real implementation, this would show your previous temporary email addresses.');
}

// Render inbox
function renderInbox() {
    if (inbox.length === 0) {
        emptyInbox.classList.remove('hidden');
        emailList.innerHTML = '';
        emailList.appendChild(emptyInbox);
    } else {
        emptyInbox.classList.add('hidden');
        emailList.innerHTML = inbox.map(email => `
            <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors email-item" data-id="${email.id}">
                <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0">
                        ${email.read ? 
                            '<i class="fas fa-envelope-open text-gray-400"></i>' : 
                            '<i class="fas fa-envelope text-purple-500"></i>'
                        }
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-1">
                            <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                ${email.from}
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                ${email.time}
                            </p>
                        </div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white mb-1 ${email.read ? '' : 'font-bold'}">
                            ${email.subject}
                            ${email.hasAttachment ? '<i class="fas fa-paperclip text-gray-400 ml-2"></i>' : ''}
                        </p>
                        <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                            ${email.preview}
                        </p>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click listeners to email items
        document.querySelectorAll('.email-item').forEach(item => {
            item.addEventListener('click', () => {
                const emailId = item.dataset.id;
                openEmail(emailId);
            });
        });
    }
}

// Open email viewer
async function openEmail(emailId) {
    try {
        const data = await apiCall(`/email/${sessionId}/${emailId}`);
        const email = data.email;
        
        if (!email) return;
        
        // Update local inbox
        const localEmail = inbox.find(e => e.id === emailId);
        if (localEmail) {
            localEmail.read = true;
        }
        renderInbox();
        
        // Populate viewer with sanitized content
        document.getElementById('viewerSubject').textContent = email.subject;
        document.getElementById('viewerFrom').textContent = email.from;
        document.getElementById('viewerTime').textContent = email.time;
        // For trusted mock data, we can use innerHTML, but in production this should be sanitized
        document.getElementById('viewerBody').innerHTML = email.body;
        
        // Show viewer
        emailViewer.classList.remove('hidden');
    } catch (error) {
        console.error('Failed to open email:', error);
        alert('Failed to load email. Please try again.');
    }
}

// Close email viewer
closeViewer.addEventListener('click', () => {
    emailViewer.classList.add('hidden');
});

// Auto refresh timer
function startAutoRefresh() {
    autoRefreshInterval = setInterval(async () => {
        refreshTimer--;
        refreshTimerEl.textContent = `${refreshTimer}s`;
        
        if (refreshTimer <= 0) {
            refreshTimer = 30;
            // Auto-refresh inbox
            if (sessionId) {
                autoRefreshIndicator.classList.remove('hidden');
                try {
                    await loadInbox();
                } catch (error) {
                    console.error('Auto-refresh failed:', error);
                }
                setTimeout(() => {
                    autoRefreshIndicator.classList.add('hidden');
                }, 1000);
            }
        }
    }, 1000);
}

// Load and animate statistics
async function loadStats() {
    try {
        const data = await apiCall('/stats');
        
        if (data.success && data.stats) {
            animateCounter(emailsGeneratedEl, 1247856);
            animateCounter(messagesReceivedEl, 8934521 + data.stats.totalEmails);
            animateCounter(activeUsersEl, 15234 + data.stats.activeSessions);
            animateCounter(domainsAvailableEl, data.stats.availableDomains);
        } else {
            // Fallback to default values
            animateCounter(emailsGeneratedEl, 1247856);
            animateCounter(messagesReceivedEl, 8934521);
            animateCounter(activeUsersEl, 15234);
            animateCounter(domainsAvailableEl, 6);
        }
    } catch (error) {
        console.error('Failed to load stats:', error);
        // Use default values
        animateCounter(emailsGeneratedEl, 1247856);
        animateCounter(messagesReceivedEl, 8934521);
        animateCounter(activeUsersEl, 15234);
        animateCounter(domainsAvailableEl, 6);
    }
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, stepTime);
}

// Update statistics when email is received
function updateStats() {
    const currentReceived = parseInt(messagesReceivedEl.textContent.replace(/,/g, ''));
    messagesReceivedEl.textContent = (currentReceived + 1).toLocaleString();
}

// Dark mode toggle
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
    }
}

function checkDarkMode() {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
        isDarkMode = true;
        document.documentElement.classList.add('dark');
    }
}

// FAQ accordion
function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            
            // Toggle answer
            answer.classList.toggle('hidden');
            
            // Rotate icon
            if (answer.classList.contains('hidden')) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    });
}

// Event listeners
function setupEventListeners() {
    copyEmailBtn.addEventListener('click', copyToClipboard);
    refreshEmailBtn.addEventListener('click', refreshEmail);
    changeUsernameBtn.addEventListener('click', changeUsername);
    qrCodeBtn.addEventListener('click', showQRCode);
    deleteInboxBtn.addEventListener('click', clearInbox);
    historyBtn.addEventListener('click', showHistory);
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Close modal on outside click
    emailViewer.addEventListener('click', (e) => {
        if (e.target === emailViewer) {
            emailViewer.classList.add('hidden');
        }
    });
    
    // Setup FAQ
    setupFAQ();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
