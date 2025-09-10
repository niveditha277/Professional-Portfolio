// Lightweight visual effects: scroll reveal + tilt interactions
// Applies to elements with classes: .reveal, .tilt-hover or [data-tilt]

(function(){
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll Reveal
  function setupReveal(){
    const revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if(revealEls.length === 0){ return; }
    if(prefersReduced){
      revealEls.forEach(function(el){ el.classList.add('reveal-visible'); });
      return;
    }
    const observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
    revealEls.forEach(function(el){ observer.observe(el); });
  }

  // Tilt Hover (JS-powered for smoother control)
  function setupTilt(){
    const tiltEls = Array.prototype.slice.call(document.querySelectorAll('[data-tilt], .tilt-hover'));
    if(tiltEls.length === 0){ return; }
    if(prefersReduced){ return; }

    tiltEls.forEach(function(el){
      const maxTilt = parseFloat(el.getAttribute('data-tilt') || '6'); // degrees
      const perspective = parseFloat(el.getAttribute('data-tilt-perspective') || '800');
      let rafId = 0, currentX = 0, currentY = 0, targetX = 0, targetY = 0;

      function onMouseMove(e){
        const rect = el.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width;  // 0..1
        const relY = (e.clientY - rect.top) / rect.height; // 0..1
        const tiltY = (relX - 0.5) * (maxTilt * 2); // rotateY
        const tiltX = (0.5 - relY) * (maxTilt * 2); // rotateX
        targetX = tiltX; targetY = tiltY;
        if(!rafId){ rafId = requestAnimationFrame(applyTilt); }
      }

      function applyTilt(){
        // simple easing
        currentX += (targetX - currentX) * 0.18;
        currentY += (targetY - currentY) * 0.18;
        el.style.transform = 'perspective(' + perspective + 'px) rotateX(' + currentX.toFixed(2) + 'deg) rotateY(' + currentY.toFixed(2) + 'deg) translateY(-4px)';
        if(Math.abs(currentX - targetX) > 0.05 || Math.abs(currentY - targetY) > 0.05){
          rafId = requestAnimationFrame(applyTilt);
        } else {
          rafId = 0;
        }
      }

      function onLeave(){
        targetX = 0; targetY = 0;
        if(!rafId){ rafId = requestAnimationFrame(applyTilt); }
      }

      el.addEventListener('mousemove', onMouseMove, { passive: true });
      el.addEventListener('mouseleave', onLeave, { passive: true });
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      setupReveal();
      setupTilt();
    });
  } else {
    setupReveal();
    setupTilt();
  }
})();

// Typewriter effect for roles/services
(function(){
  var el = document.querySelector('.typing');
  if(!el){ return; }
  var phrasesAttr = el.getAttribute('data-phrases') || '';
  var phrases = phrasesAttr.split(';').map(function(s){ return s.trim(); }).filter(Boolean);
  if(phrases.length === 0){ phrases = ['Web Developer']; }
  var idx = 0, charIdx = 0, typing = true;
  function tick(){
    var current = phrases[idx];
    if(typing){
      charIdx++;
      if(charIdx > current.length){ typing = false; setTimeout(tick, 1200); return; }
    } else {
      charIdx--;
      if(charIdx < 0){ typing = true; idx = (idx+1)%phrases.length; setTimeout(tick, 300); return; }
    }
    el.textContent = current.substring(0, Math.max(0,charIdx));
    setTimeout(tick, typing ? 90 : 40);
  }
  tick();
})();


