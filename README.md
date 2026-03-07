# TempMail - Modern Temporary Email Application

A modern, responsive temporary email (temp mail) web application with a clean, futuristic design. This SaaS-style landing page and dashboard provides users with disposable email addresses to protect their privacy.

## Features

### Hero Section
- Large headline: "Get Your Free Temporary Email Address"
- Auto-generated temporary email address
- One-click copy button
- Action buttons: Refresh, Change Username, QR Code, Delete Inbox, History
- Login and Sign Up buttons
- Advertisement placeholders

### Inbox Section
- Real-time inbox that automatically receives emails
- Email list with sender, subject, preview text, and timestamp
- Message viewer panel with full email content
- Email search functionality
- Auto-refresh indicator (30-second intervals)
- Empty inbox illustration
- Read/unread status tracking

### Advertisement Placement
- Top banner ad (728x90)
- Left sidebar ad (160x600)
- Right sidebar ad (160x600)
- Inline ad between sections (970x90)
- Footer ad space (970x90)

### Statistics Section
Display live counters for:
- Emails generated: 1,247,856+
- Messages received: 8,934,521+
- Active users: 15,234+
- Domains available: 6

### Advanced Features (35 Feature Cards)
1. Instant email generation
2. One-click email copy
3. Multiple domain support
4. Unlimited temp emails
5. Real-time inbox refresh
6. Email preview panel
7. Download email as .eml
8. Email forwarding option
9. Spam protection
10. Auto-delete expired emails
11. Custom username creation
12. QR code for email address
13. Dark mode support
14. Mobile responsive design
15. Email search feature
16. Email attachment viewer
17. One-click inbox reset
18. Email history storage
19. Multi-language support
20. SEO optimized pages
21. Custom domain support
22. Secure privacy protection
23. Temporary inbox sharing
24. API access for developers
25. Email notification alerts
26. Disposable email timer
27. Domain rotation system
28. Advanced spam filtering AI
29. Email export to PDF
30. Cloud inbox storage
31. Email read/unread status
32. Copy email content button
33. Secure encryption for inbox
34. Session-based inbox protection
35. Fast global CDN performance

### Testimonials Section
- 4 user review cards with:
  - Avatar images
  - 5-star ratings
  - User names
  - Testimonial text

### Blog Section
4 blog post cards covering:
- Privacy protection guide
- Disposable email usage
- Avoiding spam forever
- Online security tips

### FAQ Section
Accordion-style questions including:
- How long do emails last?
- Is the service really free?
- Can I choose my domain?
- Is my privacy protected?
- Can I use this for important accounts?
- How many emails can I create?

### Footer
- TempMail logo and branding
- Quick Links (Home, Features, Blog, FAQ)
- Legal links (Privacy Policy, Terms of Service, API Access, Contact)
- Social media icons (Facebook, Twitter, Instagram, GitHub)
- Copyright text

## Design Style

- **Color Scheme**: Purple/blue gradient (#667eea to #764ba2)
- **Effects**: Glassmorphism, soft shadows, backdrop blur
- **Typography**: Inter font family
- **Corners**: Rounded (rounded-xl, rounded-2xl)
- **Animations**: Smooth hover effects, fade-in animations, scale transforms
- **Dark Mode**: Full dark mode support with toggle

## Technology Stack

- **Frontend**: HTML5, Tailwind CSS (CDN), Vanilla JavaScript
- **Icons**: Font Awesome 6.5.1
- **Fonts**: Google Fonts (Inter)
- **Responsive**: Mobile-first design, fully responsive
- **Performance**: Optimized for speed and SEO

## Getting Started

### Option 1: Open Directly
Simply open `index.html` in a modern web browser.

### Option 2: Local Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx live-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## File Structure

```
ugc/
├── index.html          # Main HTML file with all sections
├── app.js             # JavaScript functionality
├── package.json       # Project metadata
├── tailwind.config.js # Tailwind CSS configuration
├── .gitignore        # Git ignore file
└── README.md         # This file
```

## Features Implementation

### JavaScript Functionality

- **Email Generation**: Random username and domain combination
- **Copy to Clipboard**: One-click copy with visual feedback
- **Mock Inbox**: Simulates receiving emails with delays
- **Email Viewer**: Modal popup for viewing full email content
- **Auto-refresh**: 30-second countdown timer
- **Dark Mode**: Persistent dark mode using localStorage
- **FAQ Accordion**: Expandable/collapsible FAQ items
- **Statistics Animation**: Animated counters on page load

### Responsive Design

- **Mobile**: Single column layout, touch-friendly buttons
- **Tablet**: 2-column grid for features
- **Desktop**: Full layout with sidebars and multi-column grids
- **Large Screens**: Optimized spacing and max-width containers

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Future Enhancements

- Real backend integration with email server
- WebSocket support for real-time email delivery
- User authentication and premium features
- API endpoint documentation
- Email attachment support
- PDF export functionality
- QR code generation
- Email forwarding to real addresses
- Multiple language translations

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

For questions or support, please open an issue on GitHub.

---

**Note**: This is a frontend demo. For production use, you would need to integrate with a real temporary email backend service.