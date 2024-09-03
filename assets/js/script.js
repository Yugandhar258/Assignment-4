// Fetch Password from API
function fetchPassword() {
    const apiUrl = "https://www.psswrd.net/api/v1/password/?length=17&lower=1&upper=0&int=1&special=0";
    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => data.data.password)
        .catch(error => {
            console.error("Error fetching password:", error);
            return generatePassword(); // Fallback to local generation if API fails
        });
}


function generatePassword(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:',.<>?/";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

// Update Password Display
function updatePasswordDisplay(password) {
    const passwordDisplay = document.getElementById("passwordDisplay");
    passwordDisplay.textContent = password;
}

// Generate Password Button Click
document.getElementById("generateBtn").addEventListener("click", function() {
    fetchPassword().then(password => {
        updatePasswordDisplay(password);
        applyDynamicStyles();
    });
});

// Apply Dynamic Styles
function applyDynamicStyles() {
    const passwordSection = document.getElementById("passwordSection");
    passwordSection.style.border = `2px solid ${getRandomColor()}`;
    passwordSection.style.boxShadow = `0 0 20px ${getRandomColor()}`;

    // Direct font style change if enabled
    const fontToggle = document.getElementById("fontToggle").checked;
    const passwordDisplay = document.getElementById("passwordDisplay");

    if (fontToggle) {
        passwordDisplay.style.fontFamily = getRandomFont();
        passwordDisplay.style.color = getRandomColor();
    }
}
document.getElementById("autoGenerateBtn").addEventListener("click", function() {
    const seconds = document.getElementById("autoGenerateInput").value || 30;
    setAutoGenerateInterval(parseInt(seconds));
});
// Auto Generate Password with Interval
let autoGenerateInterval;
function setAutoGenerateInterval(seconds) {
    clearInterval(autoGenerateInterval); // Clear any existing interval
    let countdown = seconds;
    const passwordSection = document.getElementById("passwordSection");
    
    autoGenerateInterval = setInterval(() => {
        if (countdown > 0) {
            countdown--;
            passwordSection.querySelector("h2").textContent = `Generated Password (Next in ${countdown}s)`;
        } else {
            fetchPassword().then(password => updatePasswordDisplay(password));
            countdown = seconds;
        }
    }, 1000);
}

// Stop Auto Generate
document.getElementById("stopBtn").addEventListener("click", function() {
    clearInterval(autoGenerateInterval);
    document.getElementById("passwordSection").querySelector("h2").textContent = "Generated Password";
});

// Get Random Color
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Get Random Font
function getRandomFont() {
    const fonts = ["Arial", "Verdana", "Helvetica", "Courier New", "Georgia", "Times New Roman", "Trebuchet MS"];
    return fonts[Math.floor(Math.random() * fonts.length)];
}

// Auto-Refresh Password Display every 30 seconds
setInterval(() => {
    fetchPassword().then(password => updatePasswordDisplay(password));
}, 30000);

// Initial password generation on page load
fetchPassword().then(password => updatePasswordDisplay(password));
