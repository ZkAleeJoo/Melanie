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
