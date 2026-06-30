/* =================================================================
   John Smith — Independent Fire Risk Assessor
   Vanilla JavaScript, modular IIFE-per-feature.
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initSmoothScroll();
  initScrollReveal();
  initAccordion();
  initLightbox();
  initStickyCta();
  initBackToTop();
  initContactForm();
  setFooterYear();
});

/* ---------- Mobile navigation menu ---------- */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('primaryNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a nav link is clicked (mobile)
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Smooth scrolling for in-page anchor links ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
}

/* ---------- Scroll-triggered reveal animations ---------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ---------- FAQ accordion (single panel open at a time) ---------- */
function initAccordion() {
  const accordion = document.getElementById('accordion');
  if (!accordion) return;

  const triggers = accordion.querySelectorAll('.accordion__trigger');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close all panels first
      triggers.forEach((otherTrigger) => {
        otherTrigger.setAttribute('aria-expanded', 'false');
        const otherPanel = document.getElementById(otherTrigger.getAttribute('aria-controls'));
        if (otherPanel) otherPanel.hidden = true;
      });

      // Re-open the clicked one if it was previously closed
      if (!isOpen && panel) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
      }
    });
  });
}

/* ---------- Lightbox for report gallery images ---------- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const overlay = document.getElementById('lightboxOverlay');
  const closeBtn = document.getElementById('lightboxClose');
  const imageEl = document.getElementById('lightboxImage');
  const captionEl = document.getElementById('lightboxCaption');
  const galleryItems = document.querySelectorAll('.gallery__item');

  if (!lightbox || !galleryItems.length) return;

  let lastFocusedEl = null;

  function openLightbox(caption) {
    lastFocusedEl = document.activeElement;
    imageEl.textContent = caption;
    captionEl.textContent = caption;
    lightbox.hidden = false;
    closeBtn.focus();
    document.addEventListener('keydown', handleKeydown);
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.removeEventListener('keydown', handleKeydown);
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') closeLightbox();
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      openLightbox(item.dataset.caption || '');
    });
  });

  overlay.addEventListener('click', closeLightbox);
  closeBtn.addEventListener('click', closeLightbox);
}

/* ---------- Sticky mobile "Request a Quote" CTA ---------- */
function initStickyCta() {
  const cta = document.getElementById('stickyCta');
  const hero = document.getElementById('hero');
  if (!cta || !hero) return;

  function toggleCta() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const shouldShow = heroBottom < 0 && window.innerWidth <= 700;
    cta.classList.toggle('is-visible', shouldShow);
  }

  window.addEventListener('scroll', toggleCta, { passive: true });
  window.addEventListener('resize', toggleCta);
  toggleCta();
}

/* ---------- Back-to-top button ---------- */
function initBackToTop() {
  const button = document.getElementById('backToTop');
  if (!button) return;

  function toggleButton() {
    button.hidden = window.scrollY < 500;
  }

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', toggleButton, { passive: true });
  toggleButton();
}

/* ---------- Contact form validation ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successMessage = document.getElementById('formSuccess');

  const validators = {
    name: (value) => value.trim().length > 0 || 'Please enter your name.',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || 'Please enter a valid email address.',
    telephone: (value) => value.trim().length >= 7 || 'Please enter a valid telephone number.',
    propertyType: (value) => value.trim().length > 0 || 'Please select a property type.',
    message: (value) => value.trim().length > 0 || 'Please enter a message.',
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let isFormValid = true;

    Object.keys(validators).forEach((fieldName) => {
      const field = form.elements.namedItem(fieldName);
      const errorEl = document.getElementById(`error-${fieldName}`);
      const fieldWrap = field.closest('.form-field');
      const result = validators[fieldName](field.value);

      if (result === true) {
        fieldWrap.classList.remove('has-error');
        errorEl.textContent = '';
      } else {
        isFormValid = false;
        fieldWrap.classList.add('has-error');
        errorEl.textContent = result;
      }
    });

    if (isFormValid) {
      successMessage.hidden = false;
      form.reset();
      successMessage.focus?.();
    } else {
      successMessage.hidden = true;
    }
  });
}

/* ---------- Footer copyright year ---------- */
function setFooterYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}
