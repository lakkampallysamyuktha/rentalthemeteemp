/* ============================================================
   VIEWER DASHBOARD – INTERACTIONS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── LOAD USER DATA ───
    const userData = JSON.parse(localStorage.getItem('login_user') || localStorage.getItem('signup_user') || '{"username":"Viewer","role":"viewer"}');
    const username = userData.username || 'Viewer';

    document.getElementById('viewerName').textContent = username;
    document.getElementById('viewerAvatar').textContent = username.charAt(0).toUpperCase();
    document.getElementById('greetName').textContent = username;
    document.getElementById('profileAvatar').textContent = username.charAt(0).toUpperCase();
    document.getElementById('profileName').textContent = username;
    document.getElementById('profileEmail').textContent = 'viewer@stackly.com';

    // ─── NAVIGATION ───
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('pageTitle');
    const titles = {
        overview: 'Overview',
        fleet: 'Browse Fleet',
        bookings: 'My Bookings',
        profile: 'My Profile',
        settings: 'Settings',
        help: 'Help & Support'
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.dataset.page;

            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            pages.forEach(p => p.classList.remove('active'));
            const targetPage = document.getElementById('page-' + target);
            if (targetPage) targetPage.classList.add('active');

            pageTitle.textContent = titles[target] || target;

            if (window.innerWidth <= 768) closeSidebar();

            if (target === 'fleet') renderFleet();
        });
    });

    // ─── SIDEBAR TOGGLE ───
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const hamburger = document.getElementById('hamburger');
    const sidebarClose = document.getElementById('sidebarClose');

    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });

    overlay.addEventListener('click', closeSidebar);
    sidebarClose.addEventListener('click', closeSidebar);

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && sidebar.classList.contains('open')) closeSidebar();
    });

    // ─── NAVIGATE HELPER ───
    window.navigateTo = function(page) {
        const target = document.querySelector(`.nav-item[data-page="${page}"]`);
        if (target) target.click();
    };

    // ─── FEATURED GRID ───
    const featuredCars = [
        { name: 'Tesla Model 3', category: 'electric', price: 22000, img: 'viewerjs1.webp' },
        { name: 'Ferrari 488', category: 'sports', price: 55000, img: 'viewerjs2.webp' },
        { name: 'Range Rover Sport', category: 'suv', price: 35000, img: 'viewerjs3.webp' },
        { name: 'BMW 7 Series', category: 'luxury', price: 25000, img: 'viewerjs4.webp' }
    ];

    function renderFeatured() {
        const grid = document.getElementById('featuredGrid');
        if (!grid) return;

        grid.innerHTML = featuredCars.map(car => `
            <div class="featured-card">
                <div class="featured-card-img">
                    <img src="${car.img}" alt="${car.name}" loading="lazy">
                </div>
                <div class="featured-card-body">
                    <h4>${car.name}</h4>
                    <div class="specs">${car.category.charAt(0).toUpperCase() + car.category.slice(1)}</div>
                    <div class="price">₹${car.price.toLocaleString()} <small>/day</small></div>
                </div>
            </div>
        `).join('');
    }
    renderFeatured();

    // ─── FLEET DATA ───
    const fleetData = [
        { name: 'Tesla Model 3', category: 'electric', price: 22000, seats: 5, trans: 'Auto', img: 'viewerjs1.webp' },
        { name: 'BMW i4', category: 'electric', price: 25000, seats: 5, trans: 'Auto', img: 'indexjs2.webp' },
        { name: 'Range Rover Sport', category: 'suv', price: 35000, seats: 5, trans: 'Auto', img: 'indexjs6.webp' },
        { name: 'Audi Q8', category: 'suv', price: 30000, seats: 5, trans: 'Auto', img: 'indexjs10.webp' },
        { name: 'Ferrari 488', category: 'sports', price: 55000, seats: 2, trans: 'DCT', img: 'indexjs4.webp' },
        { name: 'Porsche 911', category: 'sports', price: 45000, seats: 2, trans: 'PDK', img: 'indexjs7.webp' },
        { name: 'Rolls-Royce Ghost', category: 'luxury', price: 150000, seats: 5, trans: 'Auto', img: 'indexjs8.webp' },
        { name: 'BMW 7 Series', category: 'luxury', price: 25000, seats: 5, trans: 'Auto', img: 'indexjs3.webp' },
        { name: 'Suzuki Swift', category: 'economy', price: 2500, seats: 5, trans: 'Manual', img: 'services2.webp' },
        { name: 'Hyundai i20', category: 'economy', price: 3200, seats: 5, trans: 'Auto', img: 'indexjs2.webp' },
        { name: 'Lamborghini Huracán', category: 'sports', price: 75000, seats: 2, trans: 'DCT', img: 'services1.webp' },
        { name: 'Mercedes S-Class', category: 'luxury', price: 28000, seats: 5, trans: 'Auto', img: 'viewerjs12.webp' }
    ];

    let activeFilter = 'all';
    let currentSort = 'default';
    let visibleCount = 6;
    const PAGE_SIZE = 6;

    function getFilteredSorted() {
        let list = activeFilter === 'all' ? [...fleetData] : fleetData.filter(c => c.category === activeFilter);

        if (currentSort === 'price-asc') list.sort((a, b) => a.price - b.price);
        if (currentSort === 'price-desc') list.sort((a, b) => b.price - a.price);
        if (currentSort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

        return list;
    }

    function renderFleet() {
        const grid = document.getElementById('fleetGrid');
        const loadMore = document.getElementById('loadMoreBtn');
        if (!grid) return;

        const filtered = getFilteredSorted();
        const visible = filtered.slice(0, visibleCount);

        grid.innerHTML = visible.map(car => `
            <div class="fleet-card">
                <div class="fleet-card-img">
                    <img src="${car.img}" alt="${car.name}" loading="lazy">
                    <span class="fleet-badge" style="background: ${getCategoryColor(car.category)}">${car.category}</span>
                </div>
                <div class="fleet-card-body">
                    <h4>${car.name}</h4>
                    <div class="specs">
                        <span><i class="fas fa-users"></i> ${car.seats} Seats</span>
                        <span><i class="fas fa-cog"></i> ${car.trans}</span>
                    </div>
                    <div class="footer">
                        <span class="price">₹${car.price.toLocaleString()} <small>/day</small></span>
                        <button class="action-btn" onclick="alert('Book ${car.name}')">Book</button>
                    </div>
                </div>
            </div>
        `).join('');

        if (loadMore) {
            loadMore.style.display = filtered.length > visibleCount ? 'inline-flex' : 'none';
        }
    }

    function getCategoryColor(cat) {
        const colors = {
            economy: '#6b7280',
            suv: '#2ecc71',
            luxury: '#00a3ff',
            electric: '#1e90ff',
            sports: '#e63946'
        };
        return colors[cat] || '#00a3ff';
    }

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            visibleCount = PAGE_SIZE;
            renderFleet();
        });
    });

    // Sort
    const sortSelect = document.getElementById('fleetSort');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            currentSort = sortSelect.value;
            visibleCount = PAGE_SIZE;
            renderFleet();
        });
    }

    // Load more
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            visibleCount += PAGE_SIZE;
            renderFleet();
        });
    }

    // Initial render
    renderFleet();

    // ─── STATS COUNTER ANIMATION ───
    document.querySelectorAll('.stat-value').forEach(el => {
        const text = el.textContent;
        const num = parseFloat(text.replace(/[$,]/g, ''));
        if (!isNaN(num) && text !== '—') {
            let current = 0;
            const step = num / 35;
            const interval = setInterval(() => {
                current += step;
                if (current >= num) {
                    current = num;
                    clearInterval(interval);
                }
                if (text.includes('.')) {
                    el.textContent = current.toFixed(1);
                } else {
                    el.textContent = Math.floor(current).toLocaleString();
                }
            }, 25);
        }
    });

    console.log('Viewer Dashboard initialized.');
});