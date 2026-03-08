# Backend API Documentation

## Overview
RESTful API for the Temporary Email service. Provides endpoints for email generation, inbox management, and email operations.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, the API uses session-based authentication via `sessionId`. No API keys or tokens required.

---

## Endpoints

### 1. Generate Temporary Email

**POST** `/api/email/generate`

Generate a new temporary email address.

**Request Body:**
```json
{
  "username": "myusername",  // optional, auto-generated if not provided
  "domain": "tempmail.com"    // optional, random if not provided
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "a1b2c3d4e5f6...",
  "email": "myusername@tempmail.com",
  "expiresAt": 1678901234567
}
```

**Status Codes:**
- `200 OK` - Email generated successfully
- `500 Internal Server Error` - Server error

---

### 2. Get Inbox

**GET** `/api/inbox/:sessionId`

Retrieve all emails for a session.

**Parameters:**
- `sessionId` (path) - Session identifier from email generation

**Response:**
```json
{
  "success": true,
  "email": "myusername@tempmail.com",
  "inbox": [
    {
      "id": "email123",
      "to": "myusername@tempmail.com",
      "from": "sender@example.com",
      "subject": "Email Subject",
      "preview": "Email preview text...",
      "body": "<p>Email body HTML</p>",
      "timestamp": "2024-03-08T00:00:00.000Z",
      "time": "Just now",
      "read": false,
      "hasAttachment": false
    }
  ],
  "expiresAt": 1678901234567
}
```

**Status Codes:**
- `200 OK` - Inbox retrieved successfully
- `404 Not Found` - Session not found or expired
- `410 Gone` - Session has expired

---

### 3. Get Specific Email

**GET** `/api/email/:sessionId/:emailId`

Retrieve a specific email and mark it as read.

**Parameters:**
- `sessionId` (path) - Session identifier
- `emailId` (path) - Email identifier

**Response:**
```json
{
  "success": true,
  "email": {
    "id": "email123",
    "to": "myusername@tempmail.com",
    "from": "sender@example.com",
    "subject": "Email Subject",
    "preview": "Email preview text...",
    "body": "<p>Email body HTML</p>",
    "timestamp": "2024-03-08T00:00:00.000Z",
    "time": "Just now",
    "read": true,
    "hasAttachment": false
  }
}
```

**Status Codes:**
- `200 OK` - Email retrieved successfully
- `404 Not Found` - Session or email not found

---

### 4. Delete Inbox

**DELETE** `/api/inbox/:sessionId`

Clear all emails from the inbox.

**Parameters:**
- `sessionId` (path) - Session identifier

**Response:**
```json
{
  "success": true,
  "message": "Inbox cleared"
}
```

**Status Codes:**
- `200 OK` - Inbox cleared successfully
- `404 Not Found` - Session not found

---

### 5. Simulate Email Receipt

**POST** `/api/email/simulate/:sessionId`

Simulate receiving a new email (for demonstration purposes).

**Parameters:**
- `sessionId` (path) - Session identifier

**Response:**
```json
{
  "success": true,
  "email": {
    "id": "email123",
    "to": "myusername@tempmail.com",
    "from": "sender@example.com",
    "subject": "Email Subject",
    "preview": "Email preview text...",
    "body": "<p>Email body HTML</p>",
    "timestamp": "2024-03-08T00:00:00.000Z",
    "time": "Just now",
    "read": false,
    "hasAttachment": false
  }
}
```

**Status Codes:**
- `200 OK` - Email simulated successfully
- `404 Not Found` - Session not found

---

### 6. Get Available Domains

**GET** `/api/domains`

Get list of available email domains.

**Response:**
```json
{
  "success": true,
  "domains": [
    "tempmail.com",
    "disposable.email",
    "throwaway.email",
    "temp-inbox.com",
    "quickmail.io",
    "privateemail.net"
  ]
}
```

**Status Codes:**
- `200 OK` - Domains retrieved successfully

---

### 7. Get Server Statistics

**GET** `/api/stats`

Get server statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "activeSessions": 42,
    "totalEmails": 127,
    "availableDomains": 6,
    "uptime": 3600.5
  }
}
```

**Status Codes:**
- `200 OK` - Statistics retrieved successfully

---

### 8. Health Check

**GET** `/api/health`

Check if the server is running.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-03-08T00:00:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Server is healthy

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

**Common Error Codes:**
- `400 Bad Request` - Invalid request parameters
- `404 Not Found` - Resource not found
- `410 Gone` - Resource has expired
- `500 Internal Server Error` - Server error

---

## Email Session Lifecycle

1. **Generation**: Client requests a new email via `/api/email/generate`
2. **Session Creation**: Server creates a session with unique `sessionId`
3. **Storage**: Session stored in memory with 2-hour expiration
4. **Usage**: Client uses `sessionId` for all subsequent operations
5. **Auto-cleanup**: Expired sessions are automatically removed every 10 minutes
6. **Expiration**: Sessions expire 2 hours after creation

---

## Rate Limiting

Currently, there is no rate limiting implemented. In production, consider:
- Per-IP rate limits
- Session-based rate limits
- Email generation limits

---

## CORS

CORS is enabled for all origins in development. For production:
- Configure specific allowed origins
- Set appropriate CORS headers
- Implement credential handling

---

## WebSocket Support (Future)

For real-time email notifications, consider implementing WebSocket:
- Client connects via WebSocket with `sessionId`
- Server pushes new emails as they arrive
- Reduces polling overhead

---

## Production Considerations

### Security
- Add API authentication (JWT, API keys)
- Implement rate limiting
- Add input validation and sanitization
- Use HTTPS only
- Implement CSRF protection

### Performance
- Add Redis for session storage
- Implement caching
- Add database for persistence
- Use message queue for email processing

### Monitoring
- Add logging (Winston, Morgan)
- Implement error tracking (Sentry)
- Add metrics (Prometheus)
- Health check endpoints

### Email Integration
- Connect to real SMTP/IMAP server
- Implement email parsing
- Handle attachments
- Support email forwarding

---

## Example Usage

### JavaScript (Fetch)

```javascript
// Generate email
const response = await fetch('http://localhost:3000/api/email/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'testuser' })
});
const { sessionId, email } = await response.json();

// Get inbox
const inboxResponse = await fetch(`http://localhost:3000/api/inbox/${sessionId}`);
const { inbox } = await inboxResponse.json();

// Read email
const emailResponse = await fetch(
  `http://localhost:3000/api/email/${sessionId}/${inbox[0].id}`
);
const { email: emailData } = await emailResponse.json();
```

### cURL

```bash
# Generate email
curl -X POST http://localhost:3000/api/email/generate \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser"}'

# Get inbox
curl http://localhost:3000/api/inbox/SESSION_ID

# Get email
curl http://localhost:3000/api/email/SESSION_ID/EMAIL_ID

# Delete inbox
curl -X DELETE http://localhost:3000/api/inbox/SESSION_ID
```

---

## Support

For issues or questions:
- Open an issue on GitHub
- Check the documentation
- Review example code in the repository
