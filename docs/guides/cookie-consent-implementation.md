# Cookie Consent Banner Implementation Guide

## Overview

This document provides recommendations for implementing a GDPR-compliant cookie consent banner for AI Studio. While the current implementation includes a privacy policy, a cookie consent mechanism is recommended for full GDPR/PECR compliance, especially for EU visitors.

## Current Status

✅ **Completed:**
- Privacy policy documents Google Tag Manager usage
- Content Security Policy (CSP) restricts external scripts
- GTM implemented with environment variables

⚠️ **Recommended:**
- Cookie consent banner for EU visitors
- GTM blocking until consent is granted
- User preference storage and management

## Legal Requirements

### GDPR (General Data Protection Regulation)

For EU visitors, you must:

1. **Obtain explicit consent** before placing non-essential cookies
2. **Provide clear information** about what cookies do
3. **Allow users to withdraw consent** easily
4. **Respect "Do Not Track"** signals (recommended)

### PECR (Privacy and Electronic Communications Regulations)

UK-specific requirements similar to GDPR for cookie consent.

### ePrivacy Directive

EU directive requiring prior consent for cookies (except strictly necessary ones).

## Cookie Categories

### Strictly Necessary (No consent required)
- Session management
- Security tokens
- Load balancing
- CSRF protection

### Analytics (Consent required)
- Google Tag Manager ✓
- Google Analytics ✓
- User behavior tracking

### Marketing (Consent required)
- Remarketing pixels
- Advertising cookies
- Social media tracking

## Recommended Solutions

### Option 1: CookieYes (Free Tier Available)

**Pros:**
- GDPR/PECR compliant out of the box
- Auto-detects cookies including GTM
- Free plan for small sites
- Blocks GTM until consent

**Implementation:**

```html
<!-- Add to BaseLayout.astro <head> -->
<script
  id="cookieyes"
  type="text/javascript"
  src="https://cdn-cookieyes.com/client_data/YOUR_ACCOUNT_ID/script.js"
>
</script>
```

**Configuration:**
1. Sign up at [CookieYes](https://www.cookieyes.com/)
2. Configure cookie categories
3. Add GTM to "Analytics" category
4. Generate script tag
5. Replace `YOUR_ACCOUNT_ID` in script

### Option 2: Osano (Formerly CookieConsent)

**Pros:**
- Open source option available
- Customizable design
- Self-hosted option

**Implementation:**

```bash
npm install vanilla-cookieconsent
```

```astro
---
// src/components/CookieConsent.astro
---

<script>
  import 'vanilla-cookieconsent/dist/cookieconsent.css';
  import * as CookieConsent from 'vanilla-cookieconsent';

  CookieConsent.run({
    categories: {
      necessary: {
        enabled: true,
        readOnly: true
      },
      analytics: {
        enabled: false,
        autoClear: {
          cookies: [
            { name: /^_ga/ },
            { name: '_gid' }
          ]
        }
      }
    },
    language: {
      default: 'nl',
      translations: {
        nl: {
          consentModal: {
            title: 'Wij gebruiken cookies',
            description: 'Wij gebruiken cookies om uw ervaring te verbeteren en onze website te analyseren.',
            acceptAllBtn: 'Accepteer alles',
            acceptNecessaryBtn: 'Alleen noodzakelijk',
            showPreferencesBtn: 'Voorkeuren beheren'
          },
          preferencesModal: {
            title: 'Cookie voorkeuren',
            acceptAllBtn: 'Accepteer alles',
            acceptNecessaryBtn: 'Alleen noodzakelijk',
            savePreferencesBtn: 'Opslaan',
            sections: [
              {
                title: 'Noodzakelijke cookies',
                description: 'Deze cookies zijn essentieel voor de werking van de website.',
                linkedCategory: 'necessary'
              },
              {
                title: 'Analytics cookies',
                description: 'Deze cookies helpen ons de website te verbeteren door bezoekersgedrag te analyseren.',
                linkedCategory: 'analytics'
              }
            ]
          }
        }
      }
    },
    onConsent: function({ cookie }) {
      if (cookie.categories.includes('analytics')) {
        // Initialize GTM only if consent given
        loadGTM();
      }
    }
  });

  function loadGTM() {
    const GTM_ID = 'GTM-KJZPCH44'; // Or from env var
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',GTM_ID);
  }
</script>
```

### Option 3: Simple Custom Solution

For minimal requirements, implement a basic banner:

```astro
---
// src/components/SimpleCookieBanner.astro
---

<div id="cookie-banner" class="cookie-banner">
  <div class="cookie-content">
    <p>
      Wij gebruiken cookies voor analytics via Google Tag Manager.
      <a href="/privacy">Lees meer</a>
    </p>
    <div class="cookie-buttons">
      <button id="accept-cookies" class="btn-accept">Accepteren</button>
      <button id="reject-cookies" class="btn-reject">Weigeren</button>
    </div>
  </div>
</div>

<style>
  .cookie-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--color-dark-800);
    border-top: 2px solid var(--color-teal-500);
    padding: 1.5rem;
    z-index: 9999;
    display: none;
  }

  .cookie-banner.show {
    display: block;
  }

  .cookie-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
  }

  .cookie-buttons {
    display: flex;
    gap: 1rem;
  }

  .btn-accept, .btn-reject {
    padding: 0.5rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
  }

  .btn-accept {
    background: var(--color-teal-500);
    color: white;
    border: none;
  }

  .btn-reject {
    background: transparent;
    color: var(--color-text-secondary);
    border: 1px solid var(--color-dark-600);
  }
</style>

<script>
  const COOKIE_NAME = 'cookie_consent';
  const GTM_ID = 'GTM-KJZPCH44';

  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  function setCookie(name: string, value: string, days: number = 365): void {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Strict`;
  }

  function loadGTM(): void {
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',GTM_ID);
  }

  function showBanner(): void {
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.classList.add('show');
  }

  function hideBanner(): void {
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.classList.remove('show');
  }

  // Check if consent already given
  const consent = getCookie(COOKIE_NAME);

  if (consent === null) {
    // No consent yet, show banner
    showBanner();
  } else if (consent === 'accepted') {
    // Consent given, load GTM
    loadGTM();
  }
  // If consent === 'rejected', do nothing (GTM not loaded)

  // Handle accept button
  document.getElementById('accept-cookies')?.addEventListener('click', () => {
    setCookie(COOKIE_NAME, 'accepted');
    loadGTM();
    hideBanner();
  });

  // Handle reject button
  document.getElementById('reject-cookies')?.addEventListener('click', () => {
    setCookie(COOKIE_NAME, 'rejected');
    hideBanner();
  });
