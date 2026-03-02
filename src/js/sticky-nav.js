let nav = null;
let lastScrollY = 0;
let isHeroVisible = true;
let isContactVisible = false;
let isCursorInTopThird = false;
let scrollUpVisible = false;

function isMobile() {
  return window.matchMedia('(max-width: 800px)').matches;
}

function updateVisibility() {
  const onMobile = isMobile();
  const shouldShow =
    !isHeroVisible &&
    !isContactVisible &&
    (onMobile || scrollUpVisible || isCursorInTopThird);
  nav?.classList.toggle('is-visible', shouldShow);
}

function updateContactVisibility() {
  document.body.classList.toggle('contact-visible', isContactVisible);
}

function onScroll() {
  const currentY = window.scrollY;
  const scrollingUp = currentY < lastScrollY;

  if (scrollingUp && currentY > 0) {
    scrollUpVisible = true;
  } else if (!scrollingUp) {
    scrollUpVisible = false;
  }

  lastScrollY = currentY;

  if (isHeroVisible) {
    nav?.classList.remove('is-visible');
  } else {
    updateVisibility();
  }
}

function onMouseMove(e) {
  const topThird = window.innerHeight / 3;
  isCursorInTopThird = e.clientY < topThird;
  if (!isHeroVisible) {
    updateVisibility();
  }
}

export function initStickyNav() {
  nav = document.querySelector('.sticky-nav');
  if (!nav) return;

  nav.removeAttribute('hidden');

  const hero = document.querySelector('#hero');
  if (!hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      isHeroVisible = entry.isIntersecting;
      if (isHeroVisible) {
        nav.classList.remove('is-visible');
      } else {
        updateVisibility();
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(hero);

  const contact = document.querySelector('#contact');
  if (contact) {
    const contactObserver = new IntersectionObserver(
      ([entry]) => {
        isContactVisible = entry.isIntersecting;
        updateContactVisibility();
        if (isContactVisible) {
          nav.classList.remove('is-visible');
        } else {
          updateVisibility();
        }
      },
      { threshold: 0.25 }
    );
    contactObserver.observe(contact);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('resize', () => {
    if (isMobile()) updateVisibility();
  });
}
