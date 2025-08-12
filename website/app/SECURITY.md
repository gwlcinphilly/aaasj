# Security Documentation

## Overview
This document outlines the security measures implemented to protect the AAASJ website and API endpoints from unauthorized access.

## 🔐 Authentication & Authorization

### Protected Routes
The following API routes require authentication with a valid `@aaa-sj.org` email:

- `/api/events` - Event management (GET, POST, PUT, DELETE)
- `/api/photos` - Photo album management
- `/api/google` - Google Photos integration
- `/api/scholarship/debug` - Scholarship debugging
- `/api/scholarship/test` - Scholarship testing

### Public Routes
These routes are publicly accessible:

- `/api/scholarship/submit` - Public scholarship form submission
- `/api/auth` - Authentication endpoints

### Authentication Methods
1. **Google OAuth**: For users with `@aaa-sj.org` email addresses
2. **Credentials**: For admin access with passcode (temporary)

## 🛡️ Security Measures

### 1. Middleware Protection
- **Rate Limiting**: 100 requests per 15-minute window per IP
- **CORS Protection**: Only allows requests from authorized domains
- **Security Headers**: Comprehensive security headers including CSP
- **Authentication Checks**: Validates JWT tokens for protected routes

### 2. Input Validation & Sanitization
- **File Upload Validation**: Size and type restrictions
- **Input Sanitization**: Removes potentially dangerous characters
- **Length Limits**: Prevents oversized inputs

### 3. Content Security Policy (CSP)
```
default-src 'self'
script-src 'self' 'unsafe-eval' 'unsafe-inline'
style-src 'self' 'unsafe-inline'
img-src 'self' data: https:
font-src 'self' data:
connect-src 'self' https://api.resend.com https://www.googleapis.com
frame-src 'none'
object-src 'none'
```

### 4. CORS Configuration
Allowed origins:
- `https://aaasj.org`
- `https://www.aaasj.org`
- `https://aaasj.vercel.app`
- `http://localhost:3000` (development only)

## 🔧 Environment Variables

### Required Variables
```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
RESEND_API_KEY=your-resend-api-key
```

### Optional Variables
```env
SCHOLARSHIP_EMAIL_TO=scholarship@aaa-sj.org
SCHOLARSHIP_EMAIL_FROM=noreply@aaasj.org
AAASJ_ADMIN_PASSCODE=your-admin-passcode
```

## 🚨 Security Best Practices

### For Developers
1. **Never commit secrets**: All sensitive data should be in environment variables
2. **Validate all inputs**: Use the provided validation functions
3. **Use authentication helpers**: Use `requireAuth` and `optionalAuth` wrappers
4. **Test security measures**: Regularly test authentication and authorization

### For Deployment
1. **Use HTTPS**: Always deploy with SSL/TLS
2. **Set strong secrets**: Use cryptographically secure random strings
3. **Monitor logs**: Watch for suspicious activity
4. **Regular updates**: Keep dependencies updated

## 🔍 Monitoring & Logging

### Security Events Logged
- Authentication attempts (success/failure)
- Rate limit violations
- Unauthorized access attempts
- File upload violations

### Log Locations
- Vercel function logs
- Browser console (client-side errors)
- Server logs (API errors)

## 🚨 Incident Response

### If Security Breach is Suspected
1. **Immediate Actions**:
   - Review recent logs
   - Check for unauthorized changes
   - Verify environment variables

2. **Containment**:
   - Temporarily disable affected endpoints
   - Rotate secrets if compromised
   - Update access controls

3. **Recovery**:
   - Restore from backup if needed
   - Implement additional security measures
   - Document lessons learned

## 📞 Security Contact

For security issues or questions:
- Email: [security@aaa-sj.org]
- Report vulnerabilities responsibly
- Include detailed reproduction steps

## 🔄 Security Updates

This document is updated whenever new security measures are implemented. Last updated: [Current Date]

---

**Note**: This is a living document. Security measures are continuously reviewed and improved.
