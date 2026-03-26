/**
 * Vibe Coding Page Interactions
 * Handles reading progress, animations, and counter effects
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Reading Progress Bar
  const progressBar = document.getElementById('readingProgress');

  if (progressBar) {
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    progressBar.setAttribute('aria-valuenow', '0');
    progressBar.setAttribute('aria-label', 'Leesindicator');
  }

  const updateProgress = () => {
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;
    const progress = Math.round((scrollPosition / scrollHeight) * 100);

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
      progressBar.setAttribute('aria-valuenow', String(progress));
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

  // Animated counters (respect reduced motion)
  if (!prefersReducedMotion) {
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
  } else {
    // Show final values immediately
    document.querySelectorAll('.stat-number').forEach((el) => {
      if (el instanceof HTMLElement) {
        el.textContent = el.dataset.target || '0';
      }
    });
  }

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
