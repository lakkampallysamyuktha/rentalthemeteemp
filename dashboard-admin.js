/* ============================================================
   ADMIN DASHBOARD – INTERACTIONS (faster rendering)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── REDIRECT ALL DATA-HREF BUTTONS TO 404 ───
    document.querySelectorAll('[data-href]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = el.dataset.href || '404.html';
        });
    });

    // ─── LOAD USER DATA ───
    const userData = JSON.parse(localStorage.getItem('login_user') || localStorage.getItem('signup_user') || '{"username":"Admin","role":"admin"}');
    const username = userData.username || 'Admin';

    document.getElementById('adminName').textContent = username;
    document.getElementById('adminAvatar').textContent = username.charAt(0).toUpperCase();
    document.getElementById('greetName').textContent = username;

    // ─── NAVIGATION ───
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('pageTitle');
    const titles = {
        overview: 'Overview',
        bookings: 'Bookings',
        fleet: 'Fleet Manager',
        users: 'Users',
        revenue: 'Revenue',
        reports: 'Reports',
        settings: 'Settings',
        logs: 'Activity Logs'
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

            // Render content if needed (re-render on demand)
            if (target === 'fleet') renderFleet();
            if (target === 'logs') renderLogs();
            if (target === 'revenue') renderRevenueChart();
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

    // ─── WEEKLY CHART (instant render) ───
    function renderWeeklyChart() {
        const container = document.getElementById('weeklyChart');
        if (!container) return;

        const data = [
            { day: 'Mon', value: 65 },
            { day: 'Tue', value: 78 },
            { day: 'Wed', value: 55 },
            { day: 'Thu', value: 92 },
            { day: 'Fri', value: 85 },
            { day: 'Sat', value: 70 },
            { day: 'Sun', value: 48 }
        ];

        const max = Math.max(...data.map(d => d.value));

        container.innerHTML = data.map(d => `
            <div class="chart-bar-wrap">
                <div class="chart-bar" style="height: ${(d.value / max) * 100}%;"></div>
                <span class="chart-bar-label">${d.day}</span>
            </div>
        `).join('');
    }
    renderWeeklyChart();

    // ─── FLEET STATUS (instant render) ───
    function renderFleetStatus() {
        const container = document.getElementById('fleetStatus');
        if (!container) return;

        const data = [
            { label: 'Available', pct: 65, color: '#10b981' },
            { label: 'Booked', pct: 28, color: '#3b82f6' },
            { label: 'Maintenance', pct: 7, color: '#f59e0b' }
        ];

        container.innerHTML = data.map(d => `
            <div class="fleet-status-item">
                <span class="label">${d.label}</span>
                <div class="bar-wrap">
                    <div class="bar-fill" style="width: ${d.pct}%; background: ${d.color};"></div>
                </div>
                <span class="pct">${d.pct}%</span>
            </div>
        `).join('');
    }
    renderFleetStatus();

    // ─── FLEET GRID ───
    const fleetData = [
        { name: 'Tesla Model 3', category: 'electric', price: 22000, seats: 5, trans: 'Auto', img: 'adminjs1.webp' },
        { name: 'BMW i4', category: 'electric', price: 25000, seats: 5, trans: 'Auto', img: 'adminjs2.webp' },
        { name: 'Range Rover Sport', category: 'suv', price: 35000, seats: 5, trans: 'Auto', img: 'adminjs3.webp' },
        { name: 'Audi Q8', category: 'suv', price: 30000, seats: 5, trans: 'Auto', img: 'adminjs4.webp' },
        { name: 'Ferrari 488', category: 'sports', price: 55000, seats: 2, trans: 'DCT', img: 'adminjs5.webp' },
        { name: 'Porsche 911', category: 'sports', price: 45000, seats: 2, trans: 'PDK', img: 'adminjs6.webp' },
        { name: 'Rolls-Royce Ghost', category: 'luxury', price: 150000, seats: 5, trans: 'Auto', img: 'indexjs9.webp' },
        { name: 'BMW 7 Series', category: 'luxury', price: 25000, seats: 5, trans: 'Auto', img: 'adminjs8.webp' },
        { name: 'Suzuki Swift', category: 'economy', price: 2500, seats: 5, trans: 'Manual', img: 'adminjs9.webp' },
        { name: 'Hyundai i20', category: 'economy', price: 3200, seats: 5, trans: 'Auto', img: 'indexjs2.webp' }
    ];

    let activeFilter = 'all';

    function renderFleet(filter = activeFilter) {
        const grid = document.getElementById('fleetGrid');
        if (!grid) return;

        const filtered = filter === 'all' ? fleetData : fleetData.filter(c => c.category === filter);

        grid.innerHTML = filtered.map(car => `
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
                        <button class="action-btn" data-href="404.html">Edit</button>
                    </div>
                </div>
            </div>
        `).join('');

        grid.querySelectorAll('[data-href]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = el.dataset.href;
            });
        });
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
            renderFleet(activeFilter);
        });
    });

    // Initial render of fleet (hidden by default, but needed if user clicks Fleet tab)
    renderFleet();

    // ─── REVENUE CHART (instant render) ───
    function renderRevenueChart() {
        const container = document.getElementById('revenueChart');
        if (!container) return;

        const data = [
            { label: 'Jan', value: 12000 },
            { label: 'Feb', value: 18000 },
            { label: 'Mar', value: 15000 },
            { label: 'Apr', value: 25000 },
            { label: 'May', value: 32000 },
            { label: 'Jun', value: 28000 },
            { label: 'Jul', value: 38000 },
            { label: 'Aug', value: 42000 },
            { label: 'Sep', value: 35000 },
            { label: 'Oct', value: 40000 },
            { label: 'Nov', value: 45000 },
            { label: 'Dec', value: 48000 }
        ];

        const max = Math.max(...data.map(d => d.value));

        container.innerHTML = data.map(d => `
            <div class="rev-bar-wrap">
                <div class="rev-bar" style="height: ${(d.value / max) * 100}%;"></div>
                <span class="rev-label">${d.label}</span>
            </div>
        `).join('');
    }

    // ─── LOGS ───
    function renderLogs() {
        const terminal = document.getElementById('logTerminal');
        if (!terminal) return;

        const logs = [
            { time: '10:23:14', level: 'info', msg: 'User john@stackly.com signed in' },
            { time: '10:25:02', level: 'success', msg: 'Booking #BK-001 confirmed' },
            { time: '10:30:45', level: 'warning', msg: 'Fleet maintenance scheduled for BMW i4' },
            { time: '10:35:10', level: 'info', msg: 'New user registration: sarah@stackly.com' },
            { time: '10:40:33', level: 'success', msg: 'Payment received: $2,500 from John Doe' },
            { time: '10:48:20', level: 'error', msg: 'API timeout on fleet status check' },
            { time: '10:55:01', level: 'info', msg: 'System backup completed' },
            { time: '11:02:44', level: 'success', msg: 'Booking #BK-003 marked as completed' },
            { time: '11:10:18', level: 'warning', msg: 'Low fuel alert: Tesla Model 3 (#A42)' },
            { time: '11:15:37', level: 'info', msg: 'User profile updated: Mike Chen' }
        ];

        terminal.innerHTML = logs.map(log => `
            <div class="log-line">
                <span class="log-time">${log.time}</span>
                <span class="log-level ${log.level}">[${log.level.toUpperCase()}]</span>
                <span class="log-msg">${log.msg}</span>
            </div>
        `).join('');

        terminal.scrollTop = terminal.scrollHeight;
    }

    // ─── STATS COUNTER ANIMATION (keep, but they run immediately) ───
    document.querySelectorAll('.stat-value').forEach(el => {
        const text = el.textContent;
        const num = parseFloat(text.replace(/[$,]/g, ''));
        if (!isNaN(num) && text !== '—') {
            let current = 0;
            const step = Math.max(num / 40, 1);
            const interval = setInterval(() => {
                current += step;
                if (current >= num) {
                    current = num;
                    clearInterval(interval);
                }
                if (text.includes('$')) {
                    el.textContent = '$' + Math.floor(current).toLocaleString();
                } else if (text.includes('.')) {
                    el.textContent = current.toFixed(1);
                } else {
                    el.textContent = Math.floor(current).toLocaleString();
                }
            }, 20);
        }
    });

    console.log('Admin Dashboard initialized (fast render).');
});