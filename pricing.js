/* ══════════════════════════════════════════════
   PRICING.JS – Stackly Pricing Page
   Particles, billing toggle, scroll reveal,
   counter animation for hero stats (runs on every refresh)
══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {

  // ─── PARTICLES ──────────────────────────────
  (function initPricingParticles() {
    var canvas = document.getElementById('pricing-particles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, particles = [];

    function resize() {
      W = canvas.width = canvas.offsetWidth || window.innerWidth;
      H = canvas.height = canvas.offsetHeight || window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var COUNT = 60;
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

  // ─── SCROLL REVEAL ──────────────────────────
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.fade-up').forEach(function(el) {
    revealObserver.observe(el);
  });

  // ─── COUNTER ANIMATION FOR HERO STATS ──────
  function animateCounter(el) {
    var target = parseFloat(el.dataset.target);
    var suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;
    var current = 0;
    var step = Math.max(target / 50, 1);
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

  function resetCounters() {
    document.querySelectorAll('.num[data-target]').forEach(function(el) {
      el.dataset.counted = '';
    });
  }

  function startVisibleCounters() {
    document.querySelectorAll('.num[data-target]').forEach(function(el) {
      var rect = el.getBoundingClientRect();
      var isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible && !el.dataset.counted) {
        el.dataset.counted = 'true';
        animateCounter(el);
      }
    });
  }

  function setupCounterObserver() {
    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.num[data-target]').forEach(function(el) {
      counterObserver.observe(el);
    });
  }

  resetCounters();
  startVisibleCounters();
  setupCounterObserver();

  window.addEventListener('pageshow', function(event) {
    resetCounters();
    setTimeout(function() {
      startVisibleCounters();
    }, 100);
  });

  // ─── BILLING TOGGLE ─────────────────────────
  var toggle = document.getElementById('billingToggle');
  if (toggle) {
    toggle.addEventListener('change', function() {
      var isAnnual = toggle.checked;

      document.querySelectorAll('.plan-card').forEach(function(card) {
        var monthly = parseInt(card.dataset.monthly);
        var annual = parseInt(card.dataset.annual);
        var target = isAnnual ? annual : monthly;
        var amountEl = card.querySelector('.amount');
        var billedEl = card.querySelector('.plan-billed');
        if (amountEl) {
          animateValue(amountEl, parseInt(amountEl.textContent.replace(/,/g, '')), target, 400);
        }
        if (billedEl) {
          billedEl.textContent = isAnnual ? 'Billed annually' : 'Billed monthly';
        }
      });

      var prices = isAnnual ? [12, 28, 68] : [15, 35, 85];
      document.querySelectorAll('.ct-plan-price').forEach(function(el, i) {
        if (prices[i]) {
          el.innerHTML = '$' + prices[i].toLocaleString('en-US') + '<small>/mo</small>';
        }
      });
    });
  }

  function animateValue(el, from, to, duration) {
    var start = performance.now();
    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = Math.round(from + (to - from) * eased);
      el.textContent = val.toLocaleString('en-US');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
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

  console.log('Stackly Pricing page loaded – all prices in USD.');
});