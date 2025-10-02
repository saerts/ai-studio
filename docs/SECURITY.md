# Security & Privacy Implementation

## Overview

This document outlines the security and privacy measures implemented for AI Studio's analytics tracking.

## 🔒 Security Measures

### 1. Content Security Policy (CSP)

**Implementation:** `vercel.json`

Strict CSP headers protect against XSS attacks:

```
Content-Security-Policy:
  - default-src 'self'
  - script-src 'self' [whitelisted GTM/GA domains]
  - NO unsafe-inline for scripts
  - connect-src limited to analytics domains
  - frame-ancestors 'none' (clickjacking protection)
  - upgrade-insecure-requests
```

**Additional Security Headers:**
- `X-Frame-Options: DENY` - Prevents embedding in iframes
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` - Restricts camera, microphone, geolocation
- `X-XSS-Protection: 1; mode=block`

### 2. No Hardcoded Secrets

**Issue:** Secrets in code are a security risk

**Solution:** All sensitive values in environment variables
- `PUBLIC_GTM_ID` - GTM container ID
- `PUBLIC_GOOGLE_SITE_VERIFICATION` - Google verification code

**Files:**
- `.env` - Contains actual secrets (gitignored)
- `.env.example` - Template with placeholders (committed)

**Verification:**
```bash
# .env is in .gitignore
grep "^\.env$" .gitignore

# No secrets in code
grep -r "GTM-" src/  # Should only find env variable references
```

### 3. External Scripts (No unsafe-inline)

**Problem:** Inline scripts weaken CSP

**Solution:** GTM configuration moved to external file

```html
<!-- ❌ Before: Inline script (unsafe-inline required) -->
<script>
  window.__GTM_ID__ = 'GTM-XXXXXXX';
</script>

<!-- ✅ After: External script (CSP-compliant) -->
<script src="/scripts/gtm-config.js" data-gtm-id={GTM_ID}></script>
```

## 🔐 Privacy Measures (GDPR/PECR Compliance)

### 1. Cookie Consent Banner

**Location:** `/src/components/CookieConsent.astro`

**Features:**
- ✅ Shows before any tracking code loads
- ✅ Blocks GTM until explicit consent
- ✅ Stores preference for 365 days
- ✅ Allows rejection (no tracking)
- ✅ Clears analytics cookies on rejection
- ✅ Accessible (keyboard + screen reader)

**User Flow:**

```
Page Load
    ↓
Cookie Consent Banner Appears
    ↓
User Choice:
    ├─→ Accept → GTM Loads → Analytics Active
    └─→ Reject → No GTM → No Tracking
```

### 2. Cookie Management

**Consent Storage:**
```javascript
{
  "analytics": true/false,
  "timestamp": 1696262400000,
  "version": 1
}
```

**Cookie Cleanup on Rejection:**
- Deletes `_ga`, `_gid`, `_gat*` cookies
- Prevents future tracking
- User can change preference anytime

### 3. Privacy Policy

**Updated:** `/src/pages/privacy.astro`

Documents:
- Google Tag Manager usage
- Types of data collected (IP, page views, device info)
- Purpose of tracking (analytics only)
- User rights (access, deletion, opt-out)
- Third-party processors (Google LLC)
- Cookie types and purposes

## 🛡️ Implementation Checklist

### For Developers

- [x] Remove hardcoded secrets from code
- [x] Add secrets to `.env` file
- [x] Ensure `.env` is in `.gitignore`
- [x] Create `.env.example` with placeholders
- [x] Implement cookie consent banner
- [x] Block GTM until user consent
- [x] Move inline scripts to external files
- [x] Configure strict CSP headers
- [x] Add security headers (X-Frame-Options, etc.)
- [x] Update privacy policy
- [x] Test consent flow
- [x] Document implementation

### For Deployment

- [ ] Set environment variables in Vercel:
  ```bash
  vercel env add PUBLIC_GTM_ID production
  vercel env add PUBLIC_GOOGLE_SITE_VERIFICATION production
  ```
- [ ] Test cookie banner on production
- [ ] Verify GTM only loads after consent
- [ ] Check CSP headers are applied
- [ ] Validate with browser dev tools
- [ ] Test rejection flow (cookies cleared)
- [ ] Verify accessibility (keyboard navigation)

## 🧪 Testing

### Local Testing

1. **Clear all cookies**
2. **Visit site** - Banner should appear
3. **Click "Reject"**:
   - Banner disappears
   - Check console: "Analytics disabled by user preference"
   - Verify GTM NOT in Network tab
4. **Reload page** - Banner should NOT appear (preference stored)
5. **Clear cookies again**
6. **Click "Accept"**:
   - GTM loads
   - Check Network tab for `gtm.js`
   - DataLayer should have consent event

### CSP Testing

**Check CSP Headers:**
```bash
curl -I https://your-domain.com | grep -i content-security-policy
```

**Browser Console:**
- No CSP violations should appear
- All scripts should load without errors

**Online Tools:**
- [SecurityHeaders.com](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

### GDPR Compliance Testing

- [ ] Cookie banner appears before GTM loads
- [ ] "Reject" prevents GTM from loading
- [ ] "Accept" loads GTM
- [ ] Preference persists across page loads
- [ ] Link to privacy policy present
- [ ] Easy to withdraw consent (future: settings page)
- [ ] Clear language (not legalese)
- [ ] Accessible to screen readers

## 📋 Files Modified

### Created:
- `/src/components/CookieConsent.astro` - Cookie consent banner
- `/public/scripts/gtm-config.js` - External GTM configuration
- `/docs/SECURITY.md` - This file
- `/docs/guides/analytics-setup.md` - Updated with consent-first approach
- `/docs/guides/cookie-consent-implementation.md` - Detailed consent guide
- `/.env.example` - Template for environment variables

### Modified:
- `/src/components/layout/BaseLayout.astro` - Environment variables, removed inline GTM
- `/src/pages/privacy.astro` - Added GTM details and cookie information
- `/vercel.json` - Added CSP and security headers
- `/.gitignore` - Ensured `.env` is ignored (already was)

## 🚨 Security Alerts

### Never Commit:
- `.env` file with actual secrets
- Any file containing GTM IDs or verification codes
- API keys or authentication tokens

### Regular Security Updates:
1. Review CSP policy quarterly
2. Update dependencies monthly
3. Check for XSS vulnerabilities
4. Monitor GTM for unauthorized tags
5. Review analytics data access

### Incident Response:
If GTM is compromised:
1. Immediately change GTM container ID
2. Update `PUBLIC_GTM_ID` environment variable
3. Force deploy to all environments
4. Review recent GTM changes
5. Check for malicious tags
6. Notify users if data breach occurred

## 🔗 Resources

- [GDPR Official Text](https://gdpr.eu/)
- [Google Tag Manager Security](https://support.google.com/tagmanager/answer/9323295)
- [CSP Reference](https://content-security-policy.com/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [Cookie Consent Best Practices](https://www.cookieyes.com/cookie-consent-best-practices/)

## 📞 Support

For security concerns:
- Email: security@ai-studio44.com (if configured)
- Create private issue in repository
- Contact project maintainer directly

---

**Last Updated:** 2025-10-02
**Security Review:** Required quarterly
**Next Review:** 2026-01-02
