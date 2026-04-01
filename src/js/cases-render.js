import casesData from '../data/cases.json';

/** false — не выводим achievements (данные остаются в cases.json). Платформы всегда по полю platforms. */
const SHOW_CASE_ACHIEVEMENTS = false;

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderCaseSection(caseItem) {
  const section = document.createElement('section');
  section.id = caseItem.id;
  section.className = 'case-section' + (caseItem.type === 'b' ? ' case-section--alt' : '');

  /* ---- Колонка 1: строка 2 — названия + период (statsPeriod) ---- */
  if (caseItem.projectNames?.length || caseItem.title || caseItem.statsPeriod) {
    const lead = document.createElement('div');
    lead.className = 'case-section__lead case-section__cell case-section__cell--text';

    if (caseItem.projectNames?.length) {
      const names = document.createElement('div');
      names.className = 'case-section__project-names';
      names.innerHTML = caseItem.projectNames.map((n) => escapeHtml(n)).join('<br>');
      lead.appendChild(names);
    } else if (caseItem.title) {
      const title = document.createElement('h2');
      title.className = 'case-section__title';
      title.textContent = caseItem.title;
      lead.appendChild(title);
    }

    if (caseItem.statsPeriod) {
      const period = document.createElement('div');
      period.className = 'case-section__stats-period';
      period.textContent = caseItem.statsPeriod;
      lead.appendChild(period);
    }

    section.appendChild(lead);
  }

  const hasStack = Boolean(
    caseItem.description || caseItem.stats || caseItem.platforms?.length
  );
  const hasTail = Boolean(
    (SHOW_CASE_ACHIEVEMENTS && caseItem.achievements?.length) || caseItem.links?.length
  );

  if (hasStack || hasTail) {
    const mainCol = document.createElement('div');
    mainCol.className = 'case-section__main case-section__cell case-section__cell--text';

    if (hasStack) {
      const stack = document.createElement('div');
      stack.className = 'case-section__stack';

      if (caseItem.description) {
        const desc = document.createElement('div');
        desc.className = 'case-section__description';
        const p = document.createElement('p');
        p.textContent = caseItem.description;
        desc.appendChild(p);
        stack.appendChild(desc);
      }

      if (caseItem.stats || caseItem.platforms?.length) {
        const metrics = document.createElement('div');
        metrics.className = 'case-section__metrics';

        if (caseItem.stats) {
          const stats = document.createElement('div');
          stats.className = 'case-section__stats';
          stats.textContent = caseItem.stats;
          metrics.appendChild(stats);
        }

        if (caseItem.platforms?.length) {
          const platforms = document.createElement('div');
          platforms.className = 'case-section__platforms';
          platforms.innerHTML = caseItem.platforms.map((p) => escapeHtml(p)).join('<br>');
          metrics.appendChild(platforms);
        }

        stack.appendChild(metrics);
      }

      mainCol.appendChild(stack);
    }

    if (hasTail) {
      const tail = document.createElement('div');
      tail.className = 'case-section__tail';

      if (SHOW_CASE_ACHIEVEMENTS && caseItem.achievements?.length) {
        const ul = document.createElement('ul');
        ul.className = 'case-section__achievements';
        caseItem.achievements.forEach((text) => {
          const li = document.createElement('li');
          li.textContent = text;
          ul.appendChild(li);
        });
        tail.appendChild(ul);
      }

      if (caseItem.links?.length) {
        const links = document.createElement('div');
        links.className = 'case-section__links';
        caseItem.links.forEach((link) => {
          const a = document.createElement('a');
          a.href = link.url;
          a.className = 'case-section__link';
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.innerHTML = `<span>${escapeHtml(link.label)}</span><span class="case-section__link-arrow">↙</span>`;
          links.appendChild(a);
        });
        tail.appendChild(links);
      }

      mainCol.appendChild(tail);
    }

    section.appendChild(mainCol);
  }

  const hasAchievements = caseItem.achievements?.length > 0;

  if (hasAchievements) {
    const moreLink = document.createElement('a');
    moreLink.href = '#';
    moreLink.className = 'case-section__more hero__link hero__link--pdf';
    moreLink.textContent = 'Подробнее';
    moreLink.setAttribute('aria-label', 'Показать достижения');
    section.appendChild(moreLink);
  }

  /* ---- Колонки 2–3, строки 3–5 — превью / галерея ---- */
  const rightContent = document.createElement('div');
  rightContent.className = 'case-section__right case-section__cell';

  const screens = document.createElement('div');
  screens.className = 'case-section__screens';
  if (hasAchievements) {
    screens.dataset.achievements = JSON.stringify(caseItem.achievements);
  }
  screens.setAttribute('role', hasAchievements ? 'button' : 'presentation');
  screens.setAttribute('tabindex', hasAchievements ? 0 : -1);
  screens.setAttribute('aria-label', hasAchievements ? 'Показать достижения' : '');

  const desktopSrc = caseItem.preview || caseItem.gallery?.[0] || '';
  const mobileSrc = caseItem.previewMobile;
  const imgAlt = `Скриншот проекта ${caseItem.projectNames?.[0] || caseItem.title || 'Проект'}`;

  function bindScreensImgLoad(img) {
    img.className = 'case-section__screens-image';
    img.alt = imgAlt;
    img.loading = 'lazy';
    img.addEventListener('load', function () {
      const isLandscape = this.naturalWidth >= this.naturalHeight;
      this.classList.add(isLandscape ? 'img--landscape' : 'img--portrait');
    });
  }

  if (mobileSrc && desktopSrc) {
    const picture = document.createElement('picture');
    const source = document.createElement('source');
    source.media = '(max-width: 799px)';
    source.srcset = mobileSrc;
    source.type = 'image/webp';
    const img = document.createElement('img');
    img.src = desktopSrc;
    bindScreensImgLoad(img);
    picture.appendChild(source);
    picture.appendChild(img);
    screens.appendChild(picture);
  } else if (desktopSrc) {
    const img = document.createElement('img');
    img.src = desktopSrc;
    bindScreensImgLoad(img);
    screens.appendChild(img);
  }

  rightContent.appendChild(screens);
  section.appendChild(rightContent);

  return section;
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
    cases.forEach((c) => {
      const section = renderCaseSection(c);
      container.appendChild(section);
    });
  } else {
    initScreensImageHandlers(container);
  }
}
