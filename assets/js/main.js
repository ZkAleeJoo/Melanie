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
