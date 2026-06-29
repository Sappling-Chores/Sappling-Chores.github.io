// GitHub icon hover animation handling (guarded against null if icon is moved or changed)
const githubIcon = document.querySelector('.github-icon');
if (githubIcon) {
  githubIcon.addEventListener('mouseenter', () => {
    githubIcon.classList.add('hovered');
    githubIcon.classList.remove('unhovered');
  });

  githubIcon.addEventListener('mouseleave', () => {
    githubIcon.classList.add('unhovered');
    githubIcon.classList.remove('hovered');
  });
}

// Local Clock Widget (Asia/Kolkata)
const myTime = document.getElementById("clock");

function currentTime() {
  if (!myTime) return;
  const now = new Date();
  const options = {
    timeZone: "Asia/Kolkata",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };

  const timeString = now.toLocaleString("en-IN", options);
  myTime.textContent = timeString;
}

if (myTime) {
  setInterval(currentTime, 1000);
  currentTime();
}

// Live Status Widget and Dynamic Pulsing Dot Coloring
const statusWidget = document.getElementById('status-widget');
const statusDot = document.querySelector('.status-dot');
const GIST_RAW_URL = "https://gist.githubusercontent.com/Sappling-Chores/b167ba8e2798c58ff2c497febde568ad/raw/status.json";

async function fetchPythonStatus() {
  if (!statusWidget) return;
  try {
    const response = await fetch(`${GIST_RAW_URL}?t=${new Date().getTime()}`);
    const data = await response.json();

    const statusList = ["Code", "Fusion-360", "KiCad", "Chrome", "Offline", "YouTube", "Study", "Music"];

    let status_live = data.status;
    let music_artist = data.musicArtist;
    let show_status_val = "Online 🟢";
    let statusColor = "var(--dot-color)";

    switch (status_live) {
      case statusList[0]: // Code
        show_status_val = "working!! 💻";
        statusColor = "rgb(173, 255, 47)";
        break;

      case statusList[1]: // Fusion-360
        show_status_val = "cad time! 🗿";
        statusColor = "rgb(255, 165, 0)";
        break;

      case statusList[2]: // KiCad
        show_status_val = "Wires⚡";
        statusColor = "rgb(144, 213, 255)";
        break;

      case statusList[3]: // Chrome
        show_status_val = "Chrome 🥳";
        statusColor = "rgb(255, 255, 0)";
        break;

      case statusList[4]: // Offline
        show_status_val = "Sleeping 💤";
        statusColor = "#FFC0CB";
        break;

      case statusList[5]: // YouTube
        show_status_val = "Youtube 🍿";
        statusColor = "rgb(255, 0, 0)";
        break;

      case statusList[6]: // Study
        show_status_val = "Studying 😭";
        statusColor = "rgb(88, 86, 214)"; // Sleek violet/blue instead of generic blue
        break;

      case statusList[7]: // Music
        show_status_val = `Listening to '${music_artist}' 🎵`;
        statusColor = "#DAB1DA";
        break;

      case statusList[8]:
        show_status_val = "Offline"
        statusColor = "#808080"
        break;
    }

    statusWidget.innerHTML = `<p>${show_status_val}</p>`;
    statusWidget.style.color = statusColor;
    if (statusDot) {
      statusDot.style.backgroundColor = statusColor;
    }
  } catch (error) {
    console.error("Error fetching status:", error);
    if (statusWidget) {
      statusWidget.textContent = "Online 🟢";
    }
  }
}

if (statusWidget) {
  fetchPythonStatus();
  setInterval(fetchPythonStatus, 15000);
}

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

// Initialize theme state on script load
initTheme();
