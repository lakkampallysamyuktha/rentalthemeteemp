/* ============================================================
   SIGNUP PAGE – INTERACTIONS (working redirects)
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

    // ── PASSWORD TOGGLES ──
    const togglePw = document.getElementById('togglePw');
    const pwInput = document.getElementById('signupPassword');
    if (togglePw && pwInput) {
        togglePw.addEventListener('click', () => {
            const isPassword = pwInput.type === 'password';
            pwInput.type = isPassword ? 'text' : 'password';
            togglePw.querySelector('i').className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
        });
    }

    const toggleConfirm = document.getElementById('toggleConfirm');
    const confirmInput = document.getElementById('signupConfirm');
    if (toggleConfirm && confirmInput) {
        toggleConfirm.addEventListener('click', () => {
            const isPassword = confirmInput.type === 'password';
            confirmInput.type = isPassword ? 'text' : 'password';
            toggleConfirm.querySelector('i').className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
        });
    }

    // ── PASSWORD STRENGTH METER ──
    const strengthBar = document.getElementById('strengthBar');
    const strengthLabel = document.getElementById('strengthLabel');

    function getStrength(pw) {
        let score = 0;
        if (pw.length >= 6) score++;
        if (pw.length >= 10) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        return score;
    }

    const strengthConfig = [
        { pct: '0%', color: 'transparent', text: '', textColor: 'transparent' },
        { pct: '20%', color: '#e63946', text: 'Weak', textColor: '#e63946' },
        { pct: '40%', color: '#f4a261', text: 'Fair', textColor: '#f4a261' },
        { pct: '60%', color: '#f0c040', text: 'Good', textColor: '#f0c040' },
        { pct: '80%', color: '#10b981', text: 'Strong', textColor: '#10b981' },
        { pct: '100%', color: '#00a3ff', text: 'Very Strong', textColor: '#00a3ff' },
    ];

    if (pwInput && strengthBar && strengthLabel) {
        pwInput.addEventListener('input', () => {
            const score = getStrength(pwInput.value);
            const cfg = strengthConfig[score];
            strengthBar.style.width = cfg.pct;
            strengthBar.style.background = cfg.color;
            strengthLabel.textContent = cfg.text;
            strengthLabel.style.color = cfg.textColor;
        });
    }

    // ── CONFIRM PASSWORD LIVE CHECK ──
    if (confirmInput && pwInput) {
        confirmInput.addEventListener('input', () => {
            if (!confirmInput.value) {
                confirmInput.classList.remove('is-valid', 'is-invalid');
                return;
            }
            if (confirmInput.value === pwInput.value) {
                confirmInput.classList.add('is-valid');
                confirmInput.classList.remove('is-invalid');
            } else {
                confirmInput.classList.add('is-invalid');
                confirmInput.classList.remove('is-valid');
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

    // ── FORM SUBMISSION ──
    const signupForm = document.getElementById('signupForm');
    const signupError = document.getElementById('signupError');
    const signupSuccess = document.getElementById('signupSuccess');

    const nameInput = document.getElementById('signupName');
    const usernameInput = document.getElementById('signupUsername');
    const emailInput = document.getElementById('signupEmail');
    const roleSelect = document.getElementById('signupRole');
    const agreeCheck = document.getElementById('agreeTerms');

    function showError(msg) {
        signupError.textContent = msg;
        signupError.classList.add('show');
        signupSuccess.classList.remove('show');
    }

    function showSuccess(msg) {
        signupSuccess.textContent = msg;
        signupSuccess.classList.add('show');
        signupError.classList.remove('show');
    }

    function clearMessages() {
        signupError.classList.remove('show');
        signupSuccess.classList.remove('show');
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearMessages();

            const name = nameInput.value.trim();
            const username = usernameInput.value.trim();
            const email = emailInput.value.trim();
            const password = pwInput.value;
            const confirm = confirmInput.value;
            const role = roleSelect.value;
            const agreed = agreeCheck.checked;

            if (!name || !username || !email || !password || !confirm || !role) {
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
            if (password !== confirm) {
                return showError('Passwords do not match.');
            }
            if (!agreed) {
                return showError('Please accept the Terms of Service.');
            }

            // Save user data
            const user = { name, username, email, role };
            localStorage.setItem('signup_user', JSON.stringify(user));

            showSuccess('Account created! Redirecting...');

            // Redirect (no popup)
            setTimeout(() => {
                if (role === 'admin') {
                    window.location.href = 'login.html';
                } else {
                    window.location.href = 'login.html';
                }
            }, 600);
        });
    }

    console.log('Signup page initialized.');
});