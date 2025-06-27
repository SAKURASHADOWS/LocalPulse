// --- auth.js v1.3 --- Debugging Session Saving ---

document.addEventListener('DOMContentLoaded', () => {
    // ... (codul pentru registerForm rămâne la fel)
    const registerForm = document.getElementById('register-form');
    if (registerForm) { /* ... logica de înregistrare ... */ }

    // --- LOGIC FOR THE LOGIN FORM (with new debugging log) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const messageContainer = document.getElementById('message-container');
            messageContainer.textContent = '';
            messageContainer.className = '';

            const email = document.getElementById('email-input').value;
            const password = document.getElementById('password-input').value;
            const serverUrl = 'const serverUrl = 'https://localpulse-i7eg.onrender.com/register';

            try {
                const response = await fetch(serverUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                
                // --- ================== LINIA NOUĂ DE DEPANARE ================== ---
                // Această linie va afișa în consolă exact ce am primit de la server
                console.log('Data received from server:', data);
                // --- ============================================================= ---

                if (!response.ok) { throw new Error(data.error || 'Invalid credentials'); }

                // Verificăm dacă sesiunea există în datele primite
                if (data && data.session) {
                    localStorage.setItem('localpulse_session', JSON.stringify(data.session));
                    console.log('Session successfully saved to Local Storage.');
                } else {
                    console.error('Error: Session data is missing in the server response.');
                }

                messageContainer.textContent = 'Login successful! Redirecting...';
                messageContainer.className = 'success-message';
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000); 

            } catch (error) {
                messageContainer.textContent = `Error: ${error.message}`;
                messageContainer.className = 'error-message';
                console.error('Login fetch error:', error);
            }
        });
    }
});