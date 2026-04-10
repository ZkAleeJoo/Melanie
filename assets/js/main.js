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

function initFloatingBottles() {
  const BOTTLE_COUNT = 15; 
  const bottles = [];
  
  const bottleSVG = `
    <svg viewBox="0 0 512 512" width="100%" height="100%" fill="currentColor">
      <path d="M504.3 84.7l-77-77c-10.9-10.9-28.8-10.9-39.6 0l-33 33c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l25.5 25.5-121.2 121.2c-54.2-22.3-118.8-11.3-162.5 32.5L14.8 324.2C-5 344-4.9 375.9 14.8 395.7l101.5 101.5c19.8 19.8 51.8 19.8 71.5 0l81.7-81.7c43.7-43.7 54.7-108.3 32.5-162.5L423.2 131.8l25.5 25.5c3.1 3.1 7.2 4.7 11.3 4.7 4.1 0 8.2-1.6 11.3-4.7l33-33c10.9-10.9 10.9-28.7 0-39.6z"></path>
    </svg>
  `;

  let mouseX = -1000;
  let mouseY = -1000;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  class Bottle {
    constructor() {
      this.el = document.createElement('div');
      this.el.className = 'floating-bottle';
      this.el.innerHTML = bottleSVG;
      document.body.appendChild(this.el);

      this.x = Math.random() * window.innerWidth;
      this.y = Math.random() * window.innerHeight;
      
      this.vx = (Math.random() - 0.5) * 1.5; 
      this.vy = (Math.random() - 0.5) * 1.5;
      
      this.rotation = Math.random() * 360;
      this.vRot = (Math.random() - 0.5) * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.vRot;

      if (this.x < 0 || this.x > window.innerWidth - 35) this.vx *= -1;
      if (this.y < 0 || this.y > window.innerHeight - 35) this.vy *= -1;

      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const interactionRadius = 150; 

      if (distance < interactionRadius) {
        this.el.classList.add('active');
        const force = (interactionRadius - distance) / interactionRadius;
        this.vx += (dx / distance) * force * 0.8;
        this.vy += (dy / distance) * force * 0.8;
        this.vRot += (Math.random() - 0.5) * 5; 
      } else {
        this.el.classList.remove('active');
      }

      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 1.5) {
        this.vx *= 0.98;
        this.vy *= 0.98;
      }

      this.el.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
    }
  }

  for (let i = 0; i < BOTTLE_COUNT; i++) {
    bottles.push(new Bottle());
  }

  function animate() {
    bottles.forEach(bottle => bottle.update());
    requestAnimationFrame(animate);
  }

  animate();
}

window.addEventListener('DOMContentLoaded', initFloatingBottles);

if (window.matchMedia("(min-width: 768px)").matches) {
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const outline = document.createElement('div');
  outline.className = 'cursor-outline';
  
  document.body.appendChild(dot);
  document.body.appendChild(outline);

  window.addEventListener('mousemove', (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
    
    outline.style.left = `${e.clientX}px`;
    outline.style.top = `${e.clientY}px`;
  });

  window.addEventListener('mousedown', () => {
    outline.style.transform = 'translate(-50%, -50%) scale(0.7)';
  });
  
  window.addEventListener('mouseup', () => {
    outline.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      outline.style.width = '45px';
      outline.style.height = '45px';
      outline.style.backgroundColor = 'rgba(212, 163, 115, 0.15)'; 
    });
    el.addEventListener('mouseleave', () => {
      outline.style.width = '30px';
      outline.style.height = '30px';
      outline.style.backgroundColor = 'transparent';
    });
  });
}