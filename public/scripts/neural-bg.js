/**
 * Neural Network Background Animation
 * Renders floating particles with connecting lines on a canvas
 * Performance-optimized: respects reduced-motion, throttles on mobile, uses requestAnimationFrame
 */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  if (prefersReducedMotion) return;

  var canvas = document.getElementById('neural-bg');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var particles = [];
  var animationId = null;
  var isVisible = true;
  var isMobile = window.innerWidth < 768;
  var PARTICLE_COUNT = isMobile ? 30 : 60;
  var CONNECTION_DISTANCE = isMobile ? 120 : 180;
  var MOUSE = { x: -1000, y: -1000 };
  var MOUSE_RADIUS = 200;

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticle() {
    var rect = canvas.parentElement.getBoundingClientRect();
    return {
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      // Teal/cyan color mix
      hue: Math.random() > 0.5 ? 174 : 187,
    };
  }

  function init() {
    resize();
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function draw() {
    if (!isVisible) {
      animationId = requestAnimationFrame(draw);
      return;
    }

    var rect = canvas.parentElement.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // Update and draw particles
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Mouse repulsion
      var dx = p.x - MOUSE.x;
      var dy = p.y - MOUSE.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS && dist > 0) {
        var force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        p.vx += (dx / dist) * force * 0.02;
        p.vy += (dy / dist) * force * 0.02;
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
      ctx.fillStyle =
        'hsla(' + p.hue + ', 80%, 70%, ' + p.opacity + ')';
      ctx.fill();
    }

    // Draw connections
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DISTANCE) {
          var alpha = (1 - dist / CONNECTION_DISTANCE) * 0.15;
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
      var rp = particles[Math.floor(Math.random() * particles.length)];
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34, 211, 238, 0.15)';
      ctx.fill();
    }

    animationId = requestAnimationFrame(draw);
  }

  // Mouse tracking (desktop only, throttled)
  if (!isMobile) {
    var throttled = false;
    document.addEventListener('mousemove', function (e) {
      if (throttled) return;
      throttled = true;
      requestAnimationFrame(function () {
        var rect = canvas.getBoundingClientRect();
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
    isVisible = !document.hidden;
  });

  // Intersection Observer: only animate when hero is visible
  var observer = new IntersectionObserver(
    function (entries) {
      isVisible = entries[0].isIntersecting;
    },
    { threshold: 0 }
  );

  var heroSection = canvas.parentElement;
  if (heroSection) {
    observer.observe(heroSection);
  }

  // Debounced resize
  var resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      isMobile = window.innerWidth < 768;
      init();
    }, 250);
  });

  // Start
  init();
  draw();
})();
