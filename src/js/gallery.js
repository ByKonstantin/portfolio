let gallery = null;
let track = null;

function openGallery(images) {
  if (!gallery || !track) return;
  if (!Array.isArray(images) || images.length === 0) return;

  track.innerHTML = '';

  images.forEach((src) => {
    const slide = document.createElement('div');
    slide.className = 'gallery__slide';

    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.loading = 'lazy';
    img.addEventListener('load', function () {
      const isLandscape = this.naturalWidth >= this.naturalHeight;
      this.classList.add(isLandscape ? 'img--landscape' : 'img--portrait');
    });

    slide.appendChild(img);
    track.appendChild(slide);
  });

  gallery.setAttribute('aria-hidden', 'false');
  gallery.removeAttribute('hidden');
  document.body.classList.add('gallery-open');

  gallery.querySelector('.gallery__close')?.focus();
}

function closeGallery() {
  if (!gallery) return;

  gallery.setAttribute('aria-hidden', 'true');
  gallery.setAttribute('hidden', '');
  document.body.classList.remove('gallery-open');
}

export function initGallery() {
  gallery = document.querySelector('.gallery');
  track = document.querySelector('.gallery__track');
  if (!gallery || !track) {
    if (!track && gallery) console.warn('Gallery: .gallery__track not found');
    return;
  }

  gallery.querySelector('.gallery__close')?.addEventListener('click', closeGallery);

  gallery.addEventListener('click', (e) => {
    if (e.target === gallery) closeGallery();
  });

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.case-section__screens');
    if (!trigger) return;

    const imagesAttr = trigger.dataset?.gallery ?? trigger.closest('.case-section')?.dataset?.gallery;
    if (!imagesAttr) return;

    try {
      const images = JSON.parse(imagesAttr);
      openGallery(images);
    } catch {
      console.warn('Gallery: invalid data-gallery JSON', imagesAttr);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (gallery?.getAttribute('aria-hidden') === 'false' && e.key === 'Escape') {
      closeGallery();
      return;
    }
    const trigger = document.activeElement?.closest('.case-section__screens');
    if (trigger && (e.key === 'Enter' || e.key === ' ') && trigger.dataset?.gallery) {
      e.preventDefault();
      try {
        openGallery(JSON.parse(trigger.dataset.gallery));
      } catch {
        console.warn('Gallery: invalid data-gallery JSON', trigger.dataset.gallery);
      }
    }
  });
}
