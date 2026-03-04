import casesData from '../data/cases.json';

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderCaseSection(caseItem, allCases, isFirst) {
  const section = document.createElement('section');
  section.id = caseItem.id;
  section.className = 'case-section' + (caseItem.type === 'b' ? ' case-section--alt' : '');

  /* ---- Строка 1: nav | stats | platforms ---- */
  if (isFirst) {
    const navWrapper = document.createElement('div');
    navWrapper.className = 'case-section__nav-wrapper case-section__cell case-section__cell--r1-c1 case-section__cell--text';
    const nav = document.createElement('nav');
    nav.className = 'case-section__nav case-nav case-section__cell--text';
    nav.setAttribute('aria-label', 'Навигация по кейсам');
    allCases.forEach((c) => {
      if (!c.navLabel) return;
      const a = document.createElement('a');
      a.href = `#${c.id}`;
      a.className = 'case-nav__link';
      a.textContent = c.navLabel;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById(c.id)?.scrollIntoView({ behavior: 'smooth' });
      });
      nav.appendChild(a);
    });
    navWrapper.appendChild(nav);
    section.appendChild(navWrapper);
  } else {
    const spacer = document.createElement('div');
    spacer.className = 'case-section__cell case-section__cell--r1-c1';
    spacer.setAttribute('aria-hidden', 'true');
    section.appendChild(spacer);
  }

  if (caseItem.stats || caseItem.statsPeriod) {
    const stats = document.createElement('div');
    stats.className = 'case-section__stats case-section__cell case-section__cell--r1-c2 case-section__cell--text';
    stats.innerHTML = [caseItem.stats, caseItem.statsPeriod].filter(Boolean).map(escapeHtml).join('<br>');
    section.appendChild(stats);
  }

  if (caseItem.platforms?.length) {
    const platforms = document.createElement('div');
    platforms.className = 'case-section__platforms case-section__cell case-section__cell--r1-c3 case-section__cell--text';
    platforms.innerHTML = caseItem.platforms.map((p) => escapeHtml(p)).join('<br>');
    section.appendChild(platforms);
  }

  /* ---- Строка 2: project-names | description | right-content (starts) ---- */
  if (caseItem.projectNames?.length) {
    const names = document.createElement('div');
    names.className = 'case-section__project-names case-section__cell case-section__cell--r2-c1 case-section__cell--text';
    names.innerHTML = caseItem.projectNames.map((n) => escapeHtml(n)).join('<br>');
    section.appendChild(names);
  } else if (caseItem.title) {
    const title = document.createElement('h2');
    title.className = 'case-section__title case-section__cell case-section__cell--r2-c1 case-section__cell--text';
    title.textContent = caseItem.title;
    section.appendChild(title);
  }

  if (caseItem.description) {
    const desc = document.createElement('div');
    desc.className = 'case-section__description case-section__cell case-section__cell--r2-c2 case-section__cell--text';
    const p = document.createElement('p');
    p.textContent = caseItem.description;
    desc.appendChild(p);
    section.appendChild(desc);
  }

  /* ---- Строка 3: links | achievements | right-content (spans rows 2-4) ---- */
  if (caseItem.links?.length) {
    const links = document.createElement('div');
    links.className = 'case-section__links case-section__cell case-section__cell--r3-c1 case-section__cell--text';
    caseItem.links.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.url;
      a.className = 'case-section__link';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML = `<span>${escapeHtml(link.label)}</span><span class="case-section__link-arrow">↙</span>`;
      links.appendChild(a);
    });
    section.appendChild(links);
  }

  if (caseItem.achievements?.length) {
    const ul = document.createElement('ul');
    ul.className = 'case-section__achievements case-section__cell case-section__cell--r3-c2 case-section__cell--text';
    caseItem.achievements.forEach((text) => {
      const li = document.createElement('li');
      li.textContent = text;
      ul.appendChild(li);
    });
    section.appendChild(ul);
  }

  /* ---- Правая колонка: ASCII + screens (span rows 2-4) ---- */
  const rightContent = document.createElement('div');
  rightContent.className = 'case-section__right case-section__cell case-section__cell--r2-c3';

  const asciiBar = document.createElement('div');
  asciiBar.className = 'case-section__ascii-bar';
  asciiBar.setAttribute('aria-hidden', 'true');
  rightContent.appendChild(asciiBar);

  const rightInner = document.createElement('div');
  rightInner.className = 'case-section__right-content-inner';

  const asciiBarH = document.createElement('div');
  asciiBarH.className = 'case-section__ascii-bar-h';
  asciiBarH.setAttribute('aria-hidden', 'true');
  rightInner.appendChild(asciiBarH);

  const screens = document.createElement('div');
  screens.className = 'case-section__screens';
  if (caseItem.gallery?.length) {
    screens.dataset.gallery = JSON.stringify(caseItem.gallery);
  }
  screens.setAttribute('role', caseItem.gallery?.length ? 'button' : 'presentation');
  screens.setAttribute('tabindex', caseItem.gallery?.length ? 0 : -1);
  screens.setAttribute('aria-label', caseItem.gallery?.length ? 'Открыть галерею' : '');

  const img = document.createElement('img');
  img.className = 'case-section__screens-image';
  img.src = caseItem.preview || caseItem.gallery?.[0] || '';
  img.alt = `Скриншот проекта ${caseItem.projectNames?.[0] || caseItem.title || 'Проект'}`;
  img.loading = 'lazy';
  img.addEventListener('load', function () {
    const isLandscape = this.naturalWidth >= this.naturalHeight;
    this.classList.add(isLandscape ? 'img--landscape' : 'img--portrait');
  });
  screens.appendChild(img);

  rightInner.appendChild(screens);
  rightContent.appendChild(rightInner);
  section.appendChild(rightContent);

  return section;
}

