"use strict";

(function() {
  const STORAGE_KEY = 'emta_dashboard_enhanced';
  const DEFAULT_AVATAR = 'assets/images/team/default.jpg';
  
  // Default data
  const defaultData = {
    member: {
      name: 'Ahmed Benali',
      email: 'ahmed.benali@univ-guelma.dz',
      regNumber: '2024001234',
      level: 'L3',
      specialty: 'Informatique',
      joinDate: 'January 2024',
      role: 'Active Member',
      avatar: DEFAULT_AVATAR,
      phone: '+213 555 123 456',
      bio: 'Passionate about AI, robotics, and building innovative solutions.',
      stats: [
        { label: 'Projects', value: 3 },
        { label: 'Events', value: 8 },
        { label: 'Badges', value: 6 }
      ],
      skills: ['AI', 'Web', 'Robotics', 'Teamwork'],
      links: [
        { label: 'LinkedIn', href: 'https://linkedin.com' },
        { label: 'GitHub', href: 'https://github.com' }
      ]
    },
    attendance: [
      { event: 'AI Workshop', date: '2025-01-15', type: 'Workshop', notes: 'Introduction to Machine Learning' },
      { event: 'Robotics Competition', date: '2025-01-10', type: 'Competition', notes: 'Regional finals' },
      { event: 'Team Meeting', date: '2025-01-05', type: 'Meeting', notes: 'Project planning' }
    ],
    certificates: [
      { title: 'AI Fundamentals', issuer: 'E-MTA Club', date: '2024-12-20', id: 'CERT-2024-001', image: null },
      { title: 'Web Development Bootcamp', issuer: 'Tech Academy', date: '2024-11-15', id: 'CERT-2024-002', image: null },
      { title: 'Robotics Workshop', issuer: 'E-MTA Club', date: '2024-10-10', id: 'CERT-2024-003', image: null }
    ],
    portfolio: [
      { title: 'Smart Home System', category: 'Project', description: 'IoT-based automation system with voice control and mobile app', link: '#', tags: ['IoT', 'Arduino', 'React'], image: null },
      { title: 'AI Chatbot', category: 'Code', description: 'Intelligent chatbot using NLP for student assistance', link: '#', tags: ['Python', 'NLP', 'AI'], image: null }
    ],
    projects: [
      { title: 'Autonomous Robot', description: 'Competition robot with AI navigation', status: 'active', progress: 75, teamSize: 4, deadline: '2025-03-15' },
      { title: 'Web Platform', description: 'Student collaboration platform', status: 'active', progress: 45, teamSize: 3, deadline: '2025-04-20' }
    ],
    achievements: [
      { icon: '🏆', name: 'First Project' },
      { icon: '⭐', name: 'Active Member' },
      { icon: '🎯', name: 'Project Master' },
      { icon: '🤝', name: 'Team Player' },
      { icon: '💡', name: 'Innovator' },
      { icon: '📚', name: 'Knowledge Seeker' }
    ]
  };

  // State management
  let state = loadState() || defaultData;
  let deleteTarget = { type: null, index: null };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  // Toast notifications
  function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid ${type === 'error' ? 'fa-circle-xmark' : 'fa-circle-check'}"></i><span>${message}</span><button class="close">&times;</button>`;
    container.appendChild(toast);
    toast.querySelector('.close').addEventListener('click', () => removeToast(toast));
    setTimeout(() => removeToast(toast), 3000);
  }

  function removeToast(toast) {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 200);
  }

  // Modal helpers
  function openModal(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.style.display = 'flex';
      setTimeout(() => overlay.classList.add('open'), 10);
    }
  }

  function closeModal(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.remove('open');
      setTimeout(() => { overlay.style.display = 'none'; }, 150);
    }
  }

  // Initialize profile
  function initProfile() {
    const m = state.member;
    document.getElementById('memberName').textContent = m.name;
    document.getElementById('profileName').textContent = m.name;
    document.getElementById('profileRole').textContent = m.role;
    document.getElementById('profileMajor').textContent = m.specialty;
    document.getElementById('profileEmail').textContent = m.email;
    document.getElementById('profilePhone').textContent = m.phone || '+213';
    document.getElementById('profileRegNum').textContent = m.regNumber;
    document.getElementById('profileLevel').textContent = m.level;
    document.getElementById('profileJoinDate').textContent = `Joined: ${m.joinDate}`;
    const avatar = document.getElementById('profileAvatar');
    if (avatar) avatar.src = m.avatar || DEFAULT_AVATAR;
    const bio = document.getElementById('profileBio');
    if (bio) bio.textContent = m.bio || '';
    
    // Stats
    const statsEl = document.getElementById('profileStats');
    if (statsEl && m.stats && Array.isArray(m.stats)) {
      statsEl.innerHTML = m.stats.map(s => 
        `<div class="mini-stat"><div class="val">${s.value}</div><div class="lbl">${s.label}</div></div>`
      ).join('');
    }
    
    // Skills
    const skillsEl = document.getElementById('profileSkills');
    if (skillsEl && m.skills && Array.isArray(m.skills)) {
      skillsEl.innerHTML = m.skills.map(skill => 
        `<span class="chip">${skill}</span>`
      ).join('');
    }
    
    // Links
    const linksEl = document.getElementById('profileLinks');
    if (linksEl && m.links && Array.isArray(m.links)) {
      linksEl.innerHTML = m.links.map(link => 
        `<a href="${link.href}" class="link-btn" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-link"></i> ${link.label}</a>`
      ).join('');
    }
  }

  // Profile edit
  function initProfileEdit() {
    const btn = document.getElementById('editProfileBtn');
    const closeBtn = document.getElementById('profileEditClose');
    const cancelBtn = document.getElementById('profileEditCancel');
    const saveBtn = document.getElementById('profileEditSave');
    const form = document.getElementById('profileEditForm');

    if (btn) btn.addEventListener('click', () => {
      document.getElementById('editName').value = state.member.name;
      document.getElementById('editEmail').value = state.member.email;
      document.getElementById('editPhone').value = state.member.phone || '';
      document.getElementById('editLevel').value = state.member.level;
      document.getElementById('editSpecialty').value = state.member.specialty;
      document.getElementById('editBio').value = state.member.bio || '';
      openModal('profileEditOverlay');
    });

    if (closeBtn) closeBtn.addEventListener('click', () => closeModal('profileEditOverlay'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => closeModal('profileEditOverlay'));

    if (saveBtn && form) {
      saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        state.member = {
          ...state.member,
          name: document.getElementById('editName').value.trim(),
          email: document.getElementById('editEmail').value.trim(),
          phone: document.getElementById('editPhone').value.trim(),
          level: document.getElementById('editLevel').value.trim(),
          specialty: document.getElementById('editSpecialty').value.trim(),
          bio: document.getElementById('editBio').value.trim()
        };
        saveState();
        initProfile();
        closeModal('profileEditOverlay');
        showToast('Profile updated successfully');
      });
    }

    // Avatar upload
    const avatarBtn = document.getElementById('avatarEditBtn');
    const avatarInput = document.getElementById('avatarFileInput');
    if (avatarBtn && avatarInput) {
      avatarBtn.addEventListener('click', () => avatarInput.click());
      avatarInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          state.member.avatar = reader.result;
          saveState();
          initProfile();
          showToast('Avatar updated');
        };
        reader.readAsDataURL(file);
      });
    }
  }

  // Attendance
  function renderAttendance() {
    const container = document.getElementById('attendanceList');
    if (!container) return;
    if (!state.attendance.length) {
      container.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:20px">No attendance records yet</p>';
      return;
    }
    container.innerHTML = state.attendance.map((att, idx) => `
      <div class="attendance-item">
        <div class="attendance-info">
          <div class="attendance-title">${att.event}</div>
          <div class="attendance-meta">
            <span><i class="fa-solid fa-calendar"></i> ${new Date(att.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span><i class="fa-solid fa-tag"></i> ${att.type}</span>
          </div>
        </div>
        <button class="edit-btn btn-danger" onclick="window.dashboardDeleteItem('attendance', ${idx})"><i class="fa-solid fa-trash"></i></button>
      </div>
    `).join('');
  }

  function initAttendance() {
    const btn = document.getElementById('addAttendanceBtn');
    const closeBtn = document.getElementById('attendanceModalClose');
    const cancelBtn = document.getElementById('attendanceCancelBtn');
    const saveBtn = document.getElementById('attendanceSaveBtn');
    const form = document.getElementById('attendanceForm');

    if (btn) btn.addEventListener('click', () => {
      if (form) form.reset();
      document.getElementById('attDate').value = new Date().toISOString().slice(0, 10);
      openModal('attendanceModalOverlay');
    });

    if (closeBtn) closeBtn.addEventListener('click', () => closeModal('attendanceModalOverlay'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => closeModal('attendanceModalOverlay'));

    if (saveBtn && form) {
      saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        state.attendance.unshift({
          event: document.getElementById('attEventName').value.trim(),
          date: document.getElementById('attDate').value,
          type: document.getElementById('attType').value,
          notes: document.getElementById('attNotes').value.trim()
        });
        saveState();
        renderAttendance();
        closeModal('attendanceModalOverlay');
        showToast('Attendance logged successfully');
      });
    }
  }

  // Certificates
  function renderCertificates() {
    const container = document.getElementById('certificatesGrid');
    if (!container) return;
    if (!state.certificates.length) {
      container.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:20px;grid-column:1/-1">No certificates yet</p>';
      return;
    }
    container.innerHTML = state.certificates.map((cert, idx) => `
      <div class="certificate-card">
        ${cert.image ? `<img src="${cert.image}" class="certificate-image" alt="${cert.title}">` : `<div class="certificate-icon">🏆</div>`}
        <div class="certificate-title">${cert.title}</div>
        <div class="certificate-issuer">${cert.issuer}</div>
        <div class="certificate-date"><i class="fa-solid fa-calendar"></i> ${new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
        ${cert.id ? `<div class="certificate-date" style="margin-top:4px"><i class="fa-solid fa-hashtag"></i> ${cert.id}</div>` : ''}
        <div class="certificate-actions">
          <button onclick="window.dashboardDeleteItem('certificate', ${idx})"><i class="fa-solid fa-trash"></i> Delete</button>
        </div>
      </div>
    `).join('');
  }

  function initCertificates() {
    const btn = document.getElementById('addCertificateBtn');
    const closeBtn = document.getElementById('certificateModalClose');
    const cancelBtn = document.getElementById('certificateCancelBtn');
    const saveBtn = document.getElementById('certificateSaveBtn');
    const form = document.getElementById('certificateForm');

    if (btn) btn.addEventListener('click', () => {
      if (form) form.reset();
      document.getElementById('certDate').value = new Date().toISOString().slice(0, 10);
      openModal('certificateModalOverlay');
    });

    if (closeBtn) closeBtn.addEventListener('click', () => closeModal('certificateModalOverlay'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => closeModal('certificateModalOverlay'));

    if (saveBtn && form) {
      saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        
        const imageFile = document.getElementById('certImage').files?.[0];
        const saveCert = (image) => {
          state.certificates.unshift({
            title: document.getElementById('certTitle').value.trim(),
            issuer: document.getElementById('certIssuer').value.trim(),
            date: document.getElementById('certDate').value,
            id: document.getElementById('certId').value.trim(),
            image
          });
          saveState();
          renderCertificates();
          closeModal('certificateModalOverlay');
          showToast('Certificate added successfully');
        };

        if (imageFile) {
          const reader = new FileReader();
          reader.onload = () => saveCert(reader.result);
          reader.readAsDataURL(imageFile);
        } else {
          saveCert(null);
        }
      });
    }
  }

  // Portfolio
  function renderPortfolio() {
    const container = document.getElementById('portfolioGrid');
    if (!container) return;
    if (!state.portfolio.length) {
      container.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:20px;grid-column:1/-1">No portfolio items yet</p>';
      return;
    }
    container.innerHTML = state.portfolio.map((item, idx) => `
      <div class="portfolio-item">
        <div class="portfolio-image">
          ${item.image ? `<img src="${item.image}" alt="${item.title}">` : `<i class="fa-solid fa-briefcase"></i>`}
        </div>
        <div class="portfolio-content">
          <span class="portfolio-category">${item.category}</span>
          <div class="portfolio-title">${item.title}</div>
          <div class="portfolio-description">${item.description}</div>
          ${item.tags ? `<div class="portfolio-tags">${item.tags.map(t => `<span class="portfolio-tag">${t}</span>`).join('')}</div>` : ''}
          <div class="portfolio-footer">
            ${item.link ? `<a href="${item.link}" class="portfolio-link" target="_blank"><i class="fa-solid fa-external-link"></i> View</a>` : '<span></span>'}
            <div class="portfolio-actions">
              <button onclick="window.dashboardDeleteItem('portfolio', ${idx})"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  function initPortfolio() {
    const btn = document.getElementById('addPortfolioBtn');
    const closeBtn = document.getElementById('portfolioModalClose');
    const cancelBtn = document.getElementById('portfolioCancelBtn');
    const saveBtn = document.getElementById('portfolioSaveBtn');
    const form = document.getElementById('portfolioForm');

    if (btn) btn.addEventListener('click', () => {
      if (form) form.reset();
      openModal('portfolioModalOverlay');
    });

    if (closeBtn) closeBtn.addEventListener('click', () => closeModal('portfolioModalOverlay'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => closeModal('portfolioModalOverlay'));

    if (saveBtn && form) {
      saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }

        const imageFile = document.getElementById('portImage').files?.[0];
        const saveItem = (image) => {
          const tagsStr = document.getElementById('portTags').value.trim();
          state.portfolio.unshift({
            title: document.getElementById('portTitle').value.trim(),
            category: document.getElementById('portCategory').value,
            description: document.getElementById('portDesc').value.trim(),
            link: document.getElementById('portLink').value.trim(),
            tags: tagsStr ? tagsStr.split(',').map(t => t.trim()) : [],
            image
          });
          saveState();
          renderPortfolio();
          closeModal('portfolioModalOverlay');
          showToast('Portfolio item added');
        };

        if (imageFile) {
          const reader = new FileReader();
          reader.onload = () => saveItem(reader.result);
          reader.readAsDataURL(imageFile);
        } else {
          saveItem(null);
        }
      });
    }
  }

  // Projects
  function renderProjects() {
    const container = document.getElementById('projectsList');
    if (!container) return;
    if (!state.projects.length) {
      container.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:20px">No projects yet</p>';
      return;
    }
    container.innerHTML = state.projects.map((proj, idx) => `
      <div class="project-item" style="border-radius:12px;border:1px solid var(--border-color)">
        <div class="project-header">
          <div>
            <div class="project-title">${proj.title}</div>
            <span class="project-status ${proj.status}">${proj.status === 'active' ? 'Active' : 'Completed'}</span>
          </div>
          <button class="edit-btn btn-danger" onclick="window.dashboardDeleteItem('project', ${idx})"><i class="fa-solid fa-trash"></i></button>
        </div>
        <p class="project-description">${proj.description}</p>
        <div class="project-meta">
          <span><i class="fa-solid fa-chart-line"></i> ${proj.progress}%</span>
          <span><i class="fa-solid fa-users"></i> ${proj.teamSize} Members</span>
          <span><i class="fa-solid fa-calendar"></i> ${new Date(proj.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
        <div style="margin-top:10px;background:rgba(255,255,255,0.06);border:1px solid var(--border-color);height:10px;border-radius:8px;overflow:hidden">
          <div style="height:100%;width:${proj.progress}%;background:linear-gradient(135deg,var(--primary-color),var(--secondary-color))"></div>
        </div>
      </div>
    `).join('');
  }

  function initProjects() {
    const btn = document.getElementById('addProjectBtn');
    const closeBtn = document.getElementById('projectModalClose');
    const cancelBtn = document.getElementById('projectCancelBtn');
    const saveBtn = document.getElementById('projectSaveBtn');
    const form = document.getElementById('projectForm');

    if (btn) btn.addEventListener('click', () => {
      if (form) form.reset();
      document.getElementById('projDeadline').value = new Date().toISOString().slice(0, 10);
      openModal('projectModalOverlay');
    });

    if (closeBtn) closeBtn.addEventListener('click', () => closeModal('projectModalOverlay'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => closeModal('projectModalOverlay'));

    if (saveBtn && form) {
      saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const progress = Math.min(100, Math.max(0, parseInt(document.getElementById('projProgress').value)));
        state.projects.unshift({
          title: document.getElementById('projTitle').value.trim(),
          description: document.getElementById('projDesc').value.trim(),
          progress,
          teamSize: parseInt(document.getElementById('projTeam').value) || 1,
          deadline: document.getElementById('projDeadline').value,
          status: progress >= 100 ? 'completed' : 'active'
        });
        saveState();
        renderProjects();
        closeModal('projectModalOverlay');
        showToast('Project added');
      });
    }
  }

  // Achievements
  function renderAchievements() {
    const container = document.getElementById('achievementsGrid');
    if (!container) return;
    container.innerHTML = state.achievements.map(ach => `
      <div class="achievement-badge">
        <div class="achievement-icon">${ach.icon}</div>
        <div class="achievement-name">${ach.name}</div>
      </div>
    `).join('');
  }

  // Delete handler
  window.dashboardDeleteItem = function(type, index) {
    deleteTarget = { type, index };
    openModal('deleteModalOverlay');
  };

  function initDeleteModal() {
    const closeBtn = document.getElementById('deleteModalClose');
    const cancelBtn = document.getElementById('deleteCancelBtn');
    const confirmBtn = document.getElementById('deleteConfirmBtn');

    if (closeBtn) closeBtn.addEventListener('click', () => closeModal('deleteModalOverlay'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => closeModal('deleteModalOverlay'));
    if (confirmBtn) confirmBtn.addEventListener('click', () => {
      const { type, index } = deleteTarget;
      if (type === 'attendance') state.attendance.splice(index, 1);
      else if (type === 'certificate') state.certificates.splice(index, 1);
      else if (type === 'portfolio') state.portfolio.splice(index, 1);
      else if (type === 'project') state.projects.splice(index, 1);
      saveState();
      renderAttendance();
      renderCertificates();
      renderPortfolio();
      renderProjects();
      closeModal('deleteModalOverlay');
      showToast('Item deleted');
    });
  }

  // Counter animation
  function initCounters() {
    document.querySelectorAll('.stat-number[data-target]').forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      let current = 0;
      const increment = target / 100;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, 20);
    });
  }

  // Initialize all
  function init() {
    initProfile();
    initProfileEdit();
    renderAttendance();
    initAttendance();
    renderCertificates();
    initCertificates();
    renderPortfolio();
    initPortfolio();
    renderProjects();
    initProjects();
    renderAchievements();
    initDeleteModal();
    initCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
