/**
 * Мерцание символов для contact__ascii-frame.
 */

import { CONTACT_ASCII_FRAMES } from '../data/contact-ascii-frames.js';

const FLICKER_INTERVAL = 150;

const FLICKER_CHARS = ['─', '-', '=', '_', '~', '│', '|', 'I', '#', '.', ',', ':', ';', '+', '[', ']', "'", '"', '`', '·', ' ', '\\', '/'];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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
  initContactAsciiFlicker();
}
