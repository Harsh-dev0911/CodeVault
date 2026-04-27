document.addEventListener('DOMContentLoaded', () => {
    // Redirect to dashboard if already logged in
    if (localStorage.getItem('token')) {
        window.location.href = '/dashboard.html';
        return;
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const data = await apiFetch('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                });

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                showToast('Successfully logged in!', 'success');
                setTimeout(() => window.location.href = '/dashboard.html', 500);
            } catch (error) {
                // Handled in api.js
            }
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const data = await apiFetch('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ username, email, password })
                });

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                showToast('Registration successful!', 'success');
                setTimeout(() => window.location.href = '/dashboard.html', 500);
            } catch (error) {
                // Handled in api.js
            }
        });
    }
});
