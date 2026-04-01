let lastFocus = null;

function getDrawer() {
  return document.querySelector('.case-drawer');
}

function openDrawer(items) {
  const drawer = getDrawer();
  if (!drawer) return;
  if (!Array.isArray(items) || items.length === 0) return;

  const body = drawer.querySelector('.case-drawer__body');
  if (!body) return;

  lastFocus = document.activeElement;
  body.textContent = '';
  items.forEach((text) => {
    const p = document.createElement('p');
    p.className = 'case-drawer__text';
    p.textContent = text;
    body.appendChild(p);
  });

  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('case-drawer-open');

  drawer.querySelector('.case-drawer__close')?.focus();
}

function closeDrawer() {
  const drawer = getDrawer();
  if (!drawer || !drawer.classList.contains('is-open')) return;

  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('case-drawer-open');

  if (lastFocus && typeof lastFocus.focus === 'function') {
    lastFocus.focus();
  }
  lastFocus = null;
}

function tryOpenFromTrigger(trigger) {
  const raw = trigger.dataset?.achievements;
  if (!raw) return;
  try {
    const items = JSON.parse(raw);
    if (Array.isArray(items) && items.length) openDrawer(items);
  } catch {
    console.warn('Case drawer: invalid data-achievements JSON', raw);
  }
}

export function initCaseDrawer() {
  const drawer = getDrawer();
  if (!drawer) return;

  const backdrop = drawer.querySelector('.case-drawer__backdrop');
  const closeBtn = drawer.querySelector('.case-drawer__close');

  closeBtn?.addEventListener('click', () => closeDrawer());
  backdrop?.addEventListener('click', () => closeDrawer());

  drawer.querySelector('.case-drawer__panel')?.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  document.addEventListener('click', (e) => {
    const more = e.target.closest('.case-section__more');
    if (more) {
      e.preventDefault();
      const section = more.closest('.case-section');
      const screens = section?.querySelector('.case-section__screens[data-achievements]');
      if (screens) tryOpenFromTrigger(screens);
      return;
    }

    const trigger = e.target.closest('.case-section__screens[data-achievements]');
    if (!trigger) return;
    tryOpenFromTrigger(trigger);
  });

  document.addEventListener('keydown', (e) => {
    if (drawer.classList.contains('is-open') && e.key === 'Escape') {
      e.preventDefault();
      closeDrawer();
      return;
    }

    const moreLink = document.activeElement?.closest('.case-section__more');
    if (moreLink && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      const section = moreLink.closest('.case-section');
      const screens = section?.querySelector('.case-section__screens[data-achievements]');
      if (screens?.dataset?.achievements) tryOpenFromTrigger(screens);
      return;
    }

    const trigger = document.activeElement?.closest('.case-section__screens[data-achievements]');
    if (trigger && (e.key === 'Enter' || e.key === ' ') && trigger.dataset?.achievements) {
      e.preventDefault();
      tryOpenFromTrigger(trigger);
    }
  });
}
