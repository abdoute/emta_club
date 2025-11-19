/**
 * Activities Page JavaScript
 * Handles events display, filtering, and gallery
 */

(function(){
  'use strict';

  // Backend API base URL
  const API_BASE = (typeof window!=='undefined'&&window.API_BASE) || (function(){ try { return localStorage.getItem('emta_api_base'); } catch { return null; } })() || 'http://127.0.0.1:5000';

  // ===== Events Data =====
  const upcomingEvents = [
    {
      id: 1,
      title: "Arduino Workshop - Advanced Projects",
      description: "Learn advanced Arduino programming and build complex projects. Perfect for intermediate to advanced students.",
      date: new Date('2025-02-15'),
      type: "Workshop",
      location: "Lab A - Building 1",
      time: "14:00 - 17:00",
      status: "upcoming"
    },
    {
      id: 2,
      title: "proteus & blender workshop",
      description: "Introduction to circuit simulation with Proteus and basic 3D modeling using Blender for creating simple project designs.",
      date: new Date('2024-12-12'),
      type: "Workshop",
      location: "Amphi 5 - univ 8 mai 1945",
      time: "10:00 - 12:00",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Open Day 2025/2026",
      description: "Discover our projects and activities in electronics, automation, and 3D modeling, with demonstrations and interactions.",
      date: new Date('2025-11-25'),
      type: "Open Day",
      location: "Amphi 5 - univ 8 mai 1945",
      time: "11:00 - 12:30",
      status: "upcoming"
    }
  ];

  // ===== Load events from Backend API =====
  function loadEventsFromAPI() {
    const toEvent = (item) => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      date: new Date(item.date),
      type: item.type || 'Event',
      location: item.location || '',
      time: item.time || '',
      status: item.status || 'upcoming',
    });

    // Fetch upcoming and past in parallel
    Promise.all([
      fetch(`${API_BASE}/api/activities/upcoming`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/api/activities/past`).then(r => r.json()).catch(() => null),
    ])
    .then(([upcomingRes, pastRes]) => {
      if (upcomingRes && upcomingRes.ok && Array.isArray(upcomingRes.items)) {
        upcomingEvents.length = 0;
        upcomingRes.items.map(toEvent).forEach(ev => upcomingEvents.push(ev));
      }
      if (pastRes && pastRes.ok && Array.isArray(pastRes.items)) {
        pastEvents.length = 0;
        pastRes.items.map(toEvent).forEach(ev => pastEvents.push(ev));
      }
      renderEvents();
    })
    .catch(() => {
      // Keep fallback data silently
    });
  }

  const pastEvents = [
    {
      id: 4,
      title: "Robotics Workshop - Basics",
      description: "Introduction to robotics, sensors, and actuators. Hands-on experience with our robot kits.",
      date: new Date('2024-12-10'),
      type: "Workshop",
      location: "Lab B",
      time: "14:00 - 17:00",
      status: "past"
    },
    {
      id: 5,
      title: "Scientific Day E-MTA 2024",
      description: "Annual scientific day featuring student projects, presentations, and networking opportunities.",
      date: new Date('2024-11-20'),
      type: "Conference",
      location: "Main Hall",
      time: "09:00 - 17:00",
      status: "past"
    },
    {
      id: 6,
      title: "Web Development Bootcamp",
      description: "Intensive 3-day bootcamp on modern web development. HTML, CSS, JavaScript, and frameworks.",
      date: new Date('2024-10-15'),
      type: "Workshop",
      location: "Computer Lab",
      time: "09:00 - 16:00",
      status: "past"
    }
  ];

  const galleryImages = [
    {
      title: "Workshop 2024",
      src: "assets/images/activities/workshop1.jpg",
      alt: "Arduino Workshop"
    },
    {
      title: "Hackathon",
      src: "assets/images/activities/hackathon1.jpg",
      alt: "Hackathon Event"
    },
    {
      title: "Scientific Day",
      src: "assets/images/activities/scientific-day.jpg",
      alt: "Scientific Day"
    },
    {
      title: "Team Project",
      src: "assets/images/activities/project1.jpg",
      alt: "Team Project"
    },
    {
      title: "Workshop Session",
      src: "assets/images/activities/workshop2.jpg",
      alt: "Workshop Session"
    },
    {
      title: "Competition",
      src: "assets/images/activities/competition1.jpg",
      alt: "Competition Event"
    }
  ];

  // ===== Helper Functions =====
  function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      day: date.getDate(),
      month: months[date.getMonth()],
      year: date.getFullYear()
    };
  }

  function getTypeIcon(type) {
    const icons = {
      'Workshop': 'fa-flask',
      'Conference': 'fa-microphone',
      'Competition': 'fa-trophy',
      'Project': 'fa-lightbulb'
    };
    return icons[type] || 'fa-calendar';
  }

  // ===== Create Event Card =====
  function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.setAttribute('data-aos', 'fade-up');
    
    const date = formatDate(event.date);
    const typeIcon = getTypeIcon(event.type);
    
    card.innerHTML = `
      <div class="event-header">
        <div class="event-date">
          <span class="day">${date.day}</span>
          <span class="month">${date.month}</span>
        </div>
        <span class="event-type">
          <i class="fa-solid ${typeIcon}"></i>
          ${event.type}
        </span>
      </div>
      <h3 class="event-title">${escapeHtml(event.title)}</h3>
      <p class="event-description">${escapeHtml(event.description)}</p>
      <div class="event-details">
        <div class="event-detail-item">
          <i class="fa-solid fa-map-marker-alt"></i>
          <span>${escapeHtml(event.location)}</span>
        </div>
        <div class="event-detail-item">
          <i class="fa-solid fa-clock"></i>
          <span>${escapeHtml(event.time)}</span>
        </div>
      </div>
      <div class="event-footer">
        <span class="event-status ${event.status}">
          <i class="fa-solid ${event.status === 'upcoming' ? 'fa-clock' : 'fa-check-circle'}"></i>
          ${event.status === 'upcoming' ? 'Upcoming' : 'Past'}
        </span>
        ${event.status === 'upcoming' ? '<a href="#" class="event-link">Learn More <i class="fa-solid fa-arrow-right"></i></a>' : ''}
      </div>
    `;
    
    return card;
  }

  // ===== Create Gallery Item =====
  function createGalleryItem(image) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('data-aos', 'zoom-in');
    
    item.innerHTML = `
      <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" onerror="this.src='assets/images/team/default.jpg'">
      <div class="gallery-overlay">
        <span class="gallery-title">${escapeHtml(image.title)}</span>
      </div>
    `;
    
    // Add click handler for lightbox (optional)
    item.addEventListener('click', () => {
      // Could implement lightbox here
      console.log('Gallery item clicked:', image.title);
    });
    
    return item;
  }

  // ===== Escape HTML =====
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ===== Render Events =====
  function renderEvents() {
    const upcomingGrid = document.getElementById('upcomingEventsGrid');
    const pastGrid = document.getElementById('pastEventsGrid');
    
    if (upcomingGrid) {
      upcomingGrid.innerHTML = '';
      if (upcomingEvents.length > 0) {
        upcomingEvents.forEach((event, index) => {
          const card = createEventCard(event);
          card.setAttribute('data-aos-delay', (index * 100).toString());
          upcomingGrid.appendChild(card);
        });
      } else {
        upcomingGrid.innerHTML = `
          <div class="empty-state">
            <i class="fa-solid fa-calendar-xmark"></i>
            <h3>No Upcoming Events</h3>
            <p>Check back soon for new activities!</p>
          </div>
        `;
      }
    }
    
    if (pastGrid) {
      pastGrid.innerHTML = '';
      if (pastEvents.length > 0) {
        pastEvents.forEach((event, index) => {
          const card = createEventCard(event);
          card.setAttribute('data-aos-delay', (index * 100).toString());
          pastGrid.appendChild(card);
        });
      } else {
        pastGrid.innerHTML = `
          <div class="empty-state">
            <i class="fa-solid fa-history"></i>
            <h3>No Past Events</h3>
            <p>We're just getting started!</p>
          </div>
        `;
      }
    }
  }

  // ===== Render Gallery =====
  function renderGallery() {
    const gallery = document.getElementById('eventGallery');
    if (!gallery) return;
    
    gallery.innerHTML = '';
    
    if (galleryImages.length > 0) {
      galleryImages.forEach((image, index) => {
        const item = createGalleryItem(image);
        item.setAttribute('data-aos-delay', (index * 50).toString());
        gallery.appendChild(item);
      });
    } else {
      gallery.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i class="fa-solid fa-images"></i>
          <h3>No Gallery Images</h3>
          <p>Gallery images will appear here soon!</p>
        </div>
      `;
    }
  }

  // ===== Initialize =====
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        renderEvents();
        renderGallery();
        loadEventsFromAPI();
      });
    } else {
      renderEvents();
      renderGallery();
      loadEventsFromAPI();
    }
  }

  init();
})();




