/* ══════════════════════════════════════════════
   CONTACT.JS – Stackly Contact Page
   Handles: hero particles, scroll reveal, form validation → direct 404 redirect,
   newsletter subscription, and counter animation for hero stats.
══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {

  // ─── PARTICLES ──────────────────────────────
  (function initContactParticles() {
    var canvas = document.getElementById('contact-particles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, particles = [];

    function resize() {
      W = canvas.width = canvas.offsetWidth || window.innerWidth;
      H = canvas.height = canvas.offsetHeight || window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var COUNT = 70;
    for (var i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * (W || 1200),
        y: Math.random() * (H || 800),
        r: Math.random() * 1.8 + 0.6,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.08,
        blue: Math.random() > 0.55
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(function(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.blue
          ? 'rgba(0,163,255,' + p.opacity + ')'
          : 'rgba(30,144,255,' + (p.opacity * 0.5) + ')';
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
      });

      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.hypot(dx, dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(0,163,255,' + (0.06 * (1 - dist / 110)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  })();

  // ─── COUNTER ANIMATION FOR HERO STATS ──────
  function animateCounter(el) {
    var target = parseFloat(el.dataset.target);
    var suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;
    var current = 0;
    var step = target / 50;
    var timer = setInterval(function() {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      if (Number.isInteger(target)) {
        el.textContent = Math.floor(current) + suffix;
      } else {
        el.textContent = current.toFixed(1) + suffix;
      }
    }, 25);
  }

  var counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.num[data-target]').forEach(function(el) {
    counterObserver.observe(el);
  });

  // ─── SCROLL REVEAL ──────────────────────────
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.fade-up, .slide-right, .slide-left').forEach(function(el) {
    revealObserver.observe(el);
  });

  // ─── CONTACT FORM – DIRECT REDIRECT TO 404 ──
  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var firstName = document.getElementById('firstName').value.trim();
      var lastName = document.getElementById('lastName').value.trim();
      var email = document.getElementById('email').value.trim();
      var inquiryType = document.getElementById('inquiryType').value;
      var message = document.getElementById('message').value.trim();

      // Clear previous status
      formStatus.className = 'form-status';
      formStatus.textContent = '';

      // Validate
      if (!firstName || !lastName || !email || !inquiryType || !message) {
        formStatus.textContent = 'Please fill all required fields (*).';
        formStatus.className = 'form-status error';
        return;
      }
      if (!email.includes('@') || !email.includes('.')) {
        formStatus.textContent = 'Please enter a valid email address.';
        formStatus.className = 'form-status error';
        return;
      }

      // ✅ All valid – redirect directly to 404 (no success message)
      window.location.href = '404.html';
    });
  }

  // ─── FOOTER NEWSLETTER ──────────────────────
  var footerSubscribe = document.getElementById('footerSubscribe');
  var footerEmail = document.getElementById('footerEmail');
  var newsletterError = document.getElementById('newsletterError');

  if (footerSubscribe && footerEmail) {
    footerSubscribe.addEventListener('click', function() {
      var email = footerEmail.value.trim();
      if (!email || !email.includes('@')) {
        newsletterError.classList.add('show');
        footerEmail.style.borderColor = '#ff4444';
        footerEmail.style.boxShadow = '0 0 0 3px rgba(255,68,68,0.15)';
        footerEmail.focus();
        return;
      }
      newsletterError.classList.remove('show');
      footerEmail.style.borderColor = '';
      footerEmail.style.boxShadow = '';
      window.location.href = '404.html';
    });

    footerEmail.addEventListener('input', function() {
      if (footerEmail.value.trim()) {
        newsletterError.classList.remove('show');
        footerEmail.style.borderColor = '';
        footerEmail.style.boxShadow = '';
      }
    });
  }

  // ─── RESET FORM ON BACK BUTTON ──────────────
  function resetContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    // Clear all inputs, selects, textareas
    var elements = form.querySelectorAll('input, select, textarea');
    elements.forEach(function(el) {
      if (el.tagName === 'INPUT' && el.type !== 'submit' && el.type !== 'button') {
        el.value = '';
      } else if (el.tagName === 'SELECT') {
        el.selectedIndex = 0;
      } else if (el.tagName === 'TEXTAREA') {
        el.value = '';
      }
      // Remove validation styling
      el.style.borderColor = '';
      el.style.boxShadow = '';
    });

    // Clear any error messages
    var status = document.getElementById('formStatus');
    if (status) {
      status.className = 'form-status';
      status.textContent = '';
    }
  }

  // Reset on page show (back/forward navigation)
  window.addEventListener('pageshow', function(event) {
    resetContactForm();
  });

  // Also reset on initial load (in case the page is loaded fresh)
  resetContactForm();

  console.log('Stackly Contact page loaded – form redirects directly to 404 and resets on back.');
});