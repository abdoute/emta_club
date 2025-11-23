/**
 * Main JavaScript for E-MTA Club Website
 * Handles navbar scroll effect and active link highlighting
 */

(function () {
  'use strict';

  // Configurable API base for production without local server
  const API_BASE = (typeof window !== 'undefined' && window.API_BASE) || (function () { try { return localStorage.getItem('emta_api_base'); } catch { return null; } })() || 'http://127.0.0.1:5000';
  const DASHBOARD_ENABLED = false;

  // ===== Navbar Scroll Effect =====
  function initNavbarScroll() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
      navbar.classList.toggle("scrolled", window.scrollY > 50);
      ticking = false;
    }

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }, { passive: true });
  }

  // ===== Auth Controls (Login / Logout / Dashboard) =====
  function initAuthControls() {
    const TOKEN_KEY = 'emta_token';
    let token = null;
    try { token = localStorage.getItem(TOKEN_KEY); } catch { token = null; }

    // Find navbar UL list
    const header = document.querySelector('header');
    if (!header) return;
    const ul = header.querySelector('nav ul');
    if (!ul) return;

    // Helper: find LI by href
    const findLiByHref = (href) => Array.from(ul.querySelectorAll('li > a[href]')).find(a => a.getAttribute('href') === href)?.closest('li') || null;
    const ensureLiLink = (href, text, id) => {
      let li = id ? ul.querySelector(`li#${id}`) : findLiByHref(href);
      if (!li) {
        li = document.createElement('li');
        if (id) li.id = id;
        const a = document.createElement('a');
        a.href = href; a.textContent = text;
        li.appendChild(a);
        ul.appendChild(li);
      } else {
        const a = li.querySelector('a'); if (a) { a.href = href; a.textContent = text; }
      }
      return li;
    };
    const removeLi = (li) => { if (li && li.parentElement === ul) ul.removeChild(li); };

    const dashLi = findLiByHref('dashboard.html');
    if (!DASHBOARD_ENABLED && dashLi) removeLi(dashLi);
    const adminLi = findLiByHref('admin.html');
    const loginLi = ul.querySelector('li#auth-login');
    const joinLi = ul.querySelector('li#auth-join');
    const logoutLi = ul.querySelector('li#auth-logout');

    if (token) {
      // Show Dashboard, remove Login/Join, add Logout
      if (DASHBOARD_ENABLED && !dashLi) ensureLiLink('dashboard.html', 'Dashboard');
      if (loginLi) removeLi(loginLi);
      if (joinLi) removeLi(joinLi);
      // Add Logout button as li
      if (!logoutLi) {
        const li = document.createElement('li');
        li.id = 'auth-logout';
        const btn = document.createElement('button');
        btn.textContent = 'Logout';
        btn.className = 'btn';
        btn.style.padding = '8px 12px';
        btn.style.borderRadius = '10px';
        btn.style.border = '1px solid var(--border-color)';
        btn.style.background = 'transparent';
        btn.style.color = 'var(--text-secondary)';
        btn.addEventListener('click', () => {
          try { localStorage.removeItem(TOKEN_KEY); } catch { }
          window.location.href = 'login.html';
        });
        li.appendChild(btn);
        ul.appendChild(li);
      }

      // If token exists, check if user is admin to show Admin link
      try {
        fetch(`${API_BASE}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            const isAdmin = !!(data && data.user && data.user.is_admin);
            if (isAdmin) {
              if (!adminLi) ensureLiLink('admin.html', 'Admin');
              // Hide Dashboard link on admin page only
              const onAdminPage = /(^|\/)admin\.html$/i.test(window.location.pathname);
              if (onAdminPage && findLiByHref('dashboard.html')) {
                const dli = findLiByHref('dashboard.html');
                if (dli) removeLi(dli);
              }
            } else {
              if (adminLi) removeLi(adminLi);
            }
          })
          .catch(() => { /* ignore */ });
      } catch (_) { /* ignore */ }
    } else {
      // Hide Dashboard, show Login & Join, remove Logout
      if (dashLi) removeLi(dashLi);
      if (adminLi) removeLi(adminLi);
      ensureLiLink('login.html', 'Login', 'auth-login');
      if (logoutLi) removeLi(logoutLi);
    }
  }

  // ===== Global Footer Rating Widget Injection =====
  function initGlobalRatingWidget() {
    const footerRight = document.querySelector('footer .footer-right');
    if (!footerRight) return;

    // Avoid duplicates if already present in page
    if (footerRight.querySelector('.rating-widget')) return;

    const widget = document.createElement('div');
    widget.className = 'rating-widget';
    widget.id = 'ratingWidget';
    widget.setAttribute('aria-label', 'Rate E-MTA Club');
    widget.setAttribute('data-aos', 'fade-up');
    widget.innerHTML = `
      <p class="rating-title" data-key="rating_title">Rate E-MTA Club</p>
      <div class="stars" role="radiogroup" aria-label="Rate 1 to 5 stars">
        <button class="star" data-value="1" aria-label="1 star"><i class="fa-solid fa-star"></i></button>
        <button class="star" data-value="2" aria-label="2 stars"><i class="fa-solid fa-star"></i></button>
        <button class="star" data-value="3" aria-label="3 stars"><i class="fa-solid fa-star"></i></button>
        <button class="star" data-value="4" aria-label="4 stars"><i class="fa-solid fa-star"></i></button>
        <button class="star" data-value="5" aria-label="5 stars"><i class="fa-solid fa-star"></i></button>
      </div>
      <div class="rating-summary">
        <span id="yourRatingLabel" data-key="rating_label">Your rating:</span>
        <span id="yourRatingValue" data-key="rating_not_rated">Not rated yet</span>
      </div>
      <div class="rating-message" id="ratingMessage" data-key="rating_thanks" hidden>Thanks for your rating!</div>
    `;
    footerRight.prepend(widget);

    // Ensure rating logic is available on all pages
    try {
      if (!window.__emtaRatingReady) {
        const script = document.createElement('script');
        script.src = 'assets/js/rating.js';
        script.onload = () => {
          document.dispatchEvent(new CustomEvent('emta:rating-refresh'));
        };
        document.body.appendChild(script);
      } else {
        document.dispatchEvent(new CustomEvent('emta:rating-refresh'));
      }
    } catch (_) { /* no-op */ }
  }

  // ===== Lazy-load images (non-critical) =====
  function initLazyLoadImages() {
    const imgs = document.querySelectorAll('img');
    imgs.forEach(img => {
      // Skip likely critical: header logo
      if (img.closest('header .logo')) return;
      // Respect existing attributes
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    });
  }

  // ===== Active Link Highlighting =====
  function setActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a[href]');

    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      if (currentPath.endsWith(linkPath) ||
        (currentPath.endsWith('/') && linkPath === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // ===== Language Switcher =====
  function initLanguageSwitcher() {
    const enBtn = document.getElementById('en-btn');
    const arBtn = document.getElementById('ar-btn');

    if (!enBtn || !arBtn) return;

    enBtn.addEventListener('click', () => {
      enBtn.classList.add('active');
      arBtn.classList.remove('active');
      // TODO: Implement language switching logic
    });

    arBtn.addEventListener('click', () => {
      arBtn.classList.add('active');
      enBtn.classList.remove('active');
      // TODO: Implement language switching logic
    });
  }

  // ===== Scroll Animation for Sections / Elements =====
  function initScrollAnimations() {
    // Generic section reveal (fallback)
    const sections = document.querySelectorAll('section:not(.hero):not(.about-hero)');

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    if (sections.length) {
      const secObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, observerOptions);

      sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        secObserver.observe(section);
      });
    }

    // Fine‑grained scroll reveal like About page: use [data-scroll]
    const scrollNodes = document.querySelectorAll('[data-scroll]');
    if (!scrollNodes.length) return;

    const nodeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          nodeObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    scrollNodes.forEach(el => {
      // Initial hidden state; CSS will define transition details
      el.classList.remove('is-visible');
      nodeObserver.observe(el);
    });
  }

  // ===== Global Search Overlay =====
  function initGlobalSearch() {
    // Avoid duplicates
    if (document.getElementById('globalSearchOverlay')) return;

    // Create search button (in navbar right side)
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const searchBtn = document.createElement('button');
    searchBtn.setAttribute('aria-label', 'Search');
    searchBtn.className = 'nav-search-btn';
    searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';

    // Insert search button next to logo
    const logo = document.querySelector('.logo');
    if (logo) {
      // Create wrapper if not exists
      let wrapper = logo.parentElement.querySelector('.logo-group');
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'logo-group';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '15px';
        logo.parentElement.insertBefore(wrapper, logo);
        wrapper.appendChild(logo);
      }
      wrapper.appendChild(searchBtn);
    } else {
      // Fallback
      const langSwitch = document.querySelector('.lang-switch');
      if (langSwitch) {
        langSwitch.parentElement.insertBefore(searchBtn, langSwitch);
      } else {
        navbar.appendChild(searchBtn);
      }
    }

    // Inject minimal styles to reuse theme vars
    if (!document.getElementById('global-search-styles')) {
      const style = document.createElement('style');
      style.id = 'global-search-styles';
      style.textContent = `
        .nav-search-btn{background:transparent;border:1px solid var(--border-color);color:var(--text-secondary);padding:8px 12px;border-radius:10px;cursor:pointer;transition:all var(--transition)}
        .nav-search-btn:hover{border-color:var(--primary-color);color:var(--text-primary);transform:translateY(-2px)}
        .search-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(6px);display:none;align-items:flex-start;justify-content:center;z-index:11000;padding-top:120px}
        .search-overlay.open{display:flex}
        .search-panel{width:min(900px,92vw);background:linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));border:1px solid var(--border-color);border-radius:16px;box-shadow:0 15px 40px rgba(0,0,0,.35);overflow:hidden}
        .search-head{display:flex;align-items:center;gap:10px;padding:16px 18px;border-bottom:1px solid var(--border-color)}
        .search-input{flex:1;padding:12px 14px;border:1.5px solid rgba(255,255,255,0.1);border-radius:10px;background:rgba(255,255,255,0.06);color:var(--text-primary)}
        .search-input::placeholder{color:var(--text-muted)}
        .search-results{max-height:60vh;overflow:auto}
        .search-item{display:flex;gap:12px;padding:14px 18px;border-bottom:1px solid var(--border-color);text-decoration:none;color:var(--text-secondary);transition:all var(--transition)}
        .search-item:hover{background:rgba(255,255,255,0.04);color:var(--text-primary)}
        .search-item i{color:var(--primary-color);margin-top:3px}
        .search-title{font-weight:700;color:var(--text-primary)}
        .search-desc{font-size:.9rem;color:var(--text-secondary)}
        .search-empty{padding:20px 18px;color:var(--text-muted)}
        .search-close{margin-left:8px;background:transparent;border:none;color:var(--text-secondary);cursor:pointer}
      `;
      document.head.appendChild(style);
    }

    // Overlay structure
    const overlay = document.createElement('div');
    overlay.id = 'globalSearchOverlay';
    overlay.className = 'search-overlay';
    overlay.innerHTML = `
      <div class="search-panel">
        <div class="search-head">
          <i class="fa-solid fa-magnifying-glass" style="color:var(--primary-color)"></i>
          <input id="globalSearchInput" class="search-input" type="text" placeholder="Search pages, posts, and resources..." aria-label="Search">
          <button class="search-close" aria-label="Close" title="Close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div id="globalSearchResults" class="search-results"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    const input = overlay.querySelector('#globalSearchInput');
    const results = overlay.querySelector('#globalSearchResults');
    const closeBtn = overlay.querySelector('.search-close');

    function openSearch() {
      overlay.classList.add('open');
      setTimeout(() => input.focus(), 50);
      renderResults('');
    }
    function closeSearch() {
      overlay.classList.remove('open');
      input.value = '';
    }
    searchBtn.addEventListener('click', openSearch);
    closeBtn.addEventListener('click', closeSearch);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSearch(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearch(); });

    // Expose controls globally for shortcuts
    window.emta = window.emta || {};
    window.emta.openSearch = openSearch;
    window.emta.closeSearch = closeSearch;

    // Simple content index
    const index = [
      { title: 'Home', desc: 'Landing page', icon: 'fa-house', href: 'index.html' },
      { title: 'About', desc: 'About E-MTA Club', icon: 'fa-users', href: 'about.html' },
      { title: 'Activities', desc: 'Workshops, projects, competitions', icon: 'fa-calendar-check', href: 'activities.html' },
      { title: 'Join Us', desc: 'Membership form', icon: 'fa-user-plus', href: 'join.html' },
      { title: 'Contact', desc: 'Get in touch', icon: 'fa-envelope', href: 'contact.html' },
      { title: 'Blog', desc: 'News and articles', icon: 'fa-newspaper', href: '404.html' },
      { title: 'Resources', desc: 'Guides, tools, links', icon: 'fa-folder-open', href: '404.html' },
      { title: 'Gallery', desc: 'Photos and videos', icon: 'fa-images', href: '404.html' }
    ];

    function renderResults(query) {
      const q = (query || '').toLowerCase().trim();
      const items = !q ? index : index.filter(it =>
        it.title.toLowerCase().includes(q) ||
        it.desc.toLowerCase().includes(q)
      );
      if (items.length === 0) {
        results.innerHTML = `<div class="search-empty">No results found.</div>`;
        return;
      }
      results.innerHTML = items.map(it => (
        `<a class="search-item" href="${it.href}">
           <i class="fa-solid ${it.icon}"></i>
           <div>
             <div class="search-title">${it.title}</div>
             <div class="search-desc">${it.desc}</div>
           </div>
         </a>`
      )).join('');
    }

    let debounceT;
    input.addEventListener('input', () => {
      clearTimeout(debounceT);
      debounceT = setTimeout(() => renderResults(input.value), 120);
    });
  }

  // ===== Navbar Dropdown (Activities) =====
  function initDropdownMenu() {
    const nav = document.querySelector('header nav ul');
    if (!nav) return;

    // Check if already added
    if (nav.querySelector('li.activities-dropdown')) return;

    // Find Activities link
    const activitiesLink = Array.from(nav.querySelectorAll('a[href]')).find(a => /activities\.html$/i.test(a.getAttribute('href')));
    if (!activitiesLink) return;

    const parentLi = activitiesLink.closest('li');
    if (!parentLi) return;
    parentLi.classList.add('activities-dropdown');
    parentLi.style.position = 'relative';

    // Build submenu
    const submenu = document.createElement('ul');
    submenu.className = 'submenu';
    submenu.innerHTML = `
      <li><a href="activities.html"><i class="fa-solid fa-calendar-check"></i> All Activities</a></li>
      <li><a href="404.html"><i class="fa-solid fa-images"></i> Gallery</a></li>
      <li><a href="404.html"><i class="fa-solid fa-newspaper"></i> Blog</a></li>
      <li><a href="404.html"><i class="fa-solid fa-folder-open"></i> Resources</a></li>
    `;
    parentLi.appendChild(submenu);
  }

  // ===== Buttons Ripple Effect =====
  function initButtonsRipple() {
    function addRipple(target, e) {
      const button = target;
      const rect = button.getBoundingClientRect();
      const circle = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      circle.className = 'ripple';
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = x + 'px';
      circle.style.top = y + 'px';
      button.querySelectorAll('.ripple').forEach(r => r.remove());
      button.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    }

    const selectors = ['.btn', '.cta-btn', '.join-btn', '.contact-submit-btn'];
    document.addEventListener('click', (e) => {
      const target = e.target.closest(selectors.join(','));
      if (target) addRipple(target, e);
    });
  }

  // ===== Scroll To Top Button =====
  function initScrollTop() {
    if (document.getElementById('scrollTopBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'scrollTopBtn';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(btn);

    function toggleBtn() {
      btn.classList.toggle('visible', window.scrollY > 300);
    }
    window.addEventListener('scroll', toggleBtn, { passive: true });
    toggleBtn();

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initSmoothScrollAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // ===== AOS (Animate On Scroll) Initialization =====
  function initAOS() {
    if (typeof AOS === 'undefined') return;
    const cfg = {
      duration: 800,
      once: true,
      offset: 100,
      delay: 0,
      easing: 'ease-out-cubic'
    };
    try {
      AOS.init(cfg);
      // Extra safety: refresh after full load and minor layout changes
      window.addEventListener('load', () => { try { AOS.refreshHard(); } catch { } });
      window.addEventListener('resize', () => { try { AOS.refresh(); } catch { } });
      document.addEventListener('readystatechange', () => { if (document.readyState === 'complete') { try { AOS.refresh(); } catch { } } });
    } catch (_) { /* no-op */ }
  }

  // Reveal AOS-marked elements if AOS is disabled/missing
  function ensureAOSVisibilityFallback() {
    const aosNodes = document.querySelectorAll('[data-aos]');
    if (!aosNodes.length) return;
    const hasAOS = typeof AOS !== 'undefined';
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!hasAOS || prefersReduced) {
      aosNodes.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  }

  // ===== Initialize on DOM Ready =====
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initNavbarScroll();
        setActiveLink();
        initLanguageSwitcher();
        initScrollAnimations();
        initAOS();
        initGlobalSearch();
        initDropdownMenu();
        initAuthControls();
        initButtonsRipple();
        initScrollTop();
        initSmoothScrollAnchors();
        initLazyLoadImages();
        initGlobalRatingWidget();
        ensureAOSVisibilityFallback();
        // Ctrl+K to open global search
        document.addEventListener('keydown', (e) => {
          const isMac = navigator.platform.toUpperCase().includes('MAC');
          const ctrlOrMeta = isMac ? e.metaKey : e.ctrlKey;
          if (ctrlOrMeta && (e.key === 'k' || e.key === 'K')) {
            e.preventDefault();
            if (window.emta && typeof window.emta.openSearch === 'function') {
              window.emta.openSearch();
            }
          }
        });
      });
    } else {
      initNavbarScroll();
      setActiveLink();
      initLanguageSwitcher();
      initScrollAnimations();
      initAOS();
      initGlobalSearch();
      initDropdownMenu();
      initAuthControls();
      initButtonsRipple();
      initScrollTop();
      initSmoothScrollAnchors();
      initLazyLoadImages();
      initGlobalRatingWidget();
      ensureAOSVisibilityFallback();
      document.addEventListener('keydown', (e) => {
        const isMac = navigator.platform.toUpperCase().includes('MAC');
        const ctrlOrMeta = isMac ? e.metaKey : e.ctrlKey;
        if (ctrlOrMeta && (e.key === 'k' || e.key === 'K')) {
          e.preventDefault();
          if (window.emta && typeof window.emta.openSearch === 'function') {
            window.emta.openSearch();
          }
        }
      });
    }
  }

  init();
})();
