// Security configuration and utilities

export const SECURITY_CONFIG = {
  // Allowed origins for CORS
  ALLOWED_ORIGINS: [
    'https://aaasj.org',
    'https://www.aaasj.org',
    'https://aaasj.vercel.app',
    'http://localhost:3000' // Development only
  ],
  
  // Rate limiting configuration
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100, // requests per window
    SKIP_SUCCESSFUL_REQUESTS: false,
    SKIP_FAILED_REQUESTS: false
  },
  
  // API security settings
  API_SECURITY: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    MAX_FILES_PER_REQUEST: 5
  },
  
  // Content Security Policy
  CSP: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': [
      "'self'", 
      'https://api.resend.com',
      'https://www.googleapis.com',
      'https://lh3.googleusercontent.com'
    ],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"]
  }
}

export function validateOrigin(origin: string | null): boolean {
  if (!origin) return false
  return SECURITY_CONFIG.ALLOWED_ORIGINS.includes(origin)
}

export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > SECURITY_CONFIG.API_SECURITY.MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File size exceeds ${SECURITY_CONFIG.API_SECURITY.MAX_FILE_SIZE / (1024 * 1024)}MB limit` 
    }
  }
  
  // Check file type
  if (!SECURITY_CONFIG.API_SECURITY.ALLOWED_FILE_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type ${file.type} is not allowed` 
    }
  }
  
  return { valid: true }
}

export function sanitizeInput(input: string): string {
  // Basic input sanitization
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000) // Limit length
}

export function generateCSPHeader(): string {
  const directives = Object.entries(SECURITY_CONFIG.CSP)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ')
  
  return directives
}

// Environment variable validation
export function validateEnvironment(): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const required = [
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ]
  
  for (const varName of required) {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`)
    }
  }
  
  // Validate NEXTAUTH_URL format
  const nextAuthUrl = process.env.NEXTAUTH_URL
  if (nextAuthUrl && !nextAuthUrl.startsWith('http')) {
    errors.push('NEXTAUTH_URL must be a valid URL starting with http:// or https://')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
