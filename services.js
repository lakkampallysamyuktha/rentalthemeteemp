/* ══════════════════════════════════════════════
   SERVICES.JS – Stackly Services Page
   Handles: hero particles, counter, fleet, 
   reset form on back button, etc.
══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. HERO PARTICLES ───────────────────── */
  (function initSvParticles() {
    const canvas = document.getElementById('sv-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = canvas.offsetWidth  || window.innerWidth;
      H = canvas.height = canvas.offsetHeight || window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COUNT = 65;
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * (W || 1400),
        y: Math.random() * (H || 900),
        r: Math.random() * 1.8 + 0.5,
        dx: (Math.random() - 0.5) * 0.32,
        dy: (Math.random() - 0.5) * 0.32,
        opacity: Math.random() * 0.4 + 0.08,
        blue: Math.random() > 0.5
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.blue
          ? `rgba(0,163,255,${p.opacity})`
          : `rgba(30,144,255,${p.opacity * 0.5})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,163,255,${0.07 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  })();


  /* ── 2. CTA CANVAS PARTICLES ─────────────── */
  (function initCtaCanvas() {
    const canvas = document.getElementById('ctaCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, pts = [];

    function resize() {
      W = canvas.width  = canvas.parentElement.offsetWidth  || window.innerWidth;
      H = canvas.height = canvas.parentElement.offsetHeight || 600;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 50; i++) {
      pts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.4,
        dx: (Math.random() - 0.5) * 0.25,
        dy: (Math.random() - 0.5) * 0.25,
        o: Math.random() * 0.3 + 0.05
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,163,255,${p.o})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
      });
      requestAnimationFrame(draw);
    }
    draw();
  })();


  /* ── 3. HERO COUNTER ANIMATION ───────────── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;
    let current = 0;
    const step  = target / 55;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current) + suffix;
    }, 22);
  }

  const svCounterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.sv-hnum').forEach(el => svCounterObserver.observe(el));


  /* ── 4. FULL FLEET DATA ──────────────────── */
  const ALL_CARS = [
    // Economy
    { name: 'Suzuki Swift',        category: 'economy', price: 2500,  seats: 5, fuel: 'Petrol',   trans: 'Manual', img: 'indexjs1.webp', rating: 4.8 },
    { name: 'Hyundai i20',         category: 'economy', price: 3200,  seats: 5, fuel: 'Petrol',   trans: 'Auto',   img: 'indexjs2.webp', rating: 4.7 },
    { name: 'Maruti Baleno',       category: 'economy', price: 2800,  seats: 5, fuel: 'Petrol',   trans: 'Manual', img: 'indexjs9.webp', rating: 4.6 },
    { name: 'Tata Nexon',          category: 'economy', price: 4500,  seats: 5, fuel: 'Petrol',   trans: 'Auto',   img: 'servicesjs1.webp', rating: 4.7 },
    // SUV
    { name: 'Range Rover Sport',   category: 'suv',     price: 35000, seats: 5, fuel: 'Hybrid',   trans: 'Auto',   img: 'indexjs6.webp', rating: 4.9 },
    { name: 'Audi Q8',             category: 'suv',     price: 30000, seats: 5, fuel: 'Petrol',   trans: 'Auto',   img: 'adminjs4.webp', rating: 4.9 },
    { name: 'Toyota Fortuner',     category: 'suv',     price: 12000, seats: 7, fuel: 'Diesel',   trans: 'Auto',   img: 'servicesjs2.webp', rating: 4.8 },
    { name: 'BMW X5',              category: 'suv',     price: 22000, seats: 5, fuel: 'Petrol',   trans: 'Auto',   img: 'indexjs3.webp', rating: 4.9 },
    // Luxury
    { name: 'BMW 7 Series',        category: 'luxury',  price: 25000, seats: 5, fuel: 'Petrol',   trans: 'Auto',   img: 'indexjs3.webp', rating: 5.0 },
    { name: 'Rolls-Royce Ghost',   category: 'luxury',  price: 150000,seats: 5, fuel: 'Petrol',   trans: 'Auto',   img: 'indexjs9.webp', rating: 5.0 },
    { name: 'Mercedes S-Class',    category: 'luxury',  price: 28000, seats: 5, fuel: 'Petrol',   trans: 'Auto',   img: 'viewerjs12.webp', rating: 4.9 },
    { name: 'Bentley Continental', category: 'luxury',  price: 95000, seats: 4, fuel: 'Petrol',   trans: 'Auto',   img: 'index4 (1).webp', rating: 5.0 },
    // Electric
    { name: 'Tesla Model S',       category: 'electric',price: 22000, seats: 5, fuel: 'Electric', trans: 'Auto',   img: 'servies5.webp', rating: 4.9 },
    { name: 'Hyundai IONIQ 6',     category: 'electric',price: 14000, seats: 5, fuel: 'Electric', trans: 'Auto',   img: 'indexjs9.webp', rating: 4.8 },
    { name: 'Porsche Taycan',      category: 'electric',price: 45000, seats: 4, fuel: 'Electric', trans: 'Auto',   img: 'indexjs7.webp', rating: 4.9 },
    { name: 'BMW iX',              category: 'electric',price: 30000, seats: 5, fuel: 'Electric', trans: 'Auto',   img: 'indexjs10.webp', rating: 4.8 },
    // Sports
    { name: 'Ferrari 488',         category: 'sports',  price: 55000, seats: 2, fuel: 'Petrol',   trans: 'DCT',    img: 'indexjs4.webp', rating: 5.0 },
    { name: 'Lamborghini Huracán', category: 'sports',  price: 75000, seats: 2, fuel: 'Petrol',   trans: 'DCT',    img: 'services1.webp', rating: 5.0 },
    { name: 'Porsche 911',         category: 'sports',  price: 45000, seats: 2, fuel: 'Petrol',   trans: 'PDK',    img: 'indexjs7.webp', rating: 4.9 },
    { name: 'McLaren 720S',        category: 'sports',  price: 80000, seats: 2, fuel: 'Petrol',   trans: 'DCT',    img: 'index1.webp', rating: 5.0 },
  ];

  const CARS_PER_PAGE = 8;
  let activeCategory = 'all';
  let activeSort     = 'default';
  let visibleCount   = CARS_PER_PAGE;

  function getFiltered() {
    let list = activeCategory === 'all'
      ? [...ALL_CARS]
      : ALL_CARS.filter(c => c.category === activeCategory);

    if (activeSort === 'price-asc')  list.sort((a,b) => a.price - b.price);
    if (activeSort === 'price-desc') list.sort((a,b) => b.price - a.price);
    if (activeSort === 'name')       list.sort((a,b) => a.name.localeCompare(b.name));

    return list;
  }

  function renderFleet() {
    const grid      = document.getElementById('svFleetGrid');
    const noResults = document.getElementById('svNoResults');
    const loadMore  = document.getElementById('svLoadMore');
    if (!grid) return;

    const filtered = getFiltered();

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (noResults) noResults.style.display = 'block';
      if (loadMore)  loadMore.style.display  = 'none';
      return;
    }
    if (noResults) noResults.style.display = 'none';

    const visible = filtered.slice(0, visibleCount);
    grid.innerHTML = visible.map(car => `
      <div class="car-card">
        <div class="car-img-wrap">
          <img src="${car.img}" alt="${car.name}" loading="lazy">
          <div class="car-badge ${car.category}">${car.category.toUpperCase()}</div>
          <div class="car-overlay"><a href="#" class="btn btn-primary btn-sm">Book Now</a></div>
        </div>
        <div class="car-info">
          <h3>${car.name}</h3>
          <div class="car-specs">
            <span><i class="fas fa-users"></i> ${car.seats} Seats</span>
            <span><i class="fas fa-cog"></i> ${car.trans}</span>
            <span><i class="fas fa-gas-pump"></i> ${car.fuel}</span>
          </div>
          <div class="car-footer">
            <div class="car-price">$${car.price.toLocaleString()} <small>/day</small></div>
            <div class="car-rating"><i class="fas fa-star"></i> ${car.rating.toFixed(1)}</div>
          </div>
        </div>
      </div>
    `).join('');

    if (loadMore) {
      loadMore.style.display = filtered.length > visibleCount ? 'inline-flex' : 'none';
    }

    attachCardTilt();
  }

  function updateCountBadge() {
    const badge = document.getElementById('count-all');
    if (badge) badge.textContent = ALL_CARS.length;
  }
  updateCountBadge();

  document.querySelectorAll('.sv-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sv-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.cat || 'all';
      visibleCount   = CARS_PER_PAGE;
      renderFleet();
    });
  });

  const sortSelect = document.getElementById('svSort');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      activeSort   = sortSelect.value;
      visibleCount = CARS_PER_PAGE;
      renderFleet();
    });
  }

  const loadMoreBtn = document.getElementById('svLoadMore');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      visibleCount += CARS_PER_PAGE;
      renderFleet();
      loadMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  renderFleet();


  /* ── 5. HERO CATEGORY PILLS → fleet filter ── */
  document.querySelectorAll('.sv-cat-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      const cat = pill.dataset.cat || 'all';
      document.querySelectorAll('.sv-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.cat === cat);
      });
      activeCategory = cat;
      visibleCount   = CARS_PER_PAGE;
      renderFleet();
    });
  });

  /* ── 6. TIER CARD "Explore" → fleet filter ── */
  document.querySelectorAll('.sv-book-trigger').forEach(link => {
    link.addEventListener('click', (e) => {
      const cat = link.dataset.cat || 'all';
      document.querySelectorAll('.sv-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.cat === cat);
      });
      activeCategory = cat;
      visibleCount   = CARS_PER_PAGE;
      renderFleet();
    });
  });


  /* ── 7. 3-D TILT on car cards ────────────── */
  function attachCardTilt() {
    document.querySelectorAll('#svFleetGrid .car-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x    = (e.clientX - rect.left) / rect.width  - 0.5;
        const y    = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform =
          `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-8px) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  document.querySelectorAll('.sv-tier-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform =
        `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-10px) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  document.querySelectorAll('.sv-addon-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform =
        `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ── 8. SCROLL REVEAL ────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

  document.querySelectorAll('.fade-up, .slide-right, .slide-left').forEach(el =>
    revealObserver.observe(el)
  );

  document.querySelectorAll('.sv-tier-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 90}ms`;
  });

  document.querySelectorAll('.sv-addon-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 70}ms`;
  });


  /* ── 9. PROMO CODE COPY BUTTON ───────────── */
  const copyBtn  = document.getElementById('copyCode');
  const copyText = document.getElementById('copyText');
  const ctaCode  = document.getElementById('ctaCode');

  if (copyBtn && ctaCode) {
    copyBtn.addEventListener('click', () => {
      const code = ctaCode.textContent.trim();
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.classList.add('copied');
        if (copyText) copyText.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          if (copyText) copyText.textContent = 'Copy';
        }, 2500);
      }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = code;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        if (copyText) copyText.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          if (copyText) copyText.textContent = 'Copy';
        }, 2500);
      });
    });
  }


  /* ── 10. QUICK BOOKING FORM VALIDATION ────── */
  const quickForm = document.getElementById('svQuickForm');
  if (quickForm) {
    quickForm.addEventListener('submit', function(e) {
      const required = this.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#ff4444';
          field.style.boxShadow = '0 0 0 3px rgba(255,68,68,0.15)';
        } else {
          field.style.borderColor = '';
          field.style.boxShadow = '';
        }
      });
      if (!valid) {
        e.preventDefault();
        const firstInvalid = this.querySelector('[required]:invalid, [required][value=""]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      // The form will submit to 404.html (GET) – no need to preventDefault
    });
  }


  /* ── 11. NEWSLETTER (footer) ─────────────── */
  const footerSubscribe = document.getElementById('footerSubscribe');
  const footerEmail     = document.getElementById('footerEmail');
  const newsletterError = document.getElementById('newsletterError');

  if (footerSubscribe && footerEmail) {
    footerSubscribe.addEventListener('click', () => {
      const email = footerEmail.value.trim();
      if (!email || !email.includes('@')) {
        newsletterError.classList.add('show');
        footerEmail.style.borderColor = '#ff4444';
        footerEmail.style.boxShadow   = '0 0 0 3px rgba(255,68,68,0.15)';
        footerEmail.focus();
        return;
      }
      newsletterError.classList.remove('show');
      footerEmail.style.borderColor = '';
      footerEmail.style.boxShadow   = '';
      window.location.href = '404.html';
    });

    footerEmail.addEventListener('input', () => {
      if (footerEmail.value.trim()) {
        newsletterError.classList.remove('show');
        footerEmail.style.borderColor = '';
        footerEmail.style.boxShadow   = '';
      }
    });
  }

  /* ── 12. RESET FORM ON BACK BUTTON ────────── */
  function resetQuickForm() {
    const form = document.getElementById('svQuickForm');
    if (!form) return;
    // Clear all inputs, selects, textareas
    const elements = form.querySelectorAll('input, select, textarea');
    elements.forEach(el => {
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
    // Also clear any error states on required fields
    form.querySelectorAll('[required]').forEach(field => {
      field.style.borderColor = '';
      field.style.boxShadow = '';
    });
  }

  // Reset on fresh load
  resetQuickForm();

  // Reset on back/forward navigation
  window.addEventListener('pageshow', function(event) {
    resetQuickForm();
  });

});