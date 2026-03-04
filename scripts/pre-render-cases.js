/**
 * Pre-render cases HTML for SEO. Generates the same structure as cases-render.js
 * so that search engines see the content in the initial HTML.
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderCaseSection(caseItem, allCases, isFirst) {
  const typeClass = caseItem.type === 'b' ? ' case-section--alt' : '';
  let html = `<section id="${escapeHtml(caseItem.id)}" class="case-section${typeClass}">`;

  if (isFirst) {
    html += '<div class="case-section__nav-wrapper case-section__cell case-section__cell--r1-c1 case-section__cell--text">';
    html += '<nav class="case-section__nav case-nav case-section__cell--text" aria-label="Навигация по кейсам">';
    allCases.forEach((c) => {
      if (!c.navLabel) return;
      html += `<a href="#${escapeHtml(c.id)}" class="case-nav__link">${escapeHtml(c.navLabel)}</a>`;
    });
    html += '</nav></div>';
  } else {
    html += '<div class="case-section__cell case-section__cell--r1-c1" aria-hidden="true"></div>';
  }

  if (caseItem.stats || caseItem.statsPeriod) {
    const statsContent = [caseItem.stats, caseItem.statsPeriod].filter(Boolean).map(escapeHtml).join('<br>');
    html += `<div class="case-section__stats case-section__cell case-section__cell--r1-c2 case-section__cell--text">${statsContent}</div>`;
  }

  if (caseItem.platforms?.length) {
    const platformsContent = caseItem.platforms.map((p) => escapeHtml(p)).join('<br>');
    html += `<div class="case-section__platforms case-section__cell case-section__cell--r1-c3 case-section__cell--text">${platformsContent}</div>`;
  }

  if (caseItem.projectNames?.length) {
    const namesContent = caseItem.projectNames.map((n) => escapeHtml(n)).join('<br>');
    html += `<div class="case-section__project-names case-section__cell case-section__cell--r2-c1 case-section__cell--text">${namesContent}</div>`;
  } else if (caseItem.title) {
    html += `<h2 class="case-section__title case-section__cell case-section__cell--r2-c1 case-section__cell--text">${escapeHtml(caseItem.title)}</h2>`;
  }

  if (caseItem.description) {
    html += `<div class="case-section__description case-section__cell case-section__cell--r2-c2 case-section__cell--text"><p>${escapeHtml(caseItem.description)}</p></div>`;
  }

  if (caseItem.links?.length) {
    html += '<div class="case-section__links case-section__cell case-section__cell--r3-c1 case-section__cell--text">';
    caseItem.links.forEach((link) => {
      html += `<a href="${escapeHtml(link.url)}" class="case-section__link" target="_blank" rel="noopener noreferrer"><span>${escapeHtml(link.label)}</span><span class="case-section__link-arrow">↙</span></a>`;
    });
    html += '</div>';
  }

  if (caseItem.achievements?.length) {
    html += '<ul class="case-section__achievements case-section__cell case-section__cell--r3-c2 case-section__cell--text">';
    caseItem.achievements.forEach((text) => {
      html += `<li>${escapeHtml(text)}</li>`;
    });
    html += '</ul>';
  }

  const imgSrc = caseItem.preview || caseItem.gallery?.[0] || '';
  const projectName = caseItem.projectNames?.[0] || caseItem.title || 'Проект';
  const imgAlt = `Скриншот проекта ${escapeHtml(projectName)}`;
  const galleryAttr = caseItem.gallery?.length ? ` data-gallery="${escapeHtml(JSON.stringify(caseItem.gallery))}"` : '';
  const role = caseItem.gallery?.length ? 'button' : 'presentation';
  const tabindex = caseItem.gallery?.length ? '0' : '-1';
  const ariaLabel = caseItem.gallery?.length ? 'Открыть галерею' : '';

  html += '<div class="case-section__right case-section__cell case-section__cell--r2-c3">';
  html += '<div class="case-section__ascii-bar" aria-hidden="true"></div>';
  html += '<div class="case-section__right-content-inner">';
  html += '<div class="case-section__ascii-bar-h" aria-hidden="true"></div>';
  html += `<div class="case-section__screens"${galleryAttr} role="${role}" tabindex="${tabindex}" aria-label="${escapeHtml(ariaLabel)}">`;
  html += `<img class="case-section__screens-image" src="${escapeHtml(imgSrc)}" alt="${imgAlt}" loading="lazy">`;
  html += '</div></div></div>';

  html += '</section>';
  return html;
}

export function generateCasesHtml() {
  const casesPath = resolve(__dirname, '../src/data/cases.json');
  const casesData = JSON.parse(readFileSync(casesPath, 'utf-8'));
  const cases = Array.isArray(casesData) ? casesData : [];

  return cases.map((c, i) => renderCaseSection(c, cases, i === 0)).join('\n');
}
