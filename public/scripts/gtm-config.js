/**
 * GTM Configuration Script
 * This file is loaded from public/scripts to avoid CSP unsafe-inline issues
 * GTM ID is passed via data attribute on script tag
 */

(function () {
  'use strict';

  // Get GTM ID from script tag data attribute
  const scriptTag = document.currentScript;
  const gtmId = scriptTag ? scriptTag.dataset.gtmId : null;

  if (!gtmId) {
    console.error('[GTM Config] GTM ID not found on script tag');
    return;
  }

  // Make GTM ID available globally for cookie consent
  window.__GTM_ID__ = gtmId;
  window.__GTM_LOADED__ = false;

  console.log('[GTM Config] GTM ID configured:', gtmId);
})();
