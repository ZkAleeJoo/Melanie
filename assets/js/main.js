(function () {
  const links = document.querySelectorAll('.nav-links a');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.endsWith(currentPath)) {
      link.classList.add('active');
    }
  });
})();

function togglePlay(audioId, btn) {
  const audio = document.getElementById(audioId);
  const playIcon = btn.querySelector('.play-icon');

  document.querySelectorAll('audio').forEach(otherAudio => {
    if (otherAudio.id !== audioId && !otherAudio.paused) {
      otherAudio.pause();
      const otherBtn = otherAudio.closest('.custom-audio-player').querySelector('.play-btn');
      otherBtn.querySelector('.play-icon').innerHTML = '&#9658;';
    }
  });

  if (audio.paused) {
    audio.play();
    playIcon.innerHTML = '&#10074;&#10074;';
  } else {
    audio.pause();
    playIcon.innerHTML = '&#9658;';
  }
}

function seekAudio(audioId, seekBar) {
  const audio = document.getElementById(audioId);
  const seekTo = audio.duration * (seekBar.value / 100);
  audio.currentTime = seekTo;
}

document.querySelectorAll('.custom-audio-player').forEach(player => {
  const audio = player.querySelector('audio');
  const seekBar = player.querySelector('.seek-bar');
  const currentTimeDisplay = player.querySelector('.current-time');
  const totalDurationDisplay = player.querySelector('.total-duration');

  audio.addEventListener('loadedmetadata', () => {
    totalDurationDisplay.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    seekBar.value = progress;
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener('ended', () => {
    player.querySelector('.play-icon').innerHTML = '&#9658;';
    seekBar.value = 0;
    currentTimeDisplay.textContent = '0:00';
  });
});

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  let minutes = Math.floor(seconds / 60);
  let partSeconds = Math.floor(seconds % 60);
  if (partSeconds < 10) { partSeconds = `0${partSeconds}`; }
  return `${minutes}:${partSeconds}`;
}

document.addEventListener('DOMContentLoaded', () => {

  const revealElements = document.querySelectorAll('.card, .list li');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  const titleElement = document.getElementById('typewriter');

  if (titleElement) {
    const textToType = titleElement.innerText;
    titleElement.innerText = '';
    let i = 0;

    function typeWriter() {
      if (i < textToType.length) {
        titleElement.innerHTML += textToType.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
        setTimeout(() => {
          titleElement.style.borderRight = 'none';
        }, 2000);
      }
    }

    setTimeout(typeWriter, 500);
  }
});