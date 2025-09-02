/*// Theme persistence
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

// Password toggle & strength
const pwd = document.getElementById('password');
const toggle = document.getElementById('togglePwd');
const bar = document.getElementById('strengthBar');

toggle.addEventListener('click', () => {
    const isPw = pwd.getAttribute('type') === 'password';
    pwd.setAttribute('type', isPw ? 'text' : 'password');
    toggle.textContent = isPw ? 'Hide' : 'Show';
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

// ===================== TRANSLATIONS =====================
const LANG_KEY = 'redfolio-lang';
const defaultLang = 'en';
let currentLang = localStorage.getItem(LANG_KEY) || defaultLang;

const translations = {
  en: {
    title: "Login for Redfolio",
    quote: "Log In to view your page",
    username: "Username",
    password: "Password",
    show: "Show",
    hide: "Hide",
    login: "Log In",
    themeToggle: "Toggle light / dark"
  },
  es: {
    title: "Iniciar sesión en Redfolio",
    quote: "Inicia sesión para ver tu página",
    username: "Usuario",
    password: "Contraseña",
    show: "Mostrar",
    hide: "Ocultar",
    login: "Iniciar sesión",
    themeToggle: "Cambiar claro / oscuro"
  }
};

// Apply translation to page
function applyLang(lang) {
  document.getElementById("title").innerHTML = translations[lang].title + ' <span style="color: var(--red-400)">Redfolio</span>';
  document.getElementById("quote").textContent = translations[lang].quote;
  document.getElementById("usernameLabel").textContent = translations[lang].username;
  document.getElementById("passwordLabel").textContent = translations[lang].password;
  document.getElementById("togglePwd").textContent = translations[lang].show;
  document.getElementById("loginBtn").textContent = translations[lang].login;
  document.getElementById("themeToggleText").textContent = translations[lang].themeToggle;

  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
}

// Initial load
applyLang(currentLang);

// Toggle language button
document.getElementById("toggleLang").addEventListener("click", () => {
  const newLang = currentLang === "en" ? "es" : "en";
  applyLang(newLang);
});

// ===================== PASSWORD TOGGLE =====================
const pwd = document.getElementById('password');
const toggle = document.getElementById('togglePwd');
toggle.addEventListener('click', () => {
  const isPw = pwd.getAttribute('type') === 'password';
  pwd.setAttribute('type', isPw ? 'text' : 'password');
  toggle.textContent = isPw ? translations[currentLang].hide : translations[currentLang].show;
  pwd.focus();
});
*/
// Defer is set in the script tag, but wrap in DOMContentLoaded for safety.
document.addEventListener('DOMContentLoaded', () => {
  // ====== Theme (kept; defaults to dark) ======
  const body = document.body;
  const THEME_KEY = 'redfolio-theme';
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'light') body.classList.add('light');

  const toggleThemeBtn = document.getElementById('toggleTheme');
  const themeSwitch = document.getElementById('themeSwitch');
  const setSwitch = () => {
    if (!themeSwitch) return;
    const isLight = body.classList.contains('light');
    themeSwitch.querySelector('span').style.transform = isLight ? 'translateX(16px)' : 'translateX(0)';
  };
  setSwitch();

  toggleThemeBtn?.addEventListener('click', () => {
    body.classList.toggle('light');
    localStorage.setItem(THEME_KEY, body.classList.contains('light') ? 'light' : 'dark');
    setSwitch();
  });

  // ====== Translations (EN <-> ES) ======
  const LANG_KEY = 'redfolio-lang';
  const preferred = localStorage.getItem(LANG_KEY) ||
                    (navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en');
  let currentLang = preferred;

  const translations = {
    en: {
      titlePrefix: "Login for",
      quote: "Log In to view your page",
      username: "Username",
      password: "Password",
      show: "Show",
      hide: "Hide",
      login: "Log In",
      themeToggle: "Toggle light / dark",
      langButton: "ES"  // indicates what you'll switch to
    },
    es: {
      titlePrefix: "Iniciar sesión para",
      quote: "Inicia sesión para ver tu página",
      username: "Usuario",
      password: "Contraseña",
      show: "Mostrar",
      hide: "Ocultar",
      login: "Iniciar sesión",
      themeToggle: "Cambiar claro / oscuro",
      langButton: "EN"
    }
  };

  const els = {
    titlePrefix: document.getElementById('titlePrefix'),
    quote: document.getElementById('quote'),
    usernameLabel: document.getElementById('usernameLabel'),
    passwordLabel: document.getElementById('passwordLabel'),
    togglePwd: document.getElementById('togglePwd'),
    loginBtn: document.getElementById('loginBtn'),
    themeToggleText: document.getElementById('themeToggleText'),
    toggleLang: document.getElementById('toggleLang'),
    pwd: document.getElementById('password'),
    bar: document.getElementById('strengthBar')
  };

  function applyLang(lang) {
    const t = translations[lang];
    els.titlePrefix.textContent = t.titlePrefix;
    els.quote.textContent = t.quote;
    els.usernameLabel.textContent = t.username;
    els.passwordLabel.textContent = t.password;
    els.togglePwd.textContent = t.show;
    els.loginBtn.textContent = t.login;
    els.themeToggleText.textContent = t.themeToggle;
    els.toggleLang.textContent = t.langButton;

    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
  }

  // Initial render
  applyLang(currentLang);

  // Language toggle works now
  els.toggleLang.addEventListener('click', () => {
    const next = currentLang === 'en' ? 'es' : 'en';
    applyLang(next);
  });

  // ====== Password toggle & strength ======
  els.togglePwd.addEventListener('click', () => {
    const isPw = els.pwd.getAttribute('type') === 'password';
    els.pwd.setAttribute('type', isPw ? 'text' : 'password');
    els.togglePwd.textContent = isPw ? translations[currentLang].hide : translations[currentLang].show;
    els.pwd.focus();
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
    for (let k in variations) variationCount += variations[k] ? 1 : 0;
    score += (variationCount - 1) * 10;
    return Math.min(100, Math.floor(score));
  }

  els.pwd.addEventListener('input', () => {
    const s = scorePassword(els.pwd.value);
    els.bar.style.width = s + '%';
    els.bar.style.background =
      s > 75 ? 'linear-gradient(90deg,#22c55e,#15803d)' :
      s > 40 ? 'linear-gradient(90deg,#f59e0b,#b45309)' :
               'linear-gradient(90deg,#b91c1c,#e11d48)';
  });
});
