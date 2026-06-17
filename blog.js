/* ══════════════════════════════════════════════
   BLOG.JS – Stackly Blog Page
   Particles, filter pills → 404 redirect,
   search → 404 redirect (with required validation),
   topic tags → 404 redirect, all Read links → 404,
   trending → 404, reset forms on back.
══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {

  // ─── PARTICLES ──────────────────────────────
  (function initBlogParticles() {
    var canvas = document.getElementById('blog-particles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, particles = [];

    function resize() {
      W = canvas.width = canvas.offsetWidth || window.innerWidth;
      H = canvas.height = canvas.offsetHeight || window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var COUNT = 65;
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

  // ─── BLOG DATA ──────────────────────────────
  var allPosts = [
    { id: 1, cat: 'spotlights', catLabel: 'Car Spotlights', title: 'Inside the Rolls-Royce Ghost: Where Silence Becomes a Feature', excerpt: 'We spent a week with the Ghost and discovered that its most impressive engineering achievement isn\'t the engine — it\'s the quiet.', date: 'Jun 8, 2026', read: '6 min', author: 'Vikram T.', avatar: 'V', img: 'indexjs8.webp', views: '4.2k' },
    { id: 2, cat: 'tips', catLabel: 'Driving Tips', title: '10 Things Every First-Time Renter Must Know Before Hitting the Highway', excerpt: 'From fuel policies to insurance fine print — the essentials nobody tells you until something goes wrong.', date: 'Jun 5, 2026', read: '5 min', author: 'Priya S.', avatar: 'P', img: 'blogjs2.webp', views: '6.8k' },
    { id: 3, cat: 'travel', catLabel: 'Travel', title: 'Manali to Leh in a Range Rover: A 1,000 km Road-Trip Diary', excerpt: 'Snow-capped passes, ancient monasteries, and a machine that refused to give up. Our most epic road trip yet.', date: 'May 28, 2026', read: '9 min', author: 'Rahul P.', avatar: 'R', img: 'about11.webp', views: '11.3k' },
    { id: 4, cat: 'ev', catLabel: 'Electric', title: 'Tesla Model S vs. Hyundai IONIQ 6: Which EV Should You Rent?', excerpt: 'Two electric flagships, two very different philosophies. We drove both on the same route to find out which wins.', date: 'May 20, 2026', read: '7 min', author: 'Neha G.', avatar: 'N', img: 'indexjs5.webp', views: '5.5k' },
    { id: 5, cat: 'spotlights', catLabel: 'Car Spotlights', title: 'Why the Porsche 911 Is Still the World\'s Greatest Sports Car', excerpt: 'Decades of iteration, not revolution. We look at how Porsche keeps a 60-year-old formula feeling utterly modern.', date: 'May 15, 2026', read: '8 min', author: 'Arjun M.', avatar: 'A', img: 'about11.webp', views: '7.1k' },
    { id: 6, cat: 'tips', catLabel: 'Driving Tips', title: 'Night Driving in India: Safety Tips and Routes to Avoid', excerpt: 'City highways after midnight are a different world. Here\'s how to stay safe and make the most of empty roads.', date: 'May 10, 2026', read: '4 min', author: 'Sneha K.', avatar: 'S', img: 'index11.webp', views: '3.9k' },
    { id: 7, cat: 'travel', catLabel: 'Travel', title: 'Goa in a Convertible: The Ultimate Beach-Hop Itinerary', excerpt: 'Renting a Mustang convertible in Goa might be the best travel decision you\'ll ever make. We did it so you can plan it better.', date: 'May 4, 2026', read: '6 min', author: 'Priya S.', avatar: 'P', img: 'index3 (1).webp', views: '8.7k' },
    { id: 8, cat: 'ev', catLabel: 'Electric', title: 'Charging an EV on a Road Trip: Everything You Need to Plan For', excerpt: 'Range anxiety is real — but manageable. Here\'s the complete guide to charging infrastructure across India\'s top highways.', date: 'Apr 28, 2026', read: '7 min', author: 'Rahul P.', avatar: 'R', img: 'indexjs9.webp', views: '4.4k' },
    { id: 9, cat: 'spotlights', catLabel: 'Car Spotlights', title: 'Lamborghini Huracán at Track Day: What 580 Horses Actually Feel Like', excerpt: 'We got the keys to a Huracán for an exclusive track day. Here\'s the unfiltered truth about what happens when you floor it.', date: 'Apr 20, 2026', read: '10 min', author: 'Vikram T.', avatar: 'V', img: 'viewerjs11.webp', views: '9.2k' }
  ];

  var PAGE_SIZE = 6;
  var visibleCount = PAGE_SIZE;
  var activeFilter = 'all';

  function getFilteredPosts() {
    return allPosts.filter(function(p) {
      return activeFilter === 'all' || p.cat === activeFilter;
    });
  }

  function buildCard(post) {
    return '<div class="blog-card" data-id="' + post.id + '">' +
      '<div class="blog-card-img">' +
        '<img src="' + post.img + '" alt="' + post.title + '" loading="lazy">' +
        '<span class="post-cat ' + post.cat + '">' + post.catLabel + '</span>' +
      '</div>' +
      '<div class="blog-card-body">' +
        '<div class="post-meta">' +
          '<span class="post-date"><i class="fas fa-calendar-alt"></i> ' + post.date + '</span>' +
          '<span class="post-read"><i class="fas fa-clock"></i> ' + post.read + '</span>' +
        '</div>' +
        '<h3 class="blog-card-title">' + post.title + '</h3>' +
        '<p class="blog-card-excerpt">' + post.excerpt + '</p>' +
        '<div class="blog-card-footer">' +
          '<div class="bc-author">' +
            '<div class="bc-avatar">' + post.avatar + '</div>' +
            '<span class="bc-author-name">' + post.author + '</span>' +
          '</div>' +
          '<a href="404.html" class="bc-read-link">Read <i class="fas fa-arrow-right"></i></a>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderGrid() {
    var grid = document.getElementById('blogGrid');
    if (!grid) return;
    var posts = getFilteredPosts().slice(0, visibleCount);
    grid.innerHTML = posts.map(buildCard).join('');

    requestAnimationFrame(function() {
      grid.querySelectorAll('.blog-card').forEach(function(card, i) {
        setTimeout(function() { card.classList.add('visible'); }, 60 + i * 70);
      });
    });

    grid.querySelectorAll('.blog-card').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(900px) rotateY(' + (x * 7) + 'deg) rotateX(' + (-y * 7) + 'deg) translateY(-8px) scale(1.02)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });
    });

    var loadBtn = document.getElementById('loadMoreBtn');
    var allFiltered = getFilteredPosts();
    if (loadBtn) {
      loadBtn.style.display = visibleCount >= allFiltered.length ? 'none' : 'inline-flex';
    }
  }

  renderGrid();

  document.getElementById('loadMoreBtn').addEventListener('click', function() {
    visibleCount += PAGE_SIZE;
    renderGrid();
  });

  // ─── FILTER PILLS – REDIRECT TO 404 ─────
  document.querySelectorAll('.pill').forEach(function(pill) {
    pill.addEventListener('click', function() {
      var filter = pill.dataset.filter || 'all';
      window.location.href = '404.html?filter=' + encodeURIComponent(filter);
    });
  });

  // ─── SEARCH – WITH REQUIRED VALIDATION ──
  var searchInput = document.getElementById('blogSearch');
  var searchBtn = document.getElementById('searchBtn');
  var searchBox = document.getElementById('searchBox');
  var searchError = document.getElementById('searchError');

  function validateAndRedirect() {
    var query = searchInput.value.trim();
    // Clear previous error state
    searchBox.classList.remove('error');
    searchError.classList.remove('show');

    if (query.length === 0) {
      // Show error
      searchBox.classList.add('error');
      searchError.classList.add('show');
      searchInput.focus();
      return false;
    }

    // Valid – redirect to 404 with query
    window.location.href = '404.html?q=' + encodeURIComponent(query);
    return true;
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', function(e) {
      e.preventDefault();
      validateAndRedirect();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        validateAndRedirect();
      }
    });

    // Clear error on input
    searchInput.addEventListener('input', function() {
      if (searchInput.value.trim().length > 0) {
        searchBox.classList.remove('error');
        searchError.classList.remove('show');
      }
    });
  }

  // ─── TRENDING ────────────────────────────────
  var trendingData = [
    { rank: '01', title: 'Manali to Leh in a Range Rover: A 1,000 km Road-Trip Diary', meta: '11.3k views · 9 min', img: 'blogjs3.webp', cat: 'travel' },
    { rank: '02', title: 'Lamborghini Huracán at Track Day: What 580 Horses Feel Like', meta: '9.2k views · 10 min', img: 'viewerjs11.webp', cat: 'spotlights' },
    { rank: '03', title: 'Goa in a Convertible: The Ultimate Beach-Hop Itinerary', meta: '8.7k views · 6 min', img: 'index1.webp', cat: 'travel' },
    { rank: '04', title: '10 Things Every First-Time Renter Must Know', meta: '6.8k views · 5 min', img: 'blogjs2.webp', cat: 'tips' },
    { rank: '05', title: 'Why the Porsche 911 Is Still the World\'s Greatest Sports Car', meta: '7.1k views · 8 min', img: 'blogjs7.webp', cat: 'spotlights' }
  ];

  var trendingList = document.getElementById('trendingList');
  if (trendingList) {
    trendingList.innerHTML = trendingData.map(function(item, i) {
      return '<div class="trending-item" style="transition: opacity 0.7s ' + (i * 100) + 'ms ease, transform 0.7s ' + (i * 100) + 'ms ease;" data-title="' + item.title + '">' +
        '<div class="trending-rank">' + item.rank + '</div>' +
        '<div class="trending-body">' +
          '<div class="trending-title">' + item.title + '</div>' +
          '<div class="trending-meta"><span class="post-cat ' + item.cat + '" style="font-size:0.65rem;padding:2px 8px;">' + item.cat.charAt(0).toUpperCase() + item.cat.slice(1) + '</span>' + item.meta + '</div>' +
        '</div>' +
        '<img class="trending-img" src="' + item.img + '" alt="" loading="lazy">' +
      '</div>';
    }).join('');

    var trendObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          trendObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    trendingList.querySelectorAll('.trending-item').forEach(function(el) {
      trendObserver.observe(el);
    });

    trendingList.querySelectorAll('.trending-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var title = item.dataset.title || 'trending';
        window.location.href = '404.html?trending=' + encodeURIComponent(title);
      });
    });
  }

  // ─── TOPIC TAGS – US LOCATIONS ────────────
  var topics = [
    'New York', 'Los Angeles', 'Miami', 'Chicago',
    'San Francisco', 'Las Vegas', 'Seattle', 'Denver',
    'Austin', 'Boston', 'Washington DC', 'Atlanta'
  ];
  var topicTagsEl = document.getElementById('topicTags');
  if (topicTagsEl) {
    topicTagsEl.innerHTML = topics.map(function(t) {
      return '<span class="topic-tag">' + t + '</span>';
    }).join('');
    topicTagsEl.querySelectorAll('.topic-tag').forEach(function(tag) {
      tag.addEventListener('click', function() {
        var query = tag.textContent.trim();
        window.location.href = '404.html?q=' + encodeURIComponent(query);
      });
    });
  }

  // ─── FEATURED "READ FULL STORY" ────────────
  var featuredBtn = document.querySelector('.featured-read-btn');
  if (featuredBtn) {
    featuredBtn.setAttribute('href', '404.html');
  }

  // ─── SIDEBAR NEWSLETTER ────────────────────
  var sidebarSub = document.getElementById('sidebarSubscribe');
  var sidebarEmail = document.getElementById('sidebarEmail');
  var sidebarError = document.getElementById('sidebarError');
  if (sidebarSub && sidebarEmail) {
    sidebarSub.addEventListener('click', function() {
      var email = sidebarEmail.value.trim();
      if (!email || !email.includes('@')) {
        sidebarError.classList.add('show');
        sidebarEmail.style.borderColor = '#ff4444';
        sidebarEmail.focus();
        return;
      }
      sidebarError.classList.remove('show');
      sidebarEmail.style.borderColor = '';
      window.location.href = '404.html';
    });
    sidebarEmail.addEventListener('input', function() {
      sidebarError.classList.remove('show');
      sidebarEmail.style.borderColor = '';
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

  // ─── RESET FORM FIELDS ON BACK ──────────────
  function resetBlogForms() {
    if (searchInput) {
      searchInput.value = '';
      searchBox.classList.remove('error');
      searchError.classList.remove('show');
    }
    if (sidebarEmail) {
      sidebarEmail.value = '';
      sidebarEmail.style.borderColor = '';
      sidebarEmail.style.boxShadow = '';
    }
    if (sidebarError) {
      sidebarError.classList.remove('show');
    }
    if (footerEmail) {
      footerEmail.value = '';
      footerEmail.style.borderColor = '';
      footerEmail.style.boxShadow = '';
    }
    if (newsletterError) {
      newsletterError.classList.remove('show');
    }
    document.querySelectorAll('.search-box input, .search-box button, .nl-form input').forEach(function(el) {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    });
  }

  window.addEventListener('pageshow', function(event) {
    resetBlogForms();
  });

  console.log('Stackly Blog page loaded – search is now required, all clicks redirect to 404.');
});