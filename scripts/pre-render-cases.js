/**
 * Pre-render cases HTML for SEO. Generates the same structure as cases-render.js
 * so that search engines see the content in the initial HTML.
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** false — не выводим achievements (данные остаются в cases.json). Платформы всегда по полю platforms. */
const SHOW_CASE_ACHIEVEMENTS = false;

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderCaseSection(caseItem) {
  const typeClass = caseItem.type === 'b' ? ' case-section--alt' : '';
  let html = `<section id="${escapeHtml(caseItem.id)}" class="case-section${typeClass}">`;

  if (caseItem.projectNames?.length || caseItem.title || caseItem.statsPeriod) {
    html += '<div class="case-section__lead case-section__cell case-section__cell--text">';
    if (caseItem.projectNames?.length) {
      const namesContent = caseItem.projectNames.map((n) => escapeHtml(n)).join('<br>');
      html += `<div class="case-section__project-names">${namesContent}</div>`;
    } else if (caseItem.title) {
      html += `<h2 class="case-section__title">${escapeHtml(caseItem.title)}</h2>`;
    }
    if (caseItem.statsPeriod) {
      html += `<div class="case-section__stats-period">${escapeHtml(caseItem.statsPeriod)}</div>`;
    }
    html += '</div>';
  }

  const hasStack = Boolean(
    caseItem.description || caseItem.stats || caseItem.platforms?.length
  );
  const hasTail = Boolean(
    (SHOW_CASE_ACHIEVEMENTS && caseItem.achievements?.length) || caseItem.links?.length
  );

  if (hasStack || hasTail) {
    html += '<div class="case-section__main case-section__cell case-section__cell--text">';
    if (hasStack) {
      html += '<div class="case-section__stack">';
      if (caseItem.description) {
        html += `<div class="case-section__description"><p>${escapeHtml(caseItem.description)}</p></div>`;
      }
      if (caseItem.stats || caseItem.platforms?.length) {
        html += '<div class="case-section__metrics">';
        if (caseItem.stats) {
          html += `<div class="case-section__stats">${escapeHtml(caseItem.stats)}</div>`;
        }
        if (caseItem.platforms?.length) {
          const platformsContent = caseItem.platforms.map((p) => escapeHtml(p)).join('<br>');
          html += `<div class="case-section__platforms">${platformsContent}</div>`;
        }
        html += '</div>';
      }
      html += '</div>';
    }
    if (hasTail) {
      html += '<div class="case-section__tail">';
      if (SHOW_CASE_ACHIEVEMENTS && caseItem.achievements?.length) {
        html += '<ul class="case-section__achievements">';
        caseItem.achievements.forEach((text) => {
          html += `<li>${escapeHtml(text)}</li>`;
        });
        html += '</ul>';
      }
      if (caseItem.links?.length) {
        html += '<div class="case-section__links">';
        caseItem.links.forEach((link) => {
          html += `<a href="${escapeHtml(link.url)}" class="case-section__link" target="_blank" rel="noopener noreferrer"><span>${escapeHtml(link.label)}</span><span class="case-section__link-arrow">↙</span></a>`;
        });
        html += '</div>';
      }
      html += '</div>';
    }
    html += '</div>';
  }

  const imgSrc = caseItem.preview || caseItem.gallery?.[0] || '';
  const mobSrc = caseItem.previewMobile;
  const projectName = caseItem.projectNames?.[0] || caseItem.title || 'Проект';
  const imgAlt = `Скриншот проекта ${escapeHtml(projectName)}`;
  const hasAchievements = caseItem.achievements?.length > 0;
  const achievementsAttr = hasAchievements
    ? ` data-achievements="${escapeHtml(JSON.stringify(caseItem.achievements))}"`
    : '';
  const role = hasAchievements ? 'button' : 'presentation';
  const tabindex = hasAchievements ? '0' : '-1';
  const ariaLabel = hasAchievements ? 'Показать достижения' : '';

  if (hasAchievements) {
    html +=
      '<a href="#" class="case-section__more hero__link hero__link--pdf" aria-label="Показать достижения">Подробнее</a>';
  }

  html += '<div class="case-section__right case-section__cell">';
  html += `<div class="case-section__screens"${achievementsAttr} role="${role}" tabindex="${tabindex}" aria-label="${escapeHtml(ariaLabel)}">`;
  if (mobSrc && imgSrc) {
    html += '<picture>';
    html += `<source media="(max-width: 799px)" srcset="${escapeHtml(mobSrc)}" type="image/webp">`;
    html += `<img class="case-section__screens-image" src="${escapeHtml(imgSrc)}" alt="${imgAlt}" loading="lazy">`;
    html += '</picture>';
  } else if (imgSrc) {
    html += `<img class="case-section__screens-image" src="${escapeHtml(imgSrc)}" alt="${imgAlt}" loading="lazy">`;
  }
  html += '</div></div>';

  html += '</section>';
  return html;
}

export function generateCasesHtml() {
  const casesPath = resolve(__dirname, '../src/data/cases.json');
  const casesData = JSON.parse(readFileSync(casesPath, 'utf-8'));
  const cases = Array.isArray(casesData) ? casesData : [];

  return cases.map((c) => renderCaseSection(c)).join('\n');
}
