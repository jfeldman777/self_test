let currentAudio = null;
let audioPlayer = null;
let playPauseBtn = null;
let playPauseIcon = null;
let playerTime = null;
let timeUpdateInterval = null;

document.addEventListener('DOMContentLoaded', function() {
  const sectionHeaders = document.querySelectorAll('.section-header');
  
  sectionHeaders.forEach(header => {
    const section = header.closest('.accordion-section');
    const content = section.querySelector('.section-content');
    const icon = header.querySelector('.section-icon');
    
    header.addEventListener('click', function() {
      if (content.classList.contains('section-collapsed')) {
        // Expand
        content.classList.remove('section-collapsed');
        icon.textContent = '▲';
      } else {
        // Collapse
        content.classList.add('section-collapsed');
        icon.textContent = '▼';
      }
    });
  });
  
  // Initialize player elements
  audioPlayer = document.getElementById('audio-player');
  playPauseBtn = document.getElementById('play-pause-btn');
  playPauseIcon = document.getElementById('play-pause-icon');
  playerTime = document.getElementById('player-time');
});

function formatTime(seconds) {
  if (isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updatePlayerTime() {
  if (currentAudio && playerTime) {
    const current = formatTime(currentAudio.currentTime);
    const duration = formatTime(currentAudio.duration);
    playerTime.textContent = `${current} / ${duration}`;
  }
}

function showPlayer() {
  if (audioPlayer) {
    audioPlayer.style.display = 'block';
  }
}

function hidePlayer() {
  if (audioPlayer) {
    audioPlayer.style.display = 'none';
  }
  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval);
    timeUpdateInterval = null;
  }
}

function togglePlayPause() {
  if (!currentAudio) return;
  
  if (currentAudio.paused) {
    currentAudio.play();
    playPauseIcon.textContent = '⏸';
  } else {
    currentAudio.pause();
    playPauseIcon.textContent = '▶';
  }
}

function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    playPauseIcon.textContent = '▶';
  }
  hidePlayer();
}

function restartAudio() {
  if (currentAudio) {
    currentAudio.currentTime = 0;
    if (currentAudio.paused) {
      currentAudio.play();
      playPauseIcon.textContent = '⏸';
    }
  }
}

function showWelcome() {
  //подключить файл dialog_1/wav
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  
  currentAudio = new Audio('dialog_1.wav');
  
  currentAudio.addEventListener('play', function() {
    showPlayer();
    playPauseIcon.textContent = '⏸';
    timeUpdateInterval = setInterval(updatePlayerTime, 100);
  });
  
  currentAudio.addEventListener('pause', function() {
    playPauseIcon.textContent = '▶';
  });
  
  currentAudio.addEventListener('ended', function() {
    hidePlayer();
    playPauseIcon.textContent = '▶';
    currentAudio = null;
  });
  
  currentAudio.addEventListener('loadedmetadata', function() {
    updatePlayerTime();
  });
  
  currentAudio.addEventListener('timeupdate', function() {
    updatePlayerTime();
  });
  
  currentAudio.play();
  const welcomeContent = document.getElementById('welcome-content');
  welcomeContent.style.display = 'block';
} 