/**
 * AI voor Bedrijven Page Interactions
 * Handles reading progress, animations, and counter effects
 */

document.addEventListener('DOMContentLoaded', () => {
  // Reading Progress Bar
  const progressBar = document.getElementById('readingProgress');

  const updateProgress = () => {
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;
    const progress = (scrollPosition / scrollHeight) * 100;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  };

  window.addEventListener('scroll', updateProgress);

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all animated elements
  document.querySelectorAll('.fade-in, .scale-in').forEach((el) => {
    observer.observe(el);
  });

  // Animated counters
  const animateCounter = (element) => {
    const target = parseInt(element.dataset.target || '0');
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        element.textContent = Math.floor(current).toString();
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toString();
      }
    };

    updateCounter();
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target instanceof HTMLElement) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-number').forEach((el) => {
    counterObserver.observe(el);
  });

  // Reading time calculation
  const calculateReadingTime = () => {
    const text = document.querySelector('main')?.textContent || '';
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);

    const readTimeElement = document.getElementById('readTime');
    if (readTimeElement) {
      readTimeElement.textContent = `${readingTime} min leestijd`;
    }
  };

  calculateReadingTime();
});
