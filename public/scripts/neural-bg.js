/**
 * Neural Network Background Animation
 * Renders floating particles with connecting lines on a canvas
 * Performance-optimized: respects reduced-motion, pauses when hidden, uses requestAnimationFrame
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  if (prefersReducedMotion) return;

  const canvas = document.getElementById('neural-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let particles = [];
  let animationId = null;
  let isVisible = true;
  let isMobile = window.innerWidth < 768;
  let PARTICLE_COUNT = isMobile ? 30 : 60;
  const CONNECTION_DIST_SQ_MOBILE = 120 * 120;
  const CONNECTION_DIST_SQ_DESKTOP = 180 * 180;
  let CONNECTION_DIST_SQ = isMobile ? CONNECTION_DIST_SQ_MOBILE : CONNECTION_DIST_SQ_DESKTOP;
  let CONNECTION_DISTANCE = isMobile ? 120 : 180;
  const MOUSE = { x: -1000, y: -1000 };
  const MOUSE_RADIUS = 200;
  const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;

  // Cached dimensions — updated only on resize
  let canvasW = 0;
  let canvasH = 0;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    canvasW = rect.width;
    canvasH = rect.height;
  }

  function createParticle() {
    return {
      x: Math.random() * canvasW,
      y: Math.random() * canvasH,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      hue: Math.random() > 0.5 ? 174 : 187,
    };
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function startLoop() {
    if (animationId !== null) return;
    animationId = requestAnimationFrame(draw);
  }

  function stopLoop() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  function setVisible(visible) {
    if (isVisible === visible) return;
    isVisible = visible;
    if (visible) {
      startLoop();
    } else {
      stopLoop();
    }
  }

  function draw() {
    animationId = null;

    const w = canvasW;
    const h = canvasH;

    ctx.clearRect(0, 0, w, h);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Mouse repulsion using squared distance
      const mdx = p.x - MOUSE.x;
      const mdy = p.y - MOUSE.y;
      const mdistSq = mdx * mdx + mdy * mdy;
      if (mdistSq < MOUSE_RADIUS_SQ && mdistSq > 0) {
        const dist = Math.sqrt(mdistSq);
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        p.vx += (mdx / dist) * force * 0.02;
        p.vy += (mdy / dist) * force * 0.02;
      }

      // Damping
      p.vx *= 0.99;
      p.vy *= 0.99;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(' + p.hue + ', 80%, 70%, ' + p.opacity + ')';
      ctx.fill();
    }

    // Draw connections using squared distance to avoid sqrt
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;

        if (distSq < CONNECTION_DIST_SQ) {
          const dist = Math.sqrt(distSq);
          const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(45, 212, 191, ' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Occasional pulse on random particle
    if (Math.random() < 0.01) {
      const rp = particles[Math.floor(Math.random() * particles.length)];
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34, 211, 238, 0.15)';
      ctx.fill();
    }

    animationId = requestAnimationFrame(draw);
  }

  // Mouse tracking (desktop only, throttled)
  if (!isMobile) {
    let throttled = false;
    document.addEventListener('mousemove', function (e) {
      if (throttled) return;
      throttled = true;
      requestAnimationFrame(function () {
        const rect = canvas.getBoundingClientRect();
        MOUSE.x = e.clientX - rect.left;
        MOUSE.y = e.clientY - rect.top;
        throttled = false;
      });
    });

    document.addEventListener('mouseleave', function () {
      MOUSE.x = -1000;
      MOUSE.y = -1000;
    });
  }

  // Visibility API: pause when tab is hidden
  document.addEventListener('visibilitychange', function () {
    setVisible(!document.hidden);
  });

  // Intersection Observer: only animate when section is visible
  const observer = new IntersectionObserver(
    function (entries) {
      setVisible(entries[0].isIntersecting);
    },
    { threshold: 0 }
  );

  const heroSection = canvas.parentElement;
  if (heroSection) {
    observer.observe(heroSection);
  }

  // Debounced resize
  let resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      isMobile = window.innerWidth < 768;
      PARTICLE_COUNT = isMobile ? 30 : 60;
      CONNECTION_DIST_SQ = isMobile ? CONNECTION_DIST_SQ_MOBILE : CONNECTION_DIST_SQ_DESKTOP;
      CONNECTION_DISTANCE = isMobile ? 120 : 180;
      init();
    }, 250);
  });

  // Start
  init();
  startLoop();
})();
