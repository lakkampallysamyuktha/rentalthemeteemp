/* ============================================================
   SCRIPT.JS – Car Rental Homepage (USA) – with improved hamburger
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ─── LOADER ───
    window.addEventListener('load', function() {
        setTimeout(function() {
            var loader = document.getElementById('page-loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(function() { loader.remove(); }, 600);
            }
        }, 1400);
    });

    // ─── NAVBAR SCROLL ───
    var navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // ─── MOBILE MENU ───
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('navLinks');
    var navOverlay = document.getElementById('navOverlay');

    function openMenu() {
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        navLinks.classList.add('active');
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.classList.add('menu-open');
    }

    function closeMenu() {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
    }

    if (hamburger && navLinks && navOverlay) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            if (navLinks.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navOverlay.addEventListener('click', closeMenu);

        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 900) closeMenu();
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeMenu();
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 900 && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // ─── CURSOR ───
    var cursor = document.querySelector('.cursor-glow');
    if (cursor) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        document.addEventListener('mousedown', function() {
            cursor.style.width = '28px';
            cursor.style.height = '28px';
        });
        document.addEventListener('mouseup', function() {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
        });
    }

    // ─── HERO SLIDESHOW – ONLY RUN IF SLIDES EXIST ───
    var slides = document.querySelectorAll('.slide');
    var dots = document.querySelectorAll('.dot');
    var currentSlide = 0;
    var autoTimer;

    // Only proceed if there are slides on this page
    if (slides.length > 0 && dots.length > 0) {

        function goToSlide(index) {
            // Remove active from current
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            // Update index
            currentSlide = (index + slides.length) % slides.length;
            // Add active to new
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() { goToSlide(currentSlide + 1); }
        function prevSlide() { goToSlide(currentSlide - 1); }

        function startAutoSlide() {
            autoTimer = setInterval(nextSlide, 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoTimer);
            startAutoSlide();
        }

        var nextBtn = document.querySelector('.slide-arrow.next');
        var prevBtn = document.querySelector('.slide-arrow.prev');

        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                nextSlide();
                resetAutoSlide();
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                prevSlide();
                resetAutoSlide();
            });
        }

        dots.forEach(function(dot, i) {
            dot.addEventListener('click', function() {
                goToSlide(i);
                resetAutoSlide();
            });
        });

        startAutoSlide();
    }

    // ─── HERO COUNTER ───
    function animateHeroCounter(el) {
        var target = parseInt(el.getAttribute('data-target'));
        if (isNaN(target)) return;
        var current = 0;
        var step = target / 60;
        var timer = setInterval(function() {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString();
        }, 20);
    }

    var heroCounterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                entry.target.dataset.counted = 'true';
                animateHeroCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.h-num').forEach(function(el) {
        heroCounterObserver.observe(el);
    });

    // ─── TESTIMONIALS ───
    var testiMarquee = document.getElementById('testiMarquee');
    if (testiMarquee) {
        var testimonialsData = [
            { name: 'John Anderson', place: 'New York', text: 'The Ferrari 488 was immaculate. Stackly\'s service made our anniversary unforgettable!', avatar: 'J' },
            { name: 'Sarah Mitchell', place: 'Los Angeles', text: 'Best car rental experience in the US. The Tesla was delivered right to my hotel. Zero hassle.', avatar: 'S' },
            { name: 'David Chen', place: 'San Francisco', text: 'Rented a Range Rover for a family trip. Stackly\'s team was professional and the car was pristine.', avatar: 'D' },
            { name: 'Emily Parker', place: 'Miami', text: 'I use Stackly every month for business trips. The BMW 7 Series is my go-to — absolute elegance.', avatar: 'E' },
            { name: 'Michael Torres', place: 'Chicago', text: 'Range Rover Sport for a corporate offsite. My clients were genuinely impressed.', avatar: 'M' },
            { name: 'Jessica Kim', place: 'Seattle', text: 'Booked a Porsche 911 for my birthday. The experience was flawless from start to finish.', avatar: 'J' }
        ];

        var cardsHTML = testimonialsData.map(function(t) {
            return '<div class="testi-card">' +
                '<div class="testi-stars">★★★★★</div>' +
                '<p>"' + t.text + '"</p>' +
                '<div class="testi-author">' +
                '<div class="ta-avatar">' + t.avatar + '</div>' +
                '<div><strong>' + t.name + '</strong><small>' + t.place + '</small></div>' +
                '</div>' +
                '</div>';
        }).join('');

        testiMarquee.innerHTML = cardsHTML + cardsHTML;
    }

    // ─── SERVICES DATA ───
    var servicesData = [
        { name: 'Toyota Corolla', category: 'economy', price: 35, seats: 5, fuel: 'Gas', trans: 'Auto', img: 'indexjs1.webp' },
        { name: 'Honda Civic', category: 'economy', price: 40, seats: 5, fuel: 'Gas', trans: 'Auto', img: 'indexjs2.webp' },
        { name: 'BMW 7 Series', category: 'luxury', price: 350, seats: 5, fuel: 'Gas', trans: 'Auto', img: 'indexjs3.webp' },
        { name: 'Ferrari 488', category: 'sports', price: 750, seats: 2, fuel: 'Gas', trans: 'DCT', img: 'indexjs4.webp' },
        { name: 'Tesla Model S', category: 'electric', price: 320, seats: 5, fuel: 'Electric', trans: 'Auto', img: 'indexjs5.webp' },
        { name: 'Range Rover Sport', category: 'suv', price: 480, seats: 5, fuel: 'Hybrid', trans: 'Auto', img: 'indexjs6.webp' },
        { name: 'Porsche 911', category: 'sports', price: 620, seats: 2, fuel: 'Gas', trans: 'PDK', img: 'indexjs7.webp' },
        { name: 'Rolls-Royce Ghost', category: 'luxury', price: 2200, seats: 5, fuel: 'Gas', trans: 'Auto', img: 'indexjs8.webp' },
        { name: 'Hyundai IONIQ 6', category: 'electric', price: 180, seats: 5, fuel: 'Electric', trans: 'Auto', img: 'indexjs9.webp' },
        { name: 'Audi Q8', category: 'suv', price: 420, seats: 5, fuel: 'Gas', trans: 'Auto', img: 'indexjs10.webp' },
        { name: 'Lamborghini Huracán', category: 'sports', price: 1050, seats: 2, fuel: 'Gas', trans: 'DCT', img: 'indexjs11.webp' },
        { name: 'Mercedes S-Class', category: 'luxury', price: 390, seats: 5, fuel: 'Gas', trans: 'Auto', img: 'indexjs12.webp' }
    ];

    var servicesGrid = document.getElementById('servicesGrid');

    function renderServices(filter) {
        if (!servicesGrid) return;
        filter = filter || 'all';
        var filtered = filter === 'all' ? servicesData : servicesData.filter(function(c) { return c.category === filter; });
        var html = '';
        filtered.forEach(function(car) {
            html += '<div class="car-card">' +
                '<div class="car-img-wrap">' +
                '<img src="' + car.img + '" alt="' + car.name + '" loading="lazy">' +
                '<div class="car-badge ' + car.category + '">' + car.category.toUpperCase() + '</div>' +
                '<div class="car-overlay"><a href="404.html" class="btn btn-primary btn-sm">Book Now</a></div>' +
                '</div>' +
                '<div class="car-info">' +
                '<h3>' + car.name + '</h3>' +
                '<div class="car-specs"><span><i class="fas fa-users"></i> ' + car.seats + ' Seats</span><span><i class="fas fa-cog"></i> ' + car.trans + '</span><span><i class="fas fa-gas-pump"></i> ' + car.fuel + '</span></div>' +
                '<div class="car-footer"><div class="car-price">$' + car.price + ' <small>/day</small></div><div class="car-rating"><i class="fas fa-star"></i> 4.9</div></div>' +
                '</div>' +
                '</div>';
        });
        servicesGrid.innerHTML = html;
    }

    document.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            renderServices(btn.getAttribute('data-cat'));
        });
    });

    renderServices('all');

    // ─── STATS COUNTER ───
    function animateStatCounter(el) {
        var target = parseInt(el.getAttribute('data-target'));
        if (isNaN(target)) return;
        var current = 0;
        var step = target / 50;
        var timer = setInterval(function() {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            var display = Math.floor(current).toLocaleString();
            if (el.getAttribute('data-target') == '4') {
                display = '4.' + Math.floor((current - 4) * 10);
                if (parseInt(display.split('.')[1]) >= 9) display = '4.9';
            }
            el.textContent = display;
        }, 25);
    }

    var statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                entry.target.dataset.counted = 'true';
                animateStatCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-num').forEach(function(el) {
        statObserver.observe(el);
    });

    // ─── SCROLL REVEAL ───
    var revealElements = document.querySelectorAll('.fade-up, .slide-right, .slide-left');
    var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });

    revealElements.forEach(function(el) {
        revealObserver.observe(el);
    });

    // ─── TICKER ───
    var tickerTrack = document.querySelector('.ticker-track');
    if (tickerTrack) {
        tickerTrack.innerHTML += tickerTrack.innerHTML;
        var tickerBand = tickerTrack.parentElement;
        if (tickerBand) {
            tickerBand.addEventListener('mouseenter', function() {
                tickerTrack.style.animationPlayState = 'paused';
            });
            tickerBand.addEventListener('mouseleave', function() {
                tickerTrack.style.animationPlayState = 'running';
            });
        }
    }

    // ─── TILT EFFECT ON CAR CARDS ───
    document.querySelectorAll('.car-card').forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width - 0.5;
            var y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = 'perspective(1000px) rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg) translateY(-8px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });

    // ─── NEWSLETTER ───
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

    // ─── BOOKING BAR ───
    function handleBookingSubmit(e) {
        e.preventDefault();

        var location = document.getElementById('bookingLocation');
        var pickup = document.getElementById('pickupDate');
        var ret = document.getElementById('returnDate');
        var carType = document.getElementById('carType');

        if (!location.value || !pickup.value || !ret.value || !carType.value) {
            window.location.href = 'services.html';
            return false;
        }

        window.location.href = 'services.html';
        return false;
    }

    window.handleBookingSubmit = handleBookingSubmit;

    // ─── SET DEFAULT DATES ───
    var pickupInput = document.getElementById('pickupDate');
    var returnInput = document.getElementById('returnDate');

    if (pickupInput) {
        var today = new Date();
        var y = today.getFullYear();
        var m = String(today.getMonth() + 1).padStart(2, '0');
        var d = String(today.getDate()).padStart(2, '0');
        pickupInput.value = y + '-' + m + '-' + d;
        pickupInput.min = y + '-' + m + '-' + d;
    }

    if (returnInput) {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var ty = tomorrow.getFullYear();
        var tm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        var td = String(tomorrow.getDate()).padStart(2, '0');
        returnInput.value = ty + '-' + tm + '-' + td;
        returnInput.min = ty + '-' + tm + '-' + td;
    }

    if (pickupInput && returnInput) {
        pickupInput.addEventListener('change', function() {
            var val = this.value;
            if (val) {
                var date = new Date(val);
                date.setDate(date.getDate() + 1);
                var yr = date.getFullYear();
                var mo = String(date.getMonth() + 1).padStart(2, '0');
                var dy = String(date.getDate()).padStart(2, '0');
                returnInput.min = yr + '-' + mo + '-' + dy;
                if (returnInput.value < returnInput.min) {
                    returnInput.value = returnInput.min;
                }
            }
        });
    }

    console.log('Stackly Car Rental – USA version loaded (hamburger fixed).');
});

// ─── CLEAR FOOTER EMAIL ON BACK / FORWARD ──
function clearFooterEmail() {
  var footerEmail = document.getElementById('footerEmail');
  var newsletterError = document.getElementById('newsletterError');

  if (footerEmail) {
    footerEmail.value = '';
    footerEmail.style.borderColor = '';
    footerEmail.style.boxShadow = '';
  }
  if (newsletterError) {
    newsletterError.classList.remove('show');
  }
}

// Run on pageshow (back/forward) with a small delay to override browser caching
window.addEventListener('pageshow', function(event) {
  setTimeout(clearFooterEmail, 10);
});