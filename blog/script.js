// Light / Dark Theme Toggle Controller
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'light') {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
  } else if (savedTheme === 'dark') {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
  } else {
    // Fallback to system configuration
    if (systemDark) {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
    }
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    }
  });
}

initTheme();

