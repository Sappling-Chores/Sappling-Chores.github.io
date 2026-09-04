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

// Live Status Widget and Music Card Controller
const statusWidget = document.getElementById('status-widget');
const statusDot = document.querySelector('.status-dot');
const GIST_RAW_URL = "https://gist.githubusercontent.com/Sappling-Chores/b167ba8e2798c58ff2c497febde568ad/raw/status.json";

// Music Card DOM Elements
const musicThumbnail = document.getElementById('music-thumbnail');
const musicTitle = document.getElementById('music-title');
const musicArtist = document.getElementById('music-artist');
const musicBadge = document.getElementById('music-badge');
const musicStatusLabel = document.getElementById('music-status-label');
const musicTrackLink = document.getElementById('music-track-link');
const musicTimeElapsed = document.getElementById('music-time-elapsed');
const musicTimeRemaining = document.getElementById('music-time-remaining');
const musicProgressFill = document.getElementById('music-progress-fill');
const musicIconPlay = document.getElementById('music-icon-play');
const musicIconPause = document.getElementById('music-icon-pause');

let currentMusicState = null;
let musicTickerInterval = null;

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateMusicCard(music) {
  if (!music || !musicTitle) return;
  currentMusicState = music;

  musicTitle.textContent = music.title || "No Track Detected";
  musicArtist.textContent = music.artist || "Sappling";
  
  if (music.thumbnail && musicThumbnail) {
    musicThumbnail.src = music.thumbnail;
  }

  const isPlaying = !!music.isPlaying;
  
  if (musicBadge) {
    if (isPlaying) {
      musicBadge.classList.add('is-playing');
      if (musicStatusLabel) musicStatusLabel.textContent = "playing rn";
    } else {
      musicBadge.classList.remove('is-playing');
      if (musicStatusLabel) musicStatusLabel.textContent = "last played";
    }
  }

  if (musicIconPlay && musicIconPause) {
    if (isPlaying) {
      musicIconPlay.classList.add('hidden');
      musicIconPause.classList.remove('hidden');
    } else {
      musicIconPlay.classList.remove('hidden');
      musicIconPause.classList.add('hidden');
    }
  }

  if (musicTrackLink) {
    if (music.link) {
      musicTrackLink.href = music.link;
      musicTrackLink.classList.remove('hidden');
    } else {
      musicTrackLink.classList.add('hidden');
    }
  }

  renderMusicProgress();
}

function renderMusicProgress() {
  if (!currentMusicState) return;

  let pos = currentMusicState.position || 0;
  let dur = currentMusicState.duration || 0;

  if (currentMusicState.isPlaying && currentMusicState.updatedAt) {
    const nowSec = Math.floor(Date.now() / 1000);
    const elapsedSinceUpdate = nowSec - currentMusicState.updatedAt;
    pos = pos + elapsedSinceUpdate;
  }

  if (dur > 0 && pos > dur) {
    pos = dur;
  }

  if (musicTimeElapsed) {
    musicTimeElapsed.textContent = formatTime(pos);
  }

  if (musicTimeRemaining) {
    const rem = dur > pos ? dur - pos : 0;
    musicTimeRemaining.textContent = dur > 0 ? `-${formatTime(rem)}` : "-0:00";
  }

  if (musicProgressFill) {
    const pct = dur > 0 ? Math.min(100, Math.max(0, (pos / dur) * 100)) : 0;
    musicProgressFill.style.width = `${pct}%`;
  }
}

// Start smooth 1s ticker for live progress bar
if (!musicTickerInterval) {
  musicTickerInterval = setInterval(renderMusicProgress, 1000);
}

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

    if (data.music) {
      updateMusicCard(data.music);
      if (data.music.artist) {
        music_artist = data.music.artist;
      }
    }

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
        statusColor = "rgb(88, 86, 214)";
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

  if (savedTheme === 'light-mode' || savedTheme === 'light') {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
  } else if (savedTheme === 'dark-mode' || savedTheme === 'dark') {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      localStorage.setItem('theme', 'light-mode');
    } else {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark-mode');
    }
  });
}

// Initialize theme state on script load
initTheme();
