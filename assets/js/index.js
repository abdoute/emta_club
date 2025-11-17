/**
 * Index Page JavaScript
 * Handles animations and interactive elements
 */

(function() {
  'use strict';

  // Animate statistics counter
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target + '+';
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start) + '+';
      }
    }, 16);
  }

  // Initialize counter animation when in view
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (!counters.length) return;

    function startCounterAnimation(counter) {
      const target = parseInt(counter.getAttribute('data-target'));
      if (!isNaN(target) && target > 0 && !counter.classList.contains('counted')) {
        counter.classList.add('counted');
        animateCounter(counter, target);
      }
    }

    // Check if counters are visible on page load
    function checkCounters() {
      counters.forEach(counter => {
        const rect = counter.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          startCounterAnimation(counter);
        }
      });
    }

    // Try immediately
    checkCounters();

    // Also use IntersectionObserver as backup
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounterAnimation(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px'
    });

    counters.forEach(counter => {
      if (!counter.classList.contains('counted')) {
        observer.observe(counter);
      }
    });

    // Fallback: start after a short delay if still not started
    setTimeout(() => {
      counters.forEach(counter => {
        if (!counter.classList.contains('counted')) {
          startCounterAnimation(counter);
        }
      });
    }, 500);
  }

  // Smooth scroll for scroll indicator
  function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;

    scrollIndicator.addEventListener('click', () => {
      const domainsSection = document.querySelector('.domains-showcase');
      if (domainsSection) {
        domainsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });

    // Hide scroll indicator when scrolled
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
      }
      lastScrollY = window.scrollY;
    }, { passive: true });
  }

  // Initialize on DOM ready
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initCounters();
        initScrollIndicator();
      });
    } else {
      initCounters();
      initScrollIndicator();
    }
  }

  init();
})();

