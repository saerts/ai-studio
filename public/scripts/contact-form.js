/**
 * Contact Form Validation and Submission Handler
 * Handles form validation, anti-spam checks, and Web3Forms submission
 */

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  // Form validation
  const validateField = (field) => {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (!errorElement) return true;

    errorElement.classList.add('hidden');
    errorElement.textContent = '';

    if (field.hasAttribute('required') && !field.value.trim()) {
      errorElement.textContent = 'Dit veld is verplicht.';
      errorElement.classList.remove('hidden');
      return false;
    }

    if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        errorElement.textContent = 'Voer een geldig e-mailadres in.';
        errorElement.classList.remove('hidden');
        return false;
      }
    }

    return true;
  };

  // Real-time validation
  const fields = form.querySelectorAll('input[required], textarea[required]');
  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
  });

  // Form submission
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    fields.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) return;

    // Anti-spam checks
    const honeypot = form.querySelector('[name="botcheck"]');
    if (honeypot?.checked) return; // Bot detected

    const timestamp = form.querySelector('[name="_timestamp"]');
    const submitTime = Date.now();
    const formLoadTime = parseInt(timestamp?.value || '0');
    if (submitTime - formLoadTime < 3000) return; // Too fast, likely bot

    // Submit form
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Versturen...';
    submitButton.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        document.getElementById('form-success')?.classList.remove('hidden');
        form.reset();
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      document.getElementById('form-error')?.classList.remove('hidden');
      console.error('Form submission error:', error);
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });
});

// Initialize scroll animations
import('./scrollAnimations.js').then((module) => {
  if (module.initScrollAnimations) {
    module.initScrollAnimations();
  }
}).catch((error) => {
  console.error('Failed to load scroll animations:', error);
});
