document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from submitting normally
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Simple validation
        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        
        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }
        
        // Simulate login request (replace with actual API call if needed)
        simulateLogin(email, password);
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function simulateLogin(email, password) {
        // Simulating an API call with a delay
        setTimeout(() => {
            if (email === "user@example.com" && password === "password123") {
                alert("Login successful!");
                window.location.href = "/dashboard"; // Redirect on success
            } else {
                alert("Invalid email or password. Please try again.");
            }
        }, 1000);
    }
});
