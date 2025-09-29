function u(){if(typeof window>"u"||window.__aiScrollAnimationsInit)return;window.__aiScrollAnimationsInit=!0;const n=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,o=h(),c=window.innerWidth<=768;if((o||c)&&w(),document.querySelectorAll('a[href^="#"]').forEach(e=>{e.addEventListener("click",function(i){const t=this.getAttribute("href");if(!t||t==="#")return;i.preventDefault();const r=t.substring(1),l=document.getElementById(r);l&&l.scrollIntoView({behavior:n?"auto":"smooth",block:"start"})})}),n){document.documentElement.style.scrollBehavior="auto";return}const d={threshold:o?.1:.12,rootMargin:o?"0px 0px -10% 0px":"0px 0px -15% 0px"},a=new IntersectionObserver(e=>{requestAnimationFrame(()=>{e.forEach(i=>{if(i.isIntersecting){const t=i.target,r=Array.from(t.parentElement?.children||[]).indexOf(t);if(r>-1){const l=o?Math.min(r*50,200):Math.min(r*80,400);t.style.transitionDelay=`${l}ms`}t.classList.add("animate-in","performance-optimized"),setTimeout(()=>{t.style.willChange="auto"},o?300:700),a.unobserve(t)}})})},d),p=[".scroll-animate",".scroll-animate-slide-left",".scroll-animate-slide-right",".scroll-animate-scale",".scroll-animate-fade",".scroll-animate-blur",".scroll-animate-flip"],m=[];p.forEach(e=>{const i=document.querySelectorAll(e);m.push(...i)}),requestAnimationFrame(()=>{m.forEach(e=>{o||(e.style.willChange="transform, opacity"),e.style.contain="layout style paint",a.observe(e)})});const y=document.querySelectorAll(".glass-card");requestAnimationFrame(()=>{y.forEach((e,i)=>{const t=o?i*50:i*80;e.style.transitionDelay=`${t}ms`,!e.classList.contains("scroll-animate")&&!e.classList.contains("scroll-animate-fade")&&!e.classList.contains("scroll-animate-scale")&&!e.classList.contains("scroll-animate-slide-left")&&!e.classList.contains("scroll-animate-slide-right")&&(e.classList.add("scroll-animate-fade"),o||(e.style.willChange="opacity"),a.observe(e))})}),document.documentElement.style.scrollBehavior="smooth"}function h(){const n=window.navigator,o=n.hardwareConcurrency||4,c=n.deviceMemory||4,s=n.connection,d=s&&(s.effectiveType==="slow-2g"||s.effectiveType==="2g"||s.saveData),a=/Android [1-4]|iPhone OS [1-9]_|iPad.*OS [1-9]_/.test(n.userAgent);return o<=2||c<=2||d||a}function w(){const n=document.createElement("style");n.textContent=`
    .float,
    .pulse-glow,
    .ai-animated-text {
      animation: none !important;
    }

    .blur-xl,
    .blur-2xl {
      filter: blur(4px) !important;
    }

    [class*="animate-pulse"]:not(.essential-pulse) {
      animation: none !important;
    }

    .glass-card::before,
    .glass-card::after {
      display: none;
    }
  `,document.head.appendChild(n)}function f(){return"IntersectionObserver"in window&&"IntersectionObserverEntry"in window&&"intersectionRatio"in window.IntersectionObserverEntry.prototype}typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{f()&&u()},{once:!0}):f()&&u());export{u as initScrollAnimations};
