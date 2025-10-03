/**
 * Contact Form Validation and Submission Handler
 * Handles form validation, anti-spam checks, and Web3Forms submission
 */

/* global FormData */

// Check if we're in development mode
const isDev =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1');

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

  // Helper to show error message
  const showError = (message) => {
    const errorElement = document.getElementById('form-error');
    if (errorElement) {
      // Update error message if custom message provided
      const messageElement = errorElement.querySelector('.mt-2');
      if (messageElement && message) {
        messageElement.textContent = message;
      }
      errorElement.classList.remove('hidden');
    }
  };

  // Helper to hide all messages
  const hideMessages = () => {
    document.getElementById('form-success')?.classList.add('hidden');
    document.getElementById('form-error')?.classList.add('hidden');
  };

  // Form submission with retry logic
  const submitForm = async (formData, retryCount = 0) => {
    const maxRetries = 2;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return { success: true };
      } else if (response.status >= 500 && retryCount < maxRetries) {
        // Server error - retry
        if (isDev) {
          console.log(
            `Server error, retrying... (${retryCount + 1}/${maxRetries})`
          );
        }
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (retryCount + 1))
        );
        return submitForm(formData, retryCount + 1);
      } else {
        return {
          success: false,
          error: 'server',
          message:
            'Er ging iets mis bij het versturen. Probeer het later opnieuw.',
        };
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'timeout',
          message:
            'De verbinding duurde te lang. Controleer je internetverbinding en probeer opnieuw.',
        };
      }

      if (!navigator.onLine) {
        return {
          success: false,
          error: 'offline',
          message:
            'Geen internetverbinding. Controleer je verbinding en probeer opnieuw.',
        };
      }

      // Network error - retry
      if (retryCount < maxRetries) {
        if (isDev) {
          console.log(
            `Network error, retrying... (${retryCount + 1}/${maxRetries})`
          );
        }
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (retryCount + 1))
        );
        return submitForm(formData, retryCount + 1);
      }

      return {
        success: false,
        error: 'network',
        message:
          'Netwerkfout. Probeer het opnieuw of stuur een e-mail naar hi@ai-studio44.com',
      };
    }
  };

  // Form submission handler
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Hide any previous messages
    hideMessages();

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
    if (honeypot?.checked) {
      // Silent fail for bots
      if (isDev) console.log('Bot detected via honeypot');
      return;
    }

    const timestamp = form.querySelector('[name="_timestamp"]');
    const submitTime = Date.now();
    const formLoadTime = parseInt(timestamp?.value || '0');
    if (submitTime - formLoadTime < 3000) {
      // Silent fail for bots
      if (isDev) console.log('Bot detected via timestamp (too fast)');
      return;
    }

    // Submit form
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Versturen...';
    submitButton.disabled = true;

    try {
      const formData = new FormData(form);
      const result = await submitForm(formData);

      if (result.success) {
        document.getElementById('form-success')?.classList.remove('hidden');
        form.reset();

        // Scroll to success message
        document.getElementById('form-success')?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      } else {
        showError(result.message);

        // Only log detailed errors in development
        if (isDev) {
          console.error('Form submission failed:', result.error);
        }
      }
    } catch (error) {
      // Fallback error handler
      showError('Er ging iets onverwachts mis. Probeer het opnieuw.');

      // Only log in development
      if (isDev) {
        console.error('Unexpected form error:', error);
      }
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });
});
