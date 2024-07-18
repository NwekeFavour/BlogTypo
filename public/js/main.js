document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {

                  window.location.href = '/dashboard';
                // Redirect without adding to history
               history.replaceState(null, '', '/dashboard');
            } else {
                document.getElementById('errorMessage').textContent = result.message;
            }
        } catch (error) {
            console.error('An error occurred:', error);
            document.getElementById('errorMessage').textContent = 'An error occurred';
        }
});