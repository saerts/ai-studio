/**
 * Optimized Scroll Animation System for AI Studio
 * Provides performant scroll-triggered animations with device-specific optimizations
 */
/* global window, document, IntersectionObserver, requestAnimationFrame */

export function initScrollAnimations() {
  if (typeof window === 'undefined') return;

  // Prevent double-initialization across pages and auto-init
  if (window.__aiScrollAnimationsInit) return;
  window.__aiScrollAnimationsInit = true;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isLowEndDevice = detectLowEndDevice();
  const isMobile = window.innerWidth <= 768;

  // Performance optimization for low-end devices
  if (isLowEndDevice || isMobile) {
    optimizeForLowEndDevice();
  }

  // Smooth scrolling for anchor links (respect reduced motion)
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  scrollLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: prefersReduced ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    });
  });

  if (prefersReduced) {
    // Disable animations and smooth scroll for reduced motion users
    document.documentElement.style.scrollBehavior = 'auto';
    return;
  }

  // Intersection Observer tuned for performance and smooth reveals
  const observerOptions = {
    threshold: isLowEndDevice ? 0.1 : 0.12,
    rootMargin: isLowEndDevice ? '0px 0px -10% 0px' : '0px 0px -15% 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    // Batch DOM updates for better performance
    requestAnimationFrame(() => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;

          // Reduced stagger for low-end devices
          const idx = Array.from(element.parentElement?.children || []).indexOf(
            element
          );
          if (idx > -1) {
            const delay = isLowEndDevice
              ? Math.min(idx * 50, 200)
              : Math.min(idx * 80, 400);
            element.style.transitionDelay = `${delay}ms`;
          }

          // Add performance optimization class
          element.classList.add('animate-in', 'performance-optimized');

          // Clean up will-change after animation
          setTimeout(
            () => {
              element.style.willChange = 'auto';
            },
            isLowEndDevice ? 300 : 700
          );

          observer.unobserve(element);
        }
      });
    });
  }, observerOptions);

  // Find and animate elements with performance optimizations
  const animationSelectors = [
    '.scroll-animate',
    '.scroll-animate-slide-left',
    '.scroll-animate-slide-right',
    '.scroll-animate-scale',
    '.scroll-animate-fade',
    '.scroll-animate-blur',
    '.scroll-animate-flip',
  ];

  // Batch DOM operations
  const allElements = [];
  animationSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    allElements.push(...elements);
  });

  // Apply optimizations in batches
  requestAnimationFrame(() => {
    allElements.forEach((element) => {
      // Optimize will-change for performance
      if (!isLowEndDevice) {
        element.style.willChange = 'transform, opacity';
      }

      // Add performance container
      element.style.contain = 'layout style paint';

      observer.observe(element);
    });
  });

  // Enhance cards with default fade if no explicit scroll class (optimized)
  const cards = document.querySelectorAll('.glass-card');

  // Batch card processing
  requestAnimationFrame(() => {
    cards.forEach((card, index) => {
      const delay = isLowEndDevice ? index * 50 : index * 80;
      card.style.transitionDelay = `${delay}ms`;

      if (
        !card.classList.contains('scroll-animate') &&
        !card.classList.contains('scroll-animate-fade') &&
        !card.classList.contains('scroll-animate-scale') &&
        !card.classList.contains('scroll-animate-slide-left') &&
        !card.classList.contains('scroll-animate-slide-right')
      ) {
        card.classList.add('scroll-animate-fade');
        if (!isLowEndDevice) {
          card.style.willChange = 'opacity';
        }
        observer.observe(card);
      }
    });
  });

  // Smooth scrolling behavior
  document.documentElement.style.scrollBehavior = 'smooth';
}

// Performance detection utility
function detectLowEndDevice() {
  // Check for various performance indicators
  const navigator = window.navigator;

  // Check CPU cores (if available)
  const cores = navigator.hardwareConcurrency || 4;

  // Check memory (if available)
  const memory = navigator.deviceMemory || 4;

  // Check connection (if available)
  const connection = navigator.connection;
  const slowConnection =
    connection &&
    (connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      connection.saveData);

  // Detect old mobile devices by user agent
  const oldMobile = /Android [1-4]|iPhone OS [1-9]_|iPad.*OS [1-9]_/.test(
    navigator.userAgent
  );

  return cores <= 2 || memory <= 2 || slowConnection || oldMobile;
}

// Low-end device optimizations
function optimizeForLowEndDevice() {
  // Disable heavy animations
  const style = document.createElement('style');
  style.textContent = `
    .float,
    .pulse-glow,
    .ai-animated-text {
      animation: none !important;
    }

    .blur-xl,
    .blur-2xl {
      filter: blur(4px) !important;
    }

    [class*="animate-pulse"]:not(.essential-pulse) {
      animation: none !important;
    }

    .glass-card::before,
    .glass-card::after {
      display: none;
    }
  `;
  document.head.appendChild(style);
}

// Intersection Observer polyfill check
function supportsIntersectionObserver() {
  return (
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype
  );
}

// Auto-initialize when DOM is ready (guarded)
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        // Only initialize if browser supports Intersection Observer
        if (supportsIntersectionObserver()) {
          initScrollAnimations();
        }
      },
      { once: true }
    );
  } else {
    if (supportsIntersectionObserver()) {
      initScrollAnimations();
    }
  }
}
