/* ══════════════════════════════════════════════
   ABOUT.JS – Stackly About Page
   Handles: hero particles, scroll reveal,
   staggered fade-in delays, tilt on team cards
══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {

    // Navbar scroll state and the hamburger/mobile-menu open-close logic are
    // already handled globally by index.js (loaded before this file on every
    // page, including about.html). Duplicating that logic here used to mean
    // two separate click handlers fired on every hamburger click — the first
    // opened the menu, the second immediately saw it as "active" and closed
    // it again, which is why the menu looked like it wasn't opening. Removed
    // to match how services.js already does it (no duplicate listener).

    /* ── 1. HERO PARTICLES ───────────────────── */
    (function initAboutParticles() {
        var canvas = document.getElementById('about-particles');
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
                dx: (Math.random() - 0.5) * 0.35,
                dy: (Math.random() - 0.5) * 0.35,
                opacity: Math.random() * 0.45 + 0.08,
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

            // Lines between nearby particles
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var dx = particles[i].x - particles[j].x;
                    var dy = particles[i].y - particles[j].y;
                    var dist = Math.hypot(dx, dy);
                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = 'rgba(0,163,255,' + (0.07 * (1 - dist / 110)) + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        }
        draw();
    })();

    /* ── 2. SCROLL REVEAL ── */
    function buildRevealObserver(threshold, rootMargin) {
        threshold = threshold || 0.15;
        rootMargin = rootMargin || '0px 0px -30px 0px';
        return new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: threshold, rootMargin: rootMargin });
    }

    var observer = buildRevealObserver();

    var selectors = [
        '.fade-up',
        '.slide-right',
        '.slide-left',
        '.fade-timeline-left',
        '.fade-timeline-right'
    ];
    document.querySelectorAll(selectors.join(', ')).forEach(function(el) {
        observer.observe(el);
    });

    /* ── 3. STAGGER DELAYS ── */
    function staggerGroup(parentSelector, childSelector, baseDelay, step) {
        baseDelay = baseDelay || 0;
        step = step || 120;
        document.querySelectorAll(parentSelector).forEach(function(parent) {
            parent.querySelectorAll(childSelector).forEach(function(child, i) {
                child.style.transitionDelay = (baseDelay + i * step) + 'ms';
            });
        });
    }

    staggerGroup('.values-cards', '.val-card', 80, 110);

    document.querySelectorAll('.team-card').forEach(function(card, i) {
        card.style.transitionDelay = (i * 100) + 'ms';
    });

    document.querySelectorAll('.award-card').forEach(function(card, i) {
        card.style.transitionDelay = (i * 80) + 'ms';
    });

    document.querySelectorAll('.about-hero-pills span').forEach(function(pill, i) {
        pill.style.animationDelay = (1.4 + i * 0.15) + 's';
        pill.style.animation = 'fadeUp 0.8s both';
    });

    /* ── 4. 3-D TILT on team cards ───────────── */
    document.querySelectorAll('.team-card').forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width - 0.5;
            var y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform =
                'perspective(900px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-10px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });

    /* ── 5. 3-D TILT on award cards ─────────── */
    document.querySelectorAll('.award-card').forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width - 0.5;
            var y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform =
                'perspective(700px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) translateY(-6px)';
        });
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });

    /* ── 6. PARALLAX on hero background ──────── */
    var heroImg = document.querySelector('.about-hero-img');
    if (heroImg) {
        window.addEventListener('scroll', function() {
            var scrolled = window.scrollY;
            heroImg.style.transform = 'scale(1) translateY(' + (scrolled * 0.25) + 'px)';
        }, { passive: true });
    }

    /* ── 7. TIMELINE DOT PULSE ──────── */
    document.querySelectorAll('.tl-dot').forEach(function(dot) {
        var parentItem = dot.closest('.timeline-item');
        if (!parentItem) return;
        var dotObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    dot.style.animation = 'none';
                    void dot.offsetWidth; // force reflow
                    dot.style.animation = 'tlDotPop 0.6s cubic-bezier(0.23,1,0.32,1) forwards';
                    dotObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        dotObserver.observe(parentItem);
    });

    // Inject keyframe if not already present
    if (!document.getElementById('tl-dot-style')) {
        var style = document.createElement('style');
        style.id = 'tl-dot-style';
        style.textContent = '\n      @keyframes tlDotPop {\n        0%   { transform: translate(-50%,-50%) scale(0); opacity: 0; }\n        60%  { transform: translate(-50%,-50%) scale(1.4); opacity: 1; }\n        100% { transform: translate(-50%,-50%) scale(1);   opacity: 1; }\n      }\n    ';
        document.head.appendChild(style);
    }

    // ─── NEWSLETTER (same as index) ───
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

    console.log('Stackly About page loaded.');
});