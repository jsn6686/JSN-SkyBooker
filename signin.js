// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

let isDark = false;

themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    html.classList.toggle('dark');
    sunIcon.classList.toggle('hidden');
    moonIcon.classList.toggle('hidden');
});

// Tab Switching
const signinTab = document.getElementById('signinTab');
const signupTab = document.getElementById('signupTab');
const signinForm = document.getElementById('signinForm');
const signupForm = document.getElementById('signupForm');

const activeTabClass = 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md';
const inactiveTabClass = 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200';

signinTab.addEventListener('click', () => {
    // Switch tab styles
    signinTab.className = `flex-1 py-3 rounded-lg font-semibold transition-colors ${activeTabClass}`;
    signupTab.className = `flex-1 py-3 rounded-lg font-semibold transition-colors ${inactiveTabClass}`;
    
    // Show/hide forms
    signinForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    
    // Clear errors
    clearAllErrors();
});

signupTab.addEventListener('click', () => {
    // Switch tab styles
    signupTab.className = `flex-1 py-3 rounded-lg font-semibold transition-colors ${activeTabClass}`;
    signinTab.className = `flex-1 py-3 rounded-lg font-semibold transition-colors ${inactiveTabClass}`;
    
    // Show/hide forms
    signupForm.classList.remove('hidden');
    signinForm.classList.add('hidden');
    
    // Clear errors
    clearAllErrors();
});

// Sign In Form Validation
signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    clearAllErrors();
    let isValid = true;
    
    const email = document.getElementById('signinEmail').value.trim();
    const password = document.getElementById('signinPassword').value;
    
    // Email validation
    if (!email) {
        showError('signinEmailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('signinEmailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Password validation
    if (!password) {
        showError('signinPasswordError', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('signinPasswordError', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    if (isValid) {
        // Simulate successful login
        showSuccessMessage('Sign In Successful!', 'Welcome back to SkyBooker');
        
        // Store user info (in a real app, this would come from the server)
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        
        // Redirect to home page after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
});

// Sign Up Form Validation
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    clearAllErrors();
    let isValid = true;
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsAccepted = document.getElementById('termsCheckbox').checked;
    
    // First name validation
    if (!firstName) {
        showError('firstNameError', 'First name is required');
        isValid = false;
    } else if (firstName.length < 2) {
        showError('firstNameError', 'First name must be at least 2 characters');
        isValid = false;
    }
    
    // Last name validation
    if (!lastName) {
        showError('lastNameError', 'Last name is required');
        isValid = false;
    } else if (lastName.length < 2) {
        showError('lastNameError', 'Last name must be at least 2 characters');
        isValid = false;
    }
    
    // Email validation
    if (!email) {
        showError('signupEmailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('signupEmailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Password validation
    if (!password) {
        showError('signupPasswordError', 'Password is required');
        isValid = false;
    } else if (password.length < 8) {
        showError('signupPasswordError', 'Password must be at least 8 characters');
        isValid = false;
    } else if (!isStrongPassword(password)) {
        showError('signupPasswordError', 'Password must contain letters and numbers');
        isValid = false;
    }
    
    // Confirm password validation
    if (!confirmPassword) {
        showError('confirmPasswordError', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        isValid = false;
    }
    
    // Terms validation
    if (!termsAccepted) {
        showError('termsError', 'You must agree to the Terms of Service');
        isValid = false;
    }
    
    if (isValid) {
        // Simulate successful registration
        showSuccessMessage('Account Created Successfully!', `Welcome to SkyBooker, ${firstName}!`);
        
        // Store user info (in a real app, this would be handled by the server)
        sessionStorage.setItem('userLoggedIn', 'true');
        sessionStorage.setItem('userEmail', email);
        sessionStorage.setItem('userName', `${firstName} ${lastName}`);
        
        // Redirect to home page after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
});

// Real-time password validation
document.getElementById('signupPassword').addEventListener('input', (e) => {
    const password = e.target.value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password && confirmPassword && password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
    } else {
        hideError('confirmPasswordError');
    }
});

document.getElementById('confirmPassword').addEventListener('input', (e) => {
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = e.target.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
    } else {
        hideError('confirmPasswordError');
    }
});

// Helper Functions
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.classList.add('hidden');
    }
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.classList.add('hidden');
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isStrongPassword(password) {
    // Check if password contains at least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasLetter && hasNumber;
}

function showSuccessMessage(title, message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 success-badge';
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="text-2xl">✓</div>
            <div>
                <p class="font-bold">${title}</p>
                <p class="text-sm">${message}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Social login buttons (placeholder functionality)
const socialButtons = document.querySelectorAll('button[type="button"]');
socialButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const buttonText = e.currentTarget.textContent.trim();
        if (buttonText.includes('Google') || buttonText.includes('Facebook')) {
            alert(`${buttonText} login coming soon!\n\nIn a full application, this would redirect to ${buttonText} OAuth.`);
        }
    });
});