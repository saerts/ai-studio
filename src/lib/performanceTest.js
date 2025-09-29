/* eslint-env browser */
/* global window, document, performance, requestAnimationFrame */
/**
 * Performance Testing Utility for Animation Optimizations
 * Tests animation performance under various device conditions
 */

export function testAnimationPerformance() {
  if (typeof window === 'undefined') return;

  const results = {
    deviceType: detectDeviceType(),
    animationOptimizations: testAnimationOptimizations(),
    memoryUsage: getMemoryUsage(),
    animationCount: countActiveAnimations(),
    recommendations: [],
  };

  // Generate recommendations based on results
  generateRecommendations(results);

  console.log('Animation Performance Test Results:', results);
  return results;
}

function detectDeviceType() {
  const navigator = window.navigator;
  const cores = navigator.hardwareConcurrency || 'unknown';
  const memory = navigator.deviceMemory || 'unknown';
  const connection = navigator.connection;

  let deviceType = 'desktop';
  if (window.innerWidth <= 768) deviceType = 'mobile';
  if (cores <= 2 || memory <= 2) deviceType = 'low-end';
  if (
    connection &&
    (connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g')
  ) {
    deviceType = 'low-end';
  }

  return {
    type: deviceType,
    cores,
    memory,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    connection: connection ? connection.effectiveType : 'unknown',
  };
}

function testAnimationOptimizations() {
  const optimizations = {
    gpuAcceleration: 0,
    willChangeOptimized: 0,
    transform3d: 0,
    containOptimized: 0,
    reducedMotionRespected: window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches,
  };

  // Test GPU acceleration
  document.querySelectorAll('.performance-optimized').forEach(() => {
    optimizations.gpuAcceleration++;
  });

  // Test will-change optimization
  document.querySelectorAll('[style*="will-change"]').forEach(() => {
    optimizations.willChangeOptimized++;
  });

  // Test 3D transforms
  document
    .querySelectorAll('[style*="translate3d"], [class*="translate3d"]')
    .forEach(() => {
      optimizations.transform3d++;
    });

  // Test CSS containment
  document.querySelectorAll('[style*="contain"]').forEach(() => {
    optimizations.containOptimized++;
  });

  return optimizations;
}

function getMemoryUsage() {
  if (performance.memory) {
    return {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576), // MB
    };
  }
  return { used: 'unknown', total: 'unknown', limit: 'unknown' };
}

function countActiveAnimations() {
  const counts = {
    cssAnimations: 0,
    infiniteAnimations: 0,
    concurrentAnimations: 0,
    heavyBlurEffects: 0,
  };

  // Count CSS animations
  document
    .querySelectorAll('[class*="animate-"], [class*="float"], [class*="pulse"]')
    .forEach(() => {
      counts.cssAnimations++;
    });

  // Count infinite animations
  document
    .querySelectorAll('.ai-animated-text, .float, .pulse-glow')
    .forEach(() => {
      counts.infiniteAnimations++;
    });

  // Count blur effects
  document.querySelectorAll('[class*="blur-"]').forEach((el) => {
    if (el.classList.contains('blur-xl') || el.classList.contains('blur-2xl')) {
      counts.heavyBlurEffects++;
    }
  });

  // Estimate concurrent animations (simplified)
  counts.concurrentAnimations =
    counts.cssAnimations + counts.infiniteAnimations;

  return counts;
}

function generateRecommendations(results) {
  const { deviceType, animationCount, animationOptimizations } = results;

  // Device-specific recommendations
  if (deviceType.type === 'low-end' || deviceType.type === 'mobile') {
    if (animationCount.infiniteAnimations > 3) {
      results.recommendations.push(
        'Consider reducing infinite animations for low-end devices'
      );
    }
    if (animationCount.heavyBlurEffects > 2) {
      results.recommendations.push(
        'Reduce heavy blur effects on mobile/low-end devices'
      );
    }
  }

  // Optimization recommendations
  if (animationOptimizations.gpuAcceleration === 0) {
    results.recommendations.push(
      'Add GPU acceleration classes to animated elements'
    );
  }

  if (animationCount.concurrentAnimations > 10) {
    results.recommendations.push(
      'Too many concurrent animations may cause performance issues'
    );
  }

  if (!animationOptimizations.reducedMotionRespected) {
    results.recommendations.push(
      'System prefers reduced motion - consider disabling animations'
    );
  }

  if (results.recommendations.length === 0) {
    results.recommendations.push('Animation performance appears optimized');
  }
}

// Performance monitoring utility
export function monitorAnimationPerformance(duration = 5000) {
  if (typeof window === 'undefined') return;

  let frameCount = 0;
  let lastTime = performance.now();
  const frameTimes = [];

  function measureFrame() {
    const currentTime = performance.now();
    const frameTime = currentTime - lastTime;
    frameTimes.push(frameTime);
    frameCount++;
    lastTime = currentTime;

    if (frameCount * 16.67 < duration) {
      // Continue for specified duration
      requestAnimationFrame(measureFrame);
    } else {
      // Calculate performance metrics
      const avgFrameTime =
        frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      const fps = 1000 / avgFrameTime;
      const droppedFrames = frameTimes.filter((time) => time > 16.67).length;

      console.log('Animation Performance Monitor:', {
        duration: duration + 'ms',
        totalFrames: frameCount,
        averageFPS: Math.round(fps),
        droppedFrames,
        performance: fps >= 50 ? 'Good' : fps >= 30 ? 'Fair' : 'Poor',
      });
    }
  }

  requestAnimationFrame(measureFrame);
}

// Export for testing in browser console
if (typeof window !== 'undefined') {
  window.testAnimationPerformance = testAnimationPerformance;
  window.monitorAnimationPerformance = monitorAnimationPerformance;
}
