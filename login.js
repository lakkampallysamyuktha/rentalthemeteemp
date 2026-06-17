/* ============================================================
   LOGIN PAGE – INTERACTIONS (working redirects)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── BACK TO HOME ──
    const backHomeBtn = document.getElementById('backHomeBtn');
    if (backHomeBtn) {
        backHomeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }

    // ── PASSWORD TOGGLE ──
    const togglePw = document.getElementById('togglePw');
    const pwInput = document.getElementById('loginPassword');

    if (togglePw && pwInput) {
        togglePw.addEventListener('click', () => {
            const isPassword = pwInput.type === 'password';
            pwInput.type = isPassword ? 'text' : 'password';
            togglePw.querySelector('i').className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
        });
    }

    // ── FORM SUBMISSION ──
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const usernameInput = document.getElementById('loginUsername');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const roleSelect = document.getElementById('loginRole');

    function showError(msg) {
        if (loginError) {
            loginError.textContent = msg;
            loginError.classList.add('show');
        }
    }

    function clearError() {
        if (loginError) {
            loginError.classList.remove('show');
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearError();

            const username = usernameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const role = roleSelect.value;

            if (!username || !email || !password || !role) {
                return showError('Please fill in all fields.');
            }
            if (username.length < 2) {
                return showError('Username must be at least 2 characters.');
            }
            if (!email.includes('@') || !email.includes('.')) {
                return showError('Please enter a valid email address.');
            }
            if (password.length < 6) {
                return showError('Password must be at least 6 characters.');
            }

            // Save user data
            const user = {
                username: username,
                email: email,
                role: role
            };
            localStorage.setItem('login_user', JSON.stringify(user));

            // Redirect (no popup)
            if (role === 'admin') {
                window.location.href = 'dashboard-admin.html';
            } else {
                window.location.href = 'dashboard-viewer.html';
            }
        });
    }

    // ── SOCIAL BUTTONS (popup placeholders) ──
    document.getElementById('googleBtn')?.addEventListener('click', () => {
        alert('Google Sign-In coming soon!');
    });
    document.getElementById('githubBtn')?.addEventListener('click', () => {
        alert('GitHub Sign-In coming soon!');
    });

    // ── FORGOT PASSWORD (popup placeholder) ──
    document.querySelector('.forgot-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Password reset link will be sent to your email.');
    });

    // ── REMEMBER ME ──
    const rememberCheck = document.querySelector('.remember-me input[type="checkbox"]');
    if (rememberCheck) {
        rememberCheck.checked = localStorage.getItem('remember_me') === 'true';
        rememberCheck.addEventListener('change', () => {
            localStorage.setItem('remember_me', rememberCheck.checked);
        });
    }

    console.log('Login page initialized.');
});