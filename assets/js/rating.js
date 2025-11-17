'use strict';

(function() {
  const STORAGE_KEY = 'testimonialsSectionRating';

  function $(sel, root = document) { return root.querySelector(sel); }
  function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  function setAria(starButtons, value) {
    starButtons.forEach((btn, idx) => {
      btn.setAttribute('aria-pressed', (idx + 1) <= value ? 'true' : 'false');
    });
  }

  function paintStars(starButtons, value) {
    starButtons.forEach((btn, idx) => {
      if ((idx + 1) <= value) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    setAria(starButtons, value);
  }

  function updateSummary(value) {
    const valueEl = $('#yourRatingValue');
    const msgEl = $('#ratingMessage');
    if (!valueEl) return;

    if (value && Number(value) > 0) {
      valueEl.textContent = `${value}/5`;
      if (msgEl) msgEl.hidden = false;
    } else {
      valueEl.textContent = 'Not rated yet';
      if (msgEl) msgEl.hidden = true;
    }
  }

  function initRating() {
    const widget = $('#ratingWidget');
    if (!widget) return;

    const stars = $all('.stars .star', widget);
    if (!stars.length) return;

    let committed = Number(localStorage.getItem(STORAGE_KEY) || 0);
    let hoverValue = 0;

    paintStars(stars, committed);
    updateSummary(committed);

    function createConfetti() {
      widget.style.position = widget.style.position || 'relative';
      const colors = ['#FFB703', '#FFD166', '#FCA311', '#FFE08C', '#FFC300'];
      const pieces = 14;
      for (let i = 0; i < pieces; i++) {
        const el = document.createElement('span');
        el.className = 'confetti-piece';
        el.style.background = colors[i % colors.length];
        el.style.left = (widget.clientWidth/2 + (Math.random()*40-20)) + 'px';
        el.style.top = (0) + 'px';
        el.style.setProperty('--dx', (Math.random()*120-60) + 'px');
        el.style.setProperty('--dy', (40 + Math.random()*60) + 'px');
        el.style.setProperty('--rot', (120 + Math.random()*180) + 'deg');
        widget.appendChild(el);
        setTimeout(() => el.remove(), 950);
      }
    }

    stars.forEach((btn) => {
      const value = Number(btn.dataset.value);

      btn.addEventListener('mouseenter', () => {
        hoverValue = value;
        paintStars(stars, hoverValue);
      });

      btn.addEventListener('focus', () => {
        hoverValue = value;
        paintStars(stars, hoverValue);
      });

      btn.addEventListener('mouseleave', () => {
        hoverValue = 0;
        paintStars(stars, committed);
      });

      btn.addEventListener('blur', () => {
        hoverValue = 0;
        paintStars(stars, committed);
      });

      btn.addEventListener('click', () => {
        committed = value;
        localStorage.setItem(STORAGE_KEY, String(committed));
        paintStars(stars, committed);
        updateSummary(committed);
        btn.classList.add('pop');
        setTimeout(() => btn.classList.remove('pop'), 300);
        createConfetti();
      });

      btn.addEventListener('keydown', (e) => {
        // Support arrow navigation inside radiogroup
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          const next = Math.min(committed + 1, 5);
          committed = next;
          localStorage.setItem(STORAGE_KEY, String(committed));
          paintStars(stars, committed);
          updateSummary(committed);
          stars[committed - 1].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          const prev = Math.max(committed - 1, 1);
          committed = prev;
          localStorage.setItem(STORAGE_KEY, String(committed));
          paintStars(stars, committed);
          updateSummary(committed);
          stars[committed - 1].focus();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRating);
  } else {
    initRating();
  }

  window.__emtaRatingReady = true;
  document.addEventListener('emta:rating-refresh', initRating);
})();
