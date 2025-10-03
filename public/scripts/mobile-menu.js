/**
 * Mobile Menu Handler
 */

document.addEventListener('DOMContentLoaded', function () {
  const menuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuIcon = document.querySelector('.menu-icon');
  const closeIcon = document.querySelector('.close-icon');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');

  if (!menuButton || !mobileMenu || !menuIcon || !closeIcon) return;

  // Set current page state for mobile menu items
  const currentPath = window.location.pathname;
  const mobileLinks = mobileMenu.querySelectorAll('a[data-current-class]');

  mobileLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const currentClass = link.getAttribute('data-current-class') || '';

    if (href === currentPath || (currentPath === '/' && href === '/')) {
      link.className = link.className
        .replace(/text-white\/80.*?(?=\s|$)/g, '')
        .trim();
      link.className += ` ${currentClass}`;
      link.setAttribute('aria-current', 'page');
    }
  });

  // Toggle mobile menu
  function toggleMobileMenu() {
    if (!menuButton || !mobileMenu || !menuIcon || !closeIcon) return;
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';

    menuButton.setAttribute('aria-expanded', (!isExpanded).toString());

    if (isExpanded) {
      mobileMenu.classList.add('hidden');
      menuIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
      document.body.style.overflow = '';
    } else {
      mobileMenu.classList.remove('hidden');
      menuIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  // Event listeners
  menuButton.addEventListener('click', toggleMobileMenu);

  // Close button in mobile menu
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', toggleMobileMenu);
  }

  // Close menu when clicking on a link
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (!mobileMenu.classList.contains('hidden')) {
        toggleMobileMenu();
      }
    });
  });

  // Close menu when clicking on backdrop
  mobileMenu.addEventListener('click', (event) => {
    if (
      event.target === mobileMenu ||
      event.target.hasAttribute('aria-hidden')
    ) {
      toggleMobileMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      toggleMobileMenu();
      if (menuButton) menuButton.focus(); // Return focus to menu button
    }
  });

  // Handle focus trapping in mobile menu
  mobileMenu.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      const focusableElements = mobileMenu.querySelectorAll('a, button');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement && lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement && firstElement.focus();
        }
      }
    }
  });
});
