(function () {
  const links = document.querySelectorAll('.nav-links a');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.endsWith(currentPath)) {
      link.classList.add('active');
    }
  });

  const input = document.getElementById('photoUpload');
  const gallery = document.getElementById('photoGallery');
  const storageKey = 'melanie_home_photos';

  if (!input || !gallery) {
    return;
  }

  function createPhotoCard(src) {
    const item = document.createElement('article');
    item.className = 'photo-item';

    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Foto subida';
    item.appendChild(img);

    gallery.appendChild(item);
  }

  function loadSavedPhotos() {
    const saved = localStorage.getItem(storageKey);
    if (!saved) {
      return;
    }

    try {
      const photos = JSON.parse(saved);
      if (!Array.isArray(photos)) {
        return;
      }

      photos.forEach(createPhotoCard);
    } catch (_error) {
      localStorage.removeItem(storageKey);
    }
  }

  input.addEventListener('change', (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    const savedPhotos = JSON.parse(localStorage.getItem(storageKey) || '[]');

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : '';
        if (!result) {
          return;
        }

        createPhotoCard(result);
        savedPhotos.push(result);
        localStorage.setItem(storageKey, JSON.stringify(savedPhotos));
      };

      reader.readAsDataURL(file);
    });

    input.value = '';
  });

  loadSavedPhotos();
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
  let minutes = Math.floor(seconds / 60);
  let partSeconds = Math.floor(seconds % 60);
  if (partSeconds < 10) { partSeconds = `0${partSeconds}`; }
  return `${minutes}:${partSeconds}`;
}
