// Temp Mail Application JavaScript

// Configuration
const DOMAINS = [
    'tempmail.com',
    'disposable.email',
    'throwaway.email',
    'temp-inbox.com',
    'quickmail.io',
    'privateemail.net'
];

const MOCK_EMAILS = [
    {
        id: 1,
        from: 'noreply@github.com',
        subject: 'Welcome to GitHub!',
        preview: 'Thanks for signing up. Here are some tips to get started...',
        body: '<p>Welcome to GitHub! We\'re excited to have you join our community of developers.</p><p>Here are some quick tips to get started...</p>',
        time: '2 min ago',
        read: false,
        hasAttachment: false
    },
    {
        id: 2,
        from: 'support@netflix.com',
        subject: 'Verify your email address',
        preview: 'Please verify your email to complete registration...',
        body: '<p>Hi there,</p><p>Please click the button below to verify your email address and complete your Netflix registration.</p>',
        time: '15 min ago',
        read: false,
        hasAttachment: false
    },
    {
        id: 3,
        from: 'newsletter@techcrunch.com',
        subject: 'Daily Tech News Digest',
        preview: 'Today\'s top stories in technology and startups...',
        body: '<p>Here are today\'s top technology stories:</p><ul><li>AI breakthroughs</li><li>Startup funding news</li><li>Product launches</li></ul>',
        time: '1 hour ago',
        read: true,
        hasAttachment: true
    }
];

// State management
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

// Initialize application
function init() {
    generateEmail();
    setupEventListeners();
    startAutoRefresh();
    animateStats();
    checkDarkMode();
    
    // Simulate receiving emails after a delay
    setTimeout(() => {
        receiveEmail(MOCK_EMAILS[0]);
    }, 3000);
    
    setTimeout(() => {
        receiveEmail(MOCK_EMAILS[1]);
    }, 8000);
    
    setTimeout(() => {
        receiveEmail(MOCK_EMAILS[2]);
    }, 15000);
}

// Generate random temporary email
function generateEmail() {
    const username = generateUsername();
    const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
    currentEmail = `${username}@${domain}`;
    tempEmailInput.value = currentEmail;
    
    // Add animation
    tempEmailInput.classList.add('fade-in');
    setTimeout(() => {
        tempEmailInput.classList.remove('fade-in');
    }, 500);
}

// Generate random username
function generateUsername() {
    const adjectives = ['quick', 'lazy', 'happy', 'cool', 'smart', 'blue', 'red', 'green'];
    const nouns = ['fox', 'cat', 'dog', 'bird', 'fish', 'tiger', 'bear', 'wolf'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 1000);
    return `${adj}${noun}${num}`;
}

// Copy email to clipboard
function copyToClipboard() {
    tempEmailInput.select();
    document.execCommand('copy');
    
    // Visual feedback
    const originalText = copyEmailBtn.innerHTML;
    copyEmailBtn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
    copyEmailBtn.classList.add('bg-green-600');
    
    setTimeout(() => {
        copyEmailBtn.innerHTML = originalText;
        copyEmailBtn.classList.remove('bg-green-600');
    }, 2000);
}

// Refresh email address
function refreshEmail() {
    generateEmail();
    clearInbox();
    
    // Show animation
    autoRefreshIndicator.classList.remove('hidden');
    setTimeout(() => {
        autoRefreshIndicator.classList.add('hidden');
    }, 1000);
}

// Change username with prompt
function changeUsername() {
    const newUsername = prompt('Enter your custom username:', generateUsername());
    if (newUsername && newUsername.trim()) {
        const domain = currentEmail.split('@')[1];
        currentEmail = `${newUsername.trim()}@${domain}`;
        tempEmailInput.value = currentEmail;
    }
}

// Show QR code modal
function showQRCode() {
    alert(`QR Code for: ${currentEmail}\n\nIn a real implementation, this would show a scannable QR code.`);
}

// Delete inbox
function clearInbox() {
    if (confirm('Are you sure you want to delete all emails?')) {
        inbox = [];
        renderInbox();
    }
}

// Show history
function showHistory() {
    alert('Email History\n\nIn a real implementation, this would show your previous temporary email addresses.');
}

// Receive new email
function receiveEmail(email) {
    inbox.unshift({...email, id: Date.now()});
    renderInbox();
    updateStats();
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
                const emailId = parseInt(item.dataset.id);
                openEmail(emailId);
            });
        });
    }
}

// Open email viewer
function openEmail(emailId) {
    const email = inbox.find(e => e.id === emailId);
    if (!email) return;
    
    // Mark as read
    email.read = true;
    renderInbox();
    
    // Populate viewer
    document.getElementById('viewerSubject').textContent = email.subject;
    document.getElementById('viewerFrom').textContent = email.from;
    document.getElementById('viewerTime').textContent = email.time;
    document.getElementById('viewerBody').innerHTML = email.body;
    
    // Show viewer
    emailViewer.classList.remove('hidden');
}

// Close email viewer
closeViewer.addEventListener('click', () => {
    emailViewer.classList.add('hidden');
});

// Auto refresh timer
function startAutoRefresh() {
    autoRefreshInterval = setInterval(() => {
        refreshTimer--;
        refreshTimerEl.textContent = `${refreshTimer}s`;
        
        if (refreshTimer <= 0) {
            refreshTimer = 30;
            // Simulate checking for new emails
            autoRefreshIndicator.classList.remove('hidden');
            setTimeout(() => {
                autoRefreshIndicator.classList.add('hidden');
            }, 1000);
        }
    }, 1000);
}

// Animate statistics
function animateStats() {
    animateCounter(emailsGeneratedEl, 1247856);
    animateCounter(messagesReceivedEl, 8934521);
    animateCounter(activeUsersEl, 15234);
    animateCounter(domainsAvailableEl, 6);
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
