// Contact form handling with EmailJS
(function(){
  if(!window.emailjs){ return; }
  // Configure sending
  var TARGET_EMAIL = "nivedithaarlagadda@gmail.com"; // destination inbox
  // TODO: Replace with your EmailJS keys if you want direct serverless send
  var EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // e.g., "r4nd0mPubKey"
  var EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // e.g., "service_xxxxx"
  var EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // e.g., "template_xxxxx"

  try{ emailjs.init(EMAILJS_PUBLIC_KEY); }catch(err){}

  var form = document.getElementById('contactForm');
  var statusEl = document.getElementById('formStatus');
  if(!form){ return; }

  function validateEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();

    var formData = new FormData(form);
    var name = (formData.get('name')||'').toString().trim();
    var email = (formData.get('email')||'').toString().trim();
    var subject = (formData.get('subject')||'').toString().trim();
    var message = (formData.get('message')||'').toString().trim();

    if(!name || !email || !subject || !message){
      if(statusEl){ statusEl.textContent = 'Please fill in all fields.'; }
      return;
    }
    if(!validateEmail(email)){
      if(statusEl){ statusEl.textContent = 'Please enter a valid email address.'; }
      return;
    }

    if(!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || EMAILJS_PUBLIC_KEY.indexOf('YOUR_')===0){
      // Mailto fallback if EmailJS not configured yet
      var mailtoHref = 'mailto:' + encodeURIComponent(TARGET_EMAIL)
        + '?subject=' + encodeURIComponent(subject + ' — from ' + name)
        + '&body=' + encodeURIComponent(message + '\n\nFrom: ' + name + ' <' + email + '>');
      window.location.href = mailtoHref;
      return;
    }

    if(statusEl){ statusEl.textContent = 'Sending...'; }
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name: name,
      from_email: email,
      to_email: TARGET_EMAIL,
      subject: subject,
      message: message
    }).then(function(){
      if(statusEl){ statusEl.textContent = 'Message sent! Redirecting...'; }
      // Redirect after short delay
      setTimeout(function(){ window.location.href = '#home'; }, 900);
      form.reset();
    }).catch(function(err){
      if(statusEl){ statusEl.textContent = 'Failed to send. Please try again later.'; }
      console.error('EmailJS error:', err);
    });
  });
})();

// Hide broken project images and add gradient fallback
(function(){
  function markMissing(img){
    var wrapper = img.closest('.portfolio-item-inner');
    if(wrapper){ wrapper.classList.add('thumb-missing'); }
  }
  document.querySelectorAll('.portfolio .portfolio-item-inner img').forEach(function(img){
    if(!img.complete){
      img.addEventListener('error', function(){ markMissing(img); });
    } else if(img.naturalWidth === 0){
      markMissing(img);
    }
  });
})();

// Verify resume file exists and fix hrefs if needed
(function(){
  function setHref(el, href){
    el.setAttribute('href', href);
  }
  function setUnavailable(el){
    el.textContent = 'Resume';
    el.classList.remove('btn-gradient','btn-glow');
    el.classList.add('btn-outline');
    el.setAttribute('href', '#');
  }
  var candidates = [
    'resume/niveditha_arlagadda_resume.pdf',
    'assets/resume/Niveditha_Resume.pdf'
  ];
  var buttons = Array.prototype.slice.call(document.querySelectorAll('a'))
    .filter(function(el){ return /resume/i.test(el.textContent); });
  if(buttons.length === 0){ return; }

  // If buttons already point to a PDF, do not override
  var alreadyOk = buttons.every(function(btn){
    var href = (btn.getAttribute('href')||'').toLowerCase();
    return href.endsWith('.pdf');
  });
  if(alreadyOk){ return; }

  // Try candidates in order
  (function tryNext(idx){
    if(idx >= candidates.length){
      buttons.forEach(setUnavailable);
      return;
    }
    var candidate = candidates[idx];
    // If running from file:// protocol, skip HEAD and just set the first candidate
    if(location.protocol === 'file:'){
      buttons.forEach(function(btn){ setHref(btn, candidate); });
      return;
    }
    var path = candidate + '?t=' + Date.now();
    fetch(path, { method:'HEAD' }).then(function(res){
      if(res.ok){
        buttons.forEach(function(btn){ setHref(btn, candidate); });
      } else {
        tryNext(idx+1);
      }
    }).catch(function(){ tryNext(idx+1); });
  })(0);
})();

// Footer year
(function(){
  var y = document.getElementById('year');
  if(y){ y.textContent = new Date().getFullYear(); }
})();

// Theme toggle with persistence
(function(){
  var btn = document.getElementById('themeToggle');
  if(!btn){ return; }
  function apply(mode){
    if(mode === 'dark'){
      document.body.classList.add('dark');
      btn.innerHTML = '<i class="fa fa-sun"></i>';
      localStorage.setItem('theme','dark');
    } else {
      document.body.classList.remove('dark');
      btn.innerHTML = '<i class="fa fa-moon"></i>';
      localStorage.setItem('theme','light');
    }
  }
  var saved = localStorage.getItem('theme');
  apply(saved || 'light');
  btn.addEventListener('click', function(){
    apply(document.body.classList.contains('dark') ? 'light' : 'dark');
  });
})();
