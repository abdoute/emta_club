'use strict';

(function() {
  const AVATAR_PLACEHOLDER = 'assets/images/team/avatar.jpg';
  const testimonialsData = [
    {
      name: 'mansri salah eddine',
      role: 'Software Engineering Student',
      major: 'electromecanique',
      image: 'assets/images/team/default.jpg',
      text: 'E-MTA Club has been an incredible journey for me. The workshops and projects helped me develop practical skills that I use in my studies every day.',
      rating: 5
    },
    {
      name: 'Rami kerboub',
      role: 'Electronics Student',
      major: 'Électromecanique',
      image: 'assets/images/team/default.jpg',
      text: 'Joining this club opened so many opportunities. The networking events and competitions pushed me to excel beyond my comfort zone.',
      rating: 5
    },
    {
      name: 'Mohamed Amine',
      role: 'Automation Engineering Student',
      major: 'Automatique',
      image: 'assets/images/team/default.jpg',
      text: 'The collaborative environment here is amazing. Working on real-world projects with talented peers has been a game-changer for my career.',
      rating: 5
    },
    {
      name: 'Sara Khelifi',
      role: 'AI & Robotics Enthusiast',
      major: 'Robotique',
      image: 'assets/images/team/default.jpg',
      text: 'I love how E-MTA Club bridges theory and practice. The hands-on workshops on AI and robotics are exactly what I needed to grow.',
      rating: 5
    },
    {
      name: 'Youssef Boudiaf',
      role: 'Embedded Systems Developer',
      major: 'Électronique',
      image: 'assets/images/team/default.jpg',
      text: 'The mentorship and guidance from senior members helped me land my first internship. This club is more than just activities—it\'s a family.',
      rating: 5
    },
    {
      name: 'Lina Merabet',
      role: 'Computer Science Student',
      major: 'Informatique',
      image: 'assets/images/team/default.jpg',
      text: 'Being part of E-MTA Club has enhanced both my technical and soft skills. The competitions and hackathons are always exciting!',
      rating: 5
    },
    {
      name: 'Nadir Boukhalfa',
      role: 'Master 2 Automatique',
      major: 'Automatique',
      image: 'assets/images/team/default.jpg',
      text: 'Great community and strong technical culture. The peer learning and code reviews improved my problem-solving a lot.',
      rating: 4
    },
    {
      name: 'Siham Gherbi',
      role: 'LP2-Pro Électrotechnique',
      major: 'Électrotechnique',
      image: 'assets/images/team/default.jpg',
      text: 'Les évènements sont bien organisés et les projets concrets. J’ai gagné en confiance et en expérience pratique.',
      rating: 5
    },
    {
      name: 'Walid Kaci',
      role: 'Computer Science Student',
      major: 'Informatique',
      image: 'assets/images/team/default.jpg',
      text: 'النادي هذا بصح فاميليا. تعلمت بزاف حاجات فالورشات، وخدمت مشاريع مع صحابي زادوني خبرة وثقة فالنفس.',
      rating: 4
    }
  ];

  let currentIndex = 0;
  let autoPlayInterval = null;
  const autoPlayDelay = 5000; // 5 seconds

  function createTestimonialCard(testimonial, index) {
    const stars = '★'.repeat(testimonial.rating);
    const activeClass = index === 0 ? 'active' : '';
    return `
      <div class="testimonial-card ${activeClass}" data-index="${index}">
        <div class="testimonial-header">
          <div class="testimonial-avatar">
            <img src="${AVATAR_PLACEHOLDER}" alt="${testimonial.name}" loading="lazy">
          </div>
          <div class="testimonial-info">
            <h4 class="testimonial-name">${testimonial.name}</h4>
            <p class="testimonial-role">${testimonial.role}</p>
            <p class="testimonial-major">${testimonial.major}</p>
          </div>
        </div>
        <div class="testimonial-rating">${stars}</div>
        <p class="testimonial-text" style="font-size:1.05rem">"${testimonial.text}"</p>
        <div class="testimonial-quote-icon">
          <i class="fa-solid fa-quote-right"></i>
        </div>
      </div>
    `;
  }

  function createDot(index) {
    const activeClass = index === 0 ? 'active' : '';
    return `<div class="slider-dot ${activeClass}" data-index="${index}"></div>`;
  }

  function renderTestimonials() {
    const slider = document.getElementById('testimonialsSlider');
    const dotsContainer = document.getElementById('sliderDots');
    
    if (!slider || !dotsContainer) return;

    slider.innerHTML = testimonialsData.map((testimonial, index) => 
      createTestimonialCard(testimonial, index)
    ).join('');

    dotsContainer.innerHTML = testimonialsData.map((_, index) => 
      createDot(index)
    ).join('');

    // Add click handlers to dots
    dotsContainer.querySelectorAll('.slider-dot').forEach((dot, index) => {
      dot.addEventListener('click', () => goToSlide(index));
    });
  }

  function updateSlider() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.slider-dot');

    cards.forEach((card, index) => {
      if (index === currentIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlider();
    resetAutoPlay();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % testimonialsData.length;
    updateSlider();
    resetAutoPlay();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + testimonialsData.length) % testimonialsData.length;
    updateSlider();
    resetAutoPlay();
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  function initSlider() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slider = document.getElementById('testimonialsSlider');

    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }

    // Pause on hover
    if (slider) {
      slider.addEventListener('mouseenter', stopAutoPlay);
      slider.addEventListener('mouseleave', startAutoPlay);
    }

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    if (slider) {
      slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });

      slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      });
    }

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }

    // Start auto-play
    startAutoPlay();
  }

  // Initialize on DOM ready
  function init() {
    // Inject minimal styles if missing
    if (!document.getElementById('testimonials-styles')) {
      const style = document.createElement('style');
      style.id = 'testimonials-styles';
      style.textContent = `
        .testimonials-slider{position:relative;display:block}
        .testimonial-card{display:none;background:linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));border:1px solid var(--border-color);border-radius:14px;padding:18px;box-shadow:0 10px 30px rgba(0,0,0,.25)}
        .testimonial-card.active{display:block}
        .testimonial-header{display:flex;gap:12px;align-items:center;margin-bottom:8px}
        .testimonial-avatar{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), rgba(255,255,255,0.04));border:1px solid var(--border-color);box-shadow:0 6px 14px rgba(0,0,0,.25) inset, 0 4px 10px rgba(0,0,0,.25)}
        .testimonial-avatar img{width:60px;height:60px;border-radius:50%;object-fit:cover}
        .testimonial-name{margin:0;color:var(--text-primary)}
        .testimonial-role,.testimonial-major{margin:0;color:var(--text-secondary);font-size:.9rem}
        .testimonial-rating{color:#fbbf24;letter-spacing:2px;margin:6px 0}
        .testimonial-quote-icon{color:var(--text-muted);text-align:right}
        .slider-dots{display:flex;gap:8px;justify-content:center;margin-top:14px}
        .slider-dot{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.25);cursor:pointer;transition:transform .2s}
        .slider-dot.active{background:var(--primary-color);transform:scale(1.1)}
        .slider-btn{background:transparent;border:1px solid var(--border-color);color:var(--text-secondary);border-radius:10px;padding:8px 10px}
      `;
      document.head.appendChild(style);
    }
    renderTestimonials();
    setTimeout(() => {
      initSlider();
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

