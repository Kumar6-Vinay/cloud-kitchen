export function initNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.getElementById('nav-menu');

  if (!toggle || !menu) return;

  const desktopQuery = window.matchMedia('(min-width: 992px)');

  const isOpen = () => menu.classList.contains('is-open');

  const openNav = () => {
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-locked');
  };

  const closeNav = () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-locked');
  };

  toggle.addEventListener('click', () => {
    if (isOpen()) {
      closeNav();
    } else {
      openNav();
    }
  });

  menu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('click', (event) => {
    if (!isOpen()) return;
    if (menu.contains(event.target) || toggle.contains(event.target)) return;
    closeNav();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      closeNav();
    }
  });

  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) closeNav();
  });
}
