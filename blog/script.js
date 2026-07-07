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

// Adjust drop cap alignment if the paragraph text fits on a single line next to the drop cap
function adjustDropCaps() {
  const dropCaps = document.querySelectorAll('.first-syllabal');
  dropCaps.forEach(span => {
    const p = span.closest('p');
    if (!p) return;
    
    // Temporarily remove class to measure natural state
    p.classList.remove('single-line-dropcap');
    
    // Create a temporary element to measure text height without the drop cap
    const measure = document.createElement('span');
    measure.style.display = 'inline';
    
    // Copy font styles to get accurate measurements
    const computedStyle = window.getComputedStyle(p);
    measure.style.font = computedStyle.font;
    measure.style.fontSize = computedStyle.fontSize;
    measure.style.fontFamily = computedStyle.fontFamily;
    measure.style.fontWeight = computedStyle.fontWeight;
    measure.style.letterSpacing = computedStyle.letterSpacing;
    measure.style.lineHeight = computedStyle.lineHeight;
    
    // Text content excluding the first-syllabal span
    const dropCapText = span.textContent;
    let fullText = p.textContent || '';
    if (fullText.startsWith(dropCapText)) {
      fullText = fullText.substring(dropCapText.length);
    }
    measure.textContent = fullText;
    
    // Add to body temporarily to measure
    measure.style.position = 'absolute';
    measure.style.visibility = 'hidden';
    
    // The available width for the text is paragraph width minus the drop cap width (approximate)
    const pWidth = p.clientWidth;
    const dropCapWidth = span.offsetWidth;
    const availableWidth = pWidth - dropCapWidth - 20; // extra padding for margin and safety
    measure.style.width = Math.max(availableWidth, 0) + 'px';
    measure.style.display = 'block';
    
    document.body.appendChild(measure);
    const textHeight = measure.clientHeight;
    document.body.removeChild(measure);
    
    const lineHeight = parseFloat(computedStyle.lineHeight) || 24;
    
    // If the text height fits in roughly one line, align it centrally
    if (textHeight <= lineHeight * 1.3) {
      p.classList.add('single-line-dropcap');
    }
  });
}

// Run on load and resize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', adjustDropCaps);
} else {
  adjustDropCaps();
}
window.addEventListener('load', adjustDropCaps);
window.addEventListener('resize', adjustDropCaps);


