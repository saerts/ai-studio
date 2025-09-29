/**
 * Simple Scroll Animation System for AI Studio
 * Provides subtle scroll-triggered animations for all pages
 */
/* global window, document, IntersectionObserver */

export function initScrollAnimations() {
  if (typeof window === 'undefined') return;

  // Prevent double-initialization across pages and auto-init
  if (window.__aiScrollAnimationsInit) return;
  window.__aiScrollAnimationsInit = true;

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Smooth scrolling for anchor links (respect reduced motion)
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: prefersReduced ? 'auto' : 'smooth',
          block: 'start'
        });
      }
    });
  });

  if (prefersReduced) {
    // Disable animations and smooth scroll for reduced motion users
    document.documentElement.style.scrollBehavior = 'auto';
    return;
  }

  // Intersection Observer tuned for smoother early reveals
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -15% 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // small stagger based on element index within its parent
        const idx = Array.from(entry.target.parentElement?.children || []).indexOf(entry.target);
        if (idx > -1) entry.target.style.transitionDelay = `${Math.min(idx * 80, 400)}ms`;
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Find and animate elements
  const animationSelectors = [
    '.scroll-animate',
    '.scroll-animate-slide-left',
    '.scroll-animate-slide-right',
    '.scroll-animate-scale',
    '.scroll-animate-fade',
    '.scroll-animate-blur',
    '.scroll-animate-flip'
  ];

  animationSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.style.willChange = 'transform, opacity';
      observer.observe(element);
    });
  });

  // Enhance cards with default fade if no explicit scroll class
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 80}ms`;
    if (!card.classList.contains('scroll-animate') &&
        !card.classList.contains('scroll-animate-fade') &&
        !card.classList.contains('scroll-animate-scale') &&
        !card.classList.contains('scroll-animate-slide-left') &&
        !card.classList.contains('scroll-animate-slide-right')) {
      card.classList.add('scroll-animate-fade');
      observer.observe(card);
    }
  });

  // Smooth scrolling behavior
  document.documentElement.style.scrollBehavior = 'smooth';
}

// Auto-initialize when DOM is ready (guarded)
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations, { once: true });
  } else {
    initScrollAnimations();
  }
}
