// Theme persistence
console.log("Register.js loading...");

const body = document.body;
const THEME_KEY = 'redfolio-theme';
const saved = localStorage.getItem(THEME_KEY);
if (saved === 'light') body.classList.add('light');

const toggleThemeBtn = document.getElementById('toggleTheme');
const themeSwitch = document.getElementById('themeSwitch');
const setSwitch = () => themeSwitch.classList.toggle('active', !body.classList.contains('light'));
setSwitch();

toggleThemeBtn.addEventListener('click', () => {
    body.classList.toggle('light');
    localStorage.setItem(THEME_KEY, body.classList.contains('light') ? 'light' : 'dark');
    setSwitch();
});

// Language system
const LANG_KEY = 'redfolio-lang';
const defaultLang = 'en';
let currentLang = localStorage.getItem(LANG_KEY) || defaultLang;

const translations = {
    en: {
        title: "Register for Redfolio",
        quote: "Create your account to manage your stocks.",
        firstname_label: "First name",
        lastname_label: "Last name", 
        username_label: "Username",
        password_label: "Password",
        username_help: "Use 3–24 characters. Letters, numbers, underscores.",
        password_help: "Use 8+ chars with a mix of letters, numbers & symbols.",
        terms_text: "I agree to the Terms & Privacy.",
        create_account: "Create account",
        sign_in_quote: "Already have an account? Sign in",
        toggle_theme: "Toggle light / dark",
        show: "Show",
        hide: "Hide"
    },
    es: {
        title: "Registro para Redfolio",
        quote: "Crea tu cuenta para administrar tus acciones.",
        firstname_label: "Nombre",
        lastname_label: "Apellido",
        username_label: "Usuario",
        password_label: "Contraseña",
        username_help: "Usa de 3 a 24 caracteres. Letras, números, guiones bajos.",
        password_help: "Usa 8+ caracteres con una mezcla de letras, números y símbolos.",
        terms_text: "Acepto los Términos y Privacidad.",
        create_account: "Crear cuenta",
        sign_in_quote: "¿Ya tienes una cuenta? Inicia sesión",
        toggle_theme: "Alternar claro / oscuro",
        show: "Mostrar",
        hide: "Ocultar"
    }
};

// Password toggle & strength
const pwd = document.getElementById('password');
const toggle = document.getElementById('togglePwd');
const bar = document.getElementById('strengthBar');

toggle.addEventListener('click', () => {
    const isPw = pwd.getAttribute('type') === 'password';
    pwd.setAttribute('type', isPw ? 'text' : 'password');
    toggle.textContent = isPw ? translations[currentLang].hide : translations[currentLang].show;
    pwd.focus();
});

function scorePassword(value) {
    let score = 0;
    if (!value) return 0;
    const letters = {};
    for (let i = 0; i < value.length; i++) {
        letters[value[i]] = (letters[value[i]] || 0) + 1;
        score += 5.0 / letters[value[i]];
    }
    const variations = {
        digits: /\d/.test(value),
        lower: /[a-z]/.test(value),
        upper: /[A-Z]/.test(value),
        nonWords: /[^\w]/.test(value)
    };
    let variationCount = 0;
    for (let check in variations) variationCount += variations[check] ? 1 : 0;
    score += (variationCount - 1) * 10;
    score = Math.min(100, Math.floor(score));
    return score;
}

pwd.addEventListener('input', () => {
    const s = scorePassword(pwd.value);
    bar.style.width = s + '%';
    bar.style.background = s > 75 ? 'linear-gradient(90deg, #4caf50, #2e7d32)'
                        : s > 40 ? 'linear-gradient(90deg, #ff9800, #f57c00)'
                                : 'linear-gradient(90deg, var(--red-400), var(--red-700))';
});

// Function to apply translations to the page
function applyTranslations() {
    const lang = translations[currentLang];
    
    // Update title
    const titlePrefix = document.getElementById('titlePrefix');
    if (titlePrefix) {
        titlePrefix.textContent = currentLang === 'en' ? 'Register for' : 'Registro para';
    }
    
    // Update subtitle
    const quote = document.getElementById('quote');
    if (quote) {
        quote.textContent = lang.quote;
    }
    
    // Update form labels
    const firstnameLabel = document.getElementById('firstnameLabel');
    if (firstnameLabel) firstnameLabel.textContent = lang.firstname_label;
    
    const lastnameLabel = document.getElementById('lastnameLabel');
    if (lastnameLabel) lastnameLabel.textContent = lang.lastname_label;
    
    const usernameLabel = document.getElementById('usernameLabel');
    if (usernameLabel) usernameLabel.textContent = lang.username_label;
    
    const passwordLabel = document.getElementById('passwordLabel');
    if (passwordLabel) passwordLabel.textContent = lang.password_label;
    
    // Update help texts
    const usernameHelp = document.getElementById('usernameHelp');
    if (usernameHelp) usernameHelp.textContent = lang.username_help;
    
    const passwordHelp = document.getElementById('passwordHelp');
    if (passwordHelp) passwordHelp.textContent = lang.password_help;
    
    // Update terms text
    const termsText = document.getElementById('termsText');
    if (termsText) {
        termsText.innerHTML = currentLang === 'en' 
            ? 'I agree to the <a href="#" style="color: var(--red);">Terms</a> & <a href="#" style="color: var(--red);">Privacy</a>.'
            : 'Acepto los <a href="#" style="color: var(--red);">Términos</a> & <a href="#" style="color: var(--red);">Privacidad</a>.';
    }
    
    // Update button texts
    const createBtn = document.getElementById('createBtn');
    if (createBtn) createBtn.textContent = lang.create_account;
    
    const themeToggleText = document.getElementById('themeToggleText');
    if (themeToggleText) themeToggleText.textContent = lang.toggle_theme;
    
    // Update footer
    const footerText = document.getElementById('footerText');
    if (footerText) {
        footerText.innerHTML = currentLang === 'en'
            ? 'Already have an account? <a href="/auth/login" style="color: var(--red);">Sign in</a>'
            : '¿Ya tienes una cuenta? <a href="/auth/login" style="color: var(--red);">Inicia sesión</a>';
    }
    
    // Update password toggle button
    const passwordToggle = document.getElementById('togglePwd');
    if (passwordToggle) {
        const isPasswordVisible = pwd.getAttribute('type') === 'text';
        passwordToggle.textContent = isPasswordVisible ? lang.hide : lang.show;
    }
    
    // Update language button
    const langBtn = document.getElementById('toggleLang');
    if (langBtn) {
        langBtn.textContent = currentLang === 'en' ? 'ES' : 'EN';
    }
}

// Function to switch language
function switchLanguage() {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    localStorage.setItem(LANG_KEY, currentLang);
    applyTranslations();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Apply initial translations
    applyTranslations();
    
    // Add event listener for language toggle button
    const toggleLangBtn = document.getElementById('toggleLang');
    if (toggleLangBtn) {
        toggleLangBtn.addEventListener('click', switchLanguage);
    }
});