</script>
```

## Implementation Steps

### Phase 1: Choose Solution

1. Review options above
2. Consider budget and customization needs
3. Evaluate legal requirements for your target audience

### Phase 2: Update BaseLayout.astro

**Current implementation loads GTM immediately:**

```astro
<!-- Remove this immediate GTM loading -->
<script is:inline define:vars={{ GTM_ID }}>
  (function(w,d,s,l,i){...})(window,document,'script','dataLayer',GTM_ID);
</script>
```

**Replace with conditional loading:**

```astro
---
// Only define GTM_ID, don't load yet
const GTM_ID = import.meta.env.PUBLIC_GTM_ID || 'GTM-KJZPCH44';
---

<head>
  <!-- Cookie consent component will handle GTM loading -->
  <script is:inline define:vars={{ GTM_ID }}>
    // Make GTM_ID available globally for consent script
    window.__GTM_ID__ = GTM_ID;
  </script>
</head>

<body>
  <CookieConsent />
  <!-- Rest of body -->
</body>
```

### Phase 3: Test Implementation

1. **Clear all cookies** in browser
2. **Visit site** - banner should appear
3. **Click "Reject"** - GTM should NOT load
4. **Clear cookies again**
5. **Click "Accept"** - GTM should load
6. **Check cookie storage** - preference should persist

### Phase 4: Verify Compliance

- [ ] Cookie banner appears before GTM loads
- [ ] GTM only loads after consent
- [ ] Cookie preference is stored
- [ ] Link to privacy policy is present
- [ ] User can withdraw consent
- [ ] Banner is accessible (keyboard navigation, screen readers)

## GTM Configuration for Consent

### Google Consent Mode V2

Update GTM to use Google's Consent Mode:

```javascript
// Before consent
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'wait_for_update': 500
});

// After consent granted
gtag('consent', 'update', {
  'analytics_storage': 'granted'
});
```

## Mobile Considerations

Ensure cookie banner is mobile-friendly:

```css
@media (max-width: 640px) {
  .cookie-content {
    flex-direction: column;
    text-align: center;
  }

  .cookie-buttons {
    width: 100%;
    flex-direction: column;
  }

  .btn-accept, .btn-reject {
    width: 100%;
  }
}
```

## Accessibility Requirements

- **Keyboard navigation**: Tab through all interactive elements
- **Screen reader support**: Use ARIA labels
- **Focus management**: Trap focus in modal if used
- **Clear language**: Simple, understandable text

```html
<button
  id="accept-cookies"
  class="btn-accept"
  aria-label="Accept cookies and enable analytics"
>
  Accepteren
</button>
```

## Performance Impact

Cookie consent solutions should:

- Load asynchronously
- Be < 50KB total size
- Not block page rendering
- Cache consent decision

## Testing Checklist

- [ ] Banner appears on first visit
- [ ] GTM blocked until consent
- [ ] "Accept" enables GTM
- [ ] "Reject" keeps GTM blocked
- [ ] Preference persists across sessions
- [ ] Works on mobile devices
- [ ] Keyboard accessible
- [ ] Screen reader friendly
- [ ] Works with CSP headers
- [ ] No console errors

## Recommended Libraries

1. **vanilla-cookieconsent** - Lightweight, no dependencies
2. **CookieYes** - SaaS solution, automatic compliance
3. **Osano** - Enterprise-grade, feature-rich
4. **Cookiebot** - Popular, good UX
5. **OneTrust** - Enterprise compliance platform

## Additional Resources

- [ICO Cookie Guidance](https://ico.org.uk/for-organisations/guide-to-pecr/guidance-on-the-use-of-cookies-and-similar-technologies/)
- [GDPR Cookie Consent Guide](https://gdpr.eu/cookies/)
- [Google Consent Mode Documentation](https://developers.google.com/tag-platform/security/guides/consent)
- [Cookie Consent Best Practices](https://www.cookieyes.com/cookie-consent-best-practices/)

---

**Priority Level:** LOW to MEDIUM (depending on target audience)

**Implementation Time:** 2-4 hours for basic solution, 1-2 days for enterprise solution

**Maintenance:** Minimal once implemented

**Last Updated:** 2025-10-02
