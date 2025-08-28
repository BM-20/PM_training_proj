// Theme persistence
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