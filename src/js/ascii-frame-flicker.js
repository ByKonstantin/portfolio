/**
 * ASCII-рамка с мерцанием для блока screens.
 * Принимает контейнер, рисует рамку по периметру, запускает мерцание символов.
 * Также мерцание символов для contact__ascii-frame.
 */

import { CONTACT_ASCII_FRAMES } from '../data/contact-ascii-frames.js';

const H_CHARS = ['─', '-', '=', '_', '~'];
const V_CHARS = ['│', '|', 'I', '#'];
const CORNER_CHARS = {
  tl: ['┌', '+', '['],
  tr: ['┐', ']', '+'],
  bl: ['└', '+', '['],
  br: ['┘', ']', '+'],
};

const FLICKER_INTERVAL = 150;

/* Символы для мерцания в contact ASCII (как у case-section bars + типичные для ASCII-арта) */
const FLICKER_CHARS = ['─', '-', '=', '_', '~', '│', '|', 'I', '#', '.', ',', ':', ';', '+', '[', ']', "'", '"', '`', '·', ' ', '\\', '/'];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildFrame(cols, rows) {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const isTop = r === 0;
      const isBottom = r === rows - 1;
      const isLeft = c === 0;
      const isRight = c === cols - 1;
      let chars;
      if (isTop && isLeft) chars = CORNER_CHARS.tl;
      else if (isTop && isRight) chars = CORNER_CHARS.tr;
      else if (isBottom && isLeft) chars = CORNER_CHARS.bl;
      else if (isBottom && isRight) chars = CORNER_CHARS.br;
      else if (isTop || isBottom) chars = H_CHARS;
      else if (isLeft || isRight) chars = V_CHARS;
      else chars = [' '];
      row.push({ chars, current: chars[0] });
    }
    grid.push(row);
  }
  return grid;
}

function gridToText(grid) {
  return grid.map((row) => row.map((cell) => cell.current).join('')).join('\n');
}

function initContactAsciiFlicker() {
  const frame = document.querySelector('.contact__ascii-frame');
  const container = document.querySelector('.contact__ascii-art');
  if (!frame || !container || !CONTACT_ASCII_FRAMES?.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let baseContent = CONTACT_ASCII_FRAMES[0];
  const flickerableIndices = [];

  function updateFlickerableIndices(str) {
    flickerableIndices.length = 0;
    for (let i = 0; i < str.length; i++) {
      if (FLICKER_CHARS.includes(str[i])) {
        flickerableIndices.push(i);
      }
    }
  }
  updateFlickerableIndices(baseContent);

  const intervalId = setInterval(() => {
    if (!document.body.contains(frame)) {
      clearInterval(intervalId);
      return;
    }
    if (container.dataset.transitioning === 'true') return;

    const current = frame.textContent;
    const matchIdx = CONTACT_ASCII_FRAMES.findIndex((f) => f === current);
    if (matchIdx >= 0) {
      baseContent = current;
      updateFlickerableIndices(baseContent);
    }

    if (flickerableIndices.length === 0) return;

    const arr = [...baseContent];
    const count = Math.max(1, Math.floor(flickerableIndices.length * 0.1));
    for (let i = 0; i < count; i++) {
      const idx = flickerableIndices[Math.floor(Math.random() * flickerableIndices.length)];
      arr[idx] = pickRandom(FLICKER_CHARS);
    }
    frame.textContent = arr.join('');
  }, FLICKER_INTERVAL);
}

export function initAsciiFrameFlicker() {
  const containers = document.querySelectorAll('.case-section__ascii-bar, .case-section__ascii-bar-h');
  if (!containers.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  containers.forEach((container) => {
    const parent = container.closest('.case-section__right');
    if (!parent) return;

    const isHorizontal = container.classList.contains('case-section__ascii-bar-h');
    const el = document.createElement('pre');
    el.className = isHorizontal ? 'case-section__ascii-bar-h-inner' : 'case-section__ascii-bar-inner';
    el.setAttribute('aria-hidden', 'true');
    container.appendChild(el);

    const CHAR_W = 8;
    const CHAR_H = 14;
    let intervalId = null;

    function update() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }

      const rect = container.getBoundingClientRect();
      const isVerticalBar = container.classList.contains('case-section__ascii-bar');
      const isHorizontalBar = container.classList.contains('case-section__ascii-bar-h');
      const minCols = isVerticalBar ? 2 : isHorizontalBar ? 10 : 10;
      const minRows = isHorizontalBar ? 2 : 6;
      const overflowFactor = 2.5;
      const cols = Math.max(minCols, Math.floor((rect.width / CHAR_W) * overflowFactor));
      const rows = Math.max(minRows, Math.floor((rect.height / CHAR_H) * overflowFactor));

      const grid = buildFrame(cols, rows);
      el.textContent = gridToText(grid);
      const baseCols = Math.max(1, Math.floor(rect.width / CHAR_W));
      const baseRows = Math.max(1, Math.floor(rect.height / CHAR_H));
      const fontSize = isVerticalBar
        ? Math.min(CHAR_W, rect.width / baseCols)
        : Math.min(CHAR_H, rect.height / baseRows);
      el.style.fontSize = `${fontSize}px`;
      el.style.lineHeight = 1;

      if (prefersReducedMotion) return;

      const flickerPositions = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c].chars.length > 1) {
            flickerPositions.push([r, c]);
          }
        }
      }

      intervalId = setInterval(() => {
        if (!document.body.contains(container)) {
          clearInterval(intervalId);
          return;
        }
        const count = Math.max(1, Math.floor(flickerPositions.length * 0.1));
        for (let i = 0; i < count; i++) {
          const idx = Math.floor(Math.random() * flickerPositions.length);
          const [r, c] = flickerPositions[idx];
          grid[r][c].current = pickRandom(grid[r][c].chars);
        }
        el.textContent = gridToText(grid);
      }, FLICKER_INTERVAL);
    }

    const ro = new ResizeObserver(update);
    ro.observe(container);
    update();
  });

  initContactAsciiFlicker();
}
