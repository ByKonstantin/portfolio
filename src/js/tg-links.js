const TG_USERNAME = 'made_by_konstantin';

function isMobileDevice() {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.matchMedia('(max-width: 768px)').matches && window.matchMedia('(pointer: coarse)').matches)
  );
}

function initTgLinks() {
  const links = document.querySelectorAll('.hero__link--tg, .sticky-nav__link--tg, .contact__link');
  if (!links.length) return;

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (!isMobileDevice()) return;
      e.preventDefault();
      window.location.href = `tg://resolve?domain=${TG_USERNAME}`;
    });
  });
}

export { initTgLinks };
