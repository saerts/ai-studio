/**
 * Simple Scroll Animation System for AI Studio
 * Provides subtle scroll-triggered animations for all pages
 */

export function initScrollAnimations() {
  // Smooth scrolling for anchor links
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Simple Intersection Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
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
      observer.observe(element);
    });
  });

  // Simple card animations
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 100}ms`;
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

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}