function initNavLinksActive() {
  const links = document.querySelectorAll('.case-nav__link');
  const sections = document.querySelectorAll('.case-section');
  if (!links.length || !sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const intersecting = entries.filter((e) => e.isIntersecting);
      if (!intersecting.length) return;
      const best = intersecting.reduce((a, b) =>
        (a.intersectionRatio >= b.intersectionRatio ? a : b)
      );
      const id = best.target.id;
      links.forEach((a) => {
        a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
      });
    },
    { threshold: 0.15, rootMargin: '-20% 0px -60% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
}

function initCaseNavSticky() {
  const nav = document.querySelector('.case-section__nav');
  const hero = document.querySelector('#hero');
  if (!nav || !hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      nav.classList.toggle('is-fixed', !entry.isIntersecting);
    },
    { threshold: 0, rootMargin: '-1px 0px 0px 0px' }
  );

  observer.observe(hero);
}

function initNavClickHandlers() {
  document.querySelectorAll('.case-nav__link').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href')?.slice(1);
      if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function initScreensImageHandlers(container) {
  container.querySelectorAll('.case-section__screens-image').forEach((img) => {
    if (img.complete) {
      const isLandscape = img.naturalWidth >= img.naturalHeight;
      img.classList.add(isLandscape ? 'img--landscape' : 'img--portrait');
    } else {
      img.addEventListener('load', function () {
        const isLandscape = this.naturalWidth >= this.naturalHeight;
        this.classList.add(isLandscape ? 'img--landscape' : 'img--portrait');
      });
    }
  });
}

export function initCasesRender() {
  const container = document.getElementById('cases');
  if (!container) return;

  const isPreRendered = container.children.length > 0;

  if (!isPreRendered) {
    const cases = Array.isArray(casesData) ? casesData : [];
    cases.forEach((c, i) => {
      const section = renderCaseSection(c, cases, i === 0);
      container.appendChild(section);
    });
  } else {
    initNavClickHandlers();
    initScreensImageHandlers(container);
  }

  initNavLinksActive();
  initCaseNavSticky();
}
