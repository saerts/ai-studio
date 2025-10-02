# Analytics Setup Guide

This document outlines the analytics and tracking implementation for AI Studio.

## Google Tag Manager (GTM)

### Overview

AI Studio uses Google Tag Manager for centralized analytics and tracking management. GTM allows for flexible tag deployment without code changes.

### Current Implementation

**GTM Container ID:** `GTM-KJZPCH44`

The GTM implementation is located in `/src/components/layout/BaseLayout.astro`:

```astro
<!-- Google Tag Manager - Head -->
<script is:inline>
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-KJZPCH44');
</script>

<!-- Google Tag Manager - Body (noscript fallback) -->
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KJZPCH44"
    height="0" width="0" style="display:none;visibility:hidden">
  </iframe>
</noscript>
```

### Key Features

- **`is:inline` directive**: Ensures GTM script is not processed by Astro's build system
- **Dual implementation**: Script in `<head>` and noscript fallback in `<body>`
- **DataLayer**: Uses standard `dataLayer` for event tracking

## Google Site Verification

**Verification Code:** `29wxEwJLhETUXjq2CAl5-Sfo2DYfhFNqmr2AjOQuBSI`

```html
<meta name="google-site-verification" content="29wxEwJLhETUXjq2CAl5-Sfo2DYfhFNqmr2AjOQuBSI" />
```

This meta tag verifies domain ownership for Google Search Console.

## Environment Variables (Optional)

For easier configuration across environments, you can optionally use environment variables:

### Step 1: Create `.env` file

```bash
# Google Tag Manager
PUBLIC_GTM_ID=GTM-KJZPCH44

# Google Site Verification
PUBLIC_GOOGLE_SITE_VERIFICATION=29wxEwJLhETUXjq2CAl5-Sfo2DYfhFNqmr2AjOQuBSI
```

### Step 2: Update BaseLayout.astro

```astro
---
const GTM_ID = import.meta.env.PUBLIC_GTM_ID || 'GTM-KJZPCH44';
const GOOGLE_VERIFICATION = import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION || '29wxEwJLhETUXjq2CAl5-Sfo2DYfhFNqmr2AjOQuBSI';
---

<head>
  <meta name="google-site-verification" content={GOOGLE_VERIFICATION} />
  <script is:inline define:vars={{ GTM_ID }}>
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',GTM_ID);
  </script>
</head>
```

## Privacy Compliance

### GDPR Considerations

GTM implementation must comply with GDPR requirements:

1. **Privacy Policy**: Ensure `/privacy` page documents GTM usage
2. **Cookie Consent**: Consider implementing cookie consent banner
3. **Data Processing Agreement**: Ensure DPA is signed with Google

### Current Privacy Policy Status

The privacy policy should include:

- Information about Google Tag Manager usage
- Types of data collected (IP addresses, page views, user interactions)
- Purpose of data collection (analytics, marketing)
- User rights (opt-out options)
- Third-party data sharing (Google)

## Custom Event Tracking

### DataLayer Events

You can push custom events to GTM's dataLayer:

```javascript
// Contact form submission
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event': 'form_submission',
  'form_name': 'contact',
  'form_location': 'contact_page'
});

// AI consultation request
window.dataLayer.push({
  'event': 'consultation_request',
  'service_type': 'ai_implementation'
});

// Newsletter signup
window.dataLayer.push({
  'event': 'newsletter_signup',
  'signup_location': 'footer'
});
```

### Recommended GTM Tags to Configure

1. **Google Analytics 4 (GA4)**
   - Property ID: Configure in GTM
   - Enhanced measurement: Page views, scrolls, outbound clicks
   - Custom events: Form submissions, consultation requests

2. **LinkedIn Insight Tag**
   - Partner ID: Configure in GTM
   - Conversion tracking for B2B leads

3. **Facebook Pixel** (optional)
   - Pixel ID: Configure in GTM
   - Event tracking for remarketing

## Testing & Validation

### GTM Preview Mode

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Select your container (GTM-KJZPCH44)
3. Click "Preview" button
4. Enter your site URL
5. Verify tags fire correctly

### Browser Console Check

```javascript
// Check if GTM is loaded
console.log(window.google_tag_manager);

// Check dataLayer
console.log(window.dataLayer);
```

### Chrome Extension

Install [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk) to debug tags.

## Troubleshooting

### GTM Not Loading

1. **Check Network Tab**: Verify `gtm.js` loads without errors
2. **Check Console**: Look for JavaScript errors blocking GTM
3. **Verify Container ID**: Ensure `GTM-KJZPCH44` is correct
4. **Check CSP Headers**: Ensure Content Security Policy allows GTM

### Tags Not Firing

1. **Use GTM Preview Mode**: Debug which tags fire on which pages
2. **Check Triggers**: Verify trigger conditions in GTM
3. **Check DataLayer**: Ensure events are pushed correctly

### Performance Impact

GTM is loaded asynchronously to minimize performance impact:

- Script uses `async=true`
- Loaded after initial page render
- Non-blocking implementation

## Migration Notes

If changing GTM containers:

1. Update container ID in `BaseLayout.astro`
2. Update `.env` if using environment variables
3. Test all tags in preview mode
4. Deploy during low-traffic period
5. Monitor for 24-48 hours

## Additional Resources

- [Google Tag Manager Documentation](https://support.google.com/tagmanager)
- [GTM Best Practices](https://support.google.com/tagmanager/answer/9442095)
- [GDPR Compliance Guide](https://support.google.com/analytics/answer/9019185)
- [Astro Script Directives](https://docs.astro.build/en/guides/client-side-scripts/)

---

**Last Updated:** 2025-10-02
**Maintained By:** AI Studio Development Team
