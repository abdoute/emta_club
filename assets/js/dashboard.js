"use strict";

(function() {
  const TOKEN_KEY = 'emta_token';
  const token = (()=>{ try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } })();
  if (!token) { window.location.href = 'login.html'; return; }
  const API_BASE = (typeof window!=='undefined'&&window.API_BASE) || (function(){ try { return localStorage.getItem('emta_api_base'); } catch { return null; } })() || 'http://127.0.0.1:5000';
  const authHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
  const STORAGE_KEY = 'emta_dashboard_state';
  const DEFAULT_AVATAR = 'assets/images/team/default.jpg';
  let deleteProjectIndex = null;

  // Defaults (used first run)
  const defaultMember = {
    name: 'Ahmed Benali',
    email: 'ahmed.benali@univ-guelma.dz',
    regNumber: '2024001234',
    level: 'L3',
    specialty: 'Informatique',
    joinDate: 'January 2024',
    role: 'Active Member',
    avatar: DEFAULT_AVATAR,
    phone: '+213',
    bio: 'Active member passionate about AI, robotics, and community projects.',
    stats: [
      { label: 'Projects', value: 3 },
      { label: 'Events', value: 8 },
      { label: 'Badges', value: 6 }
    ],
    skills: ['AI','Web','Robotics','Teamwork'],
    links: [{ label: 'LinkedIn', href: '#'}, { label: 'GitHub', href: '#'}]
  };

  const defaultUpcoming = [
    {
      title: 'Workshop: Introduction to AI',
      date: '15',
      month: 'Feb',
      time: '10:00 AM'
    },
    {
      title: 'Project Presentation Day',
      date: '22',
      month: 'Feb',
      time: '2:00 PM'
    },
    {
      title: 'Hackathon: Smart Solutions',
      date: '28',
      month: 'Feb',
      time: '9:00 AM'
    }
  ];

  // Project Delete Confirm (Modal) - helpers
  function openDeleteModal(){
    const overlay = document.getElementById('projectDeleteOverlay');
    if (!overlay) { if (confirm('Delete this project?')) performDelete(); return; }
    overlay.style.display = 'flex';
    requestAnimationFrame(()=> overlay.classList.add('open'));
  }
  function closeDeleteModal(){
    const overlay = document.getElementById('projectDeleteOverlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    setTimeout(()=>{ overlay.style.display = 'none'; }, 150);
  }
  function performDelete(){
    if (deleteProjectIndex == null) return;
    state.projects.splice(deleteProjectIndex, 1);
    deleteProjectIndex = null;
    saveState(state);
    renderProjects();
    showToast('Project deleted', 'success');
  }
  function initDeleteModalBindings(){
    const overlay = document.getElementById('projectDeleteOverlay');
    if (!overlay) return;
    const closeBtn = document.getElementById('projectDeleteClose');
    const cancelBtn = document.getElementById('projectDeleteCancel');
    const confirmBtn = document.getElementById('projectDeleteConfirm');
    if (closeBtn) closeBtn.addEventListener('click', closeDeleteModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeDeleteModal);
    overlay.addEventListener('click', (e)=>{ if (e.target === overlay) closeDeleteModal(); });
    if (confirmBtn) confirmBtn.addEventListener('click', ()=>{ performDelete(); closeDeleteModal(); });
  }

  const defaultProjects = [
    {
      title: 'Smart Home Automation System',
      description: 'Developing an IoT-based home automation system with voice control integration.',
      status: 'active',
      progress: 75,
      teamSize: 4,
      deadline: '2025-03-15'
    },
    {
      title: 'AI-Powered Study Assistant',
      description: 'Creating an intelligent chatbot to help students with their studies.',
      status: 'active',
      progress: 45,
      teamSize: 3,
      deadline: '2025-04-20'
    },
    {
      title: 'Robotics Competition Project',
      description: 'Building an autonomous robot for the national robotics competition.',
      status: 'completed',
      progress: 100,
      teamSize: 5,
      deadline: '2024-12-10'
    }
  ];

  const now = Date.now();
  const defaultActivities = [
    { icon: 'fa-calendar-check', text: 'Registered for Workshop: Introduction to AI', ts: now - 2*60*60*1000 },
    { icon: 'fa-project-diagram', text: 'Updated project: Smart Home Automation System', ts: now - 24*60*60*1000 },
    { icon: 'fa-trophy', text: 'Earned achievement: Project Master', ts: now - 3*24*60*60*1000 },
    { icon: 'fa-users', text: 'Joined team: AI Development Group', ts: now - 7*24*60*60*1000 },
    { icon: 'fa-file-alt', text: 'Submitted project proposal: AI Study Assistant', ts: now - 14*24*60*60*1000 }
  ];

  const defaultAchievements = [
    { icon: '🏆', name: 'First Project' },
    { icon: '⭐', name: 'Active Member' },
    { icon: '🎯', name: 'Project Master' },
    { icon: '🤝', name: 'Team Player' },
    { icon: '💡', name: 'Innovator' },
    { icon: '📚', name: 'Knowledge Seeker' }
  ];

  // Load/Save state
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  }

  function saveState(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  // Initialize state
  let state = loadState();
  if (!state) {
    state = {
      member: defaultMember,
      upcoming: defaultUpcoming,
      projects: defaultProjects,
      activities: defaultActivities,
      achievements: defaultAchievements
    };
    saveState(state);
  }

  // Load profile from backend and merge into local state
  async function loadProfileFromAPI(){
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, { headers: authHeaders() });
      const data = await res.json().catch(()=>({}));
      if (!res.ok || !data.ok || !data.user) return;
      const u = data.user;
      state.member = {
        ...state.member,
        name: u.name || state.member.name,
        email: u.email || state.member.email,
        regNumber: u.registration || state.member.regNumber,
        level: u.level || state.member.level,
        specialty: u.specialty || state.member.specialty,
        joinDate: u.created_at ? new Date(u.created_at).toLocaleString('en', { month: 'long', year: 'numeric' }) : state.member.joinDate,
      };
      saveState(state);
    } catch(_) { /* ignore network errors, keep local */ }
  }

  // Relative time formatter
  function formatRelativeTime(ts) {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const diffSec = Math.round((ts - Date.now()) / 1000);
    const abs = Math.abs(diffSec);
    if (abs < 60) return rtf.format(Math.floor(diffSec), 'second');
    const diffMin = Math.round(diffSec / 60);
    if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
    const diffHour = Math.round(diffMin / 60);
    if (Math.abs(diffHour) < 24) return rtf.format(diffHour, 'hour');
    const diffDay = Math.round(diffHour / 24);
    if (Math.abs(diffDay) < 7) return rtf.format(diffDay, 'day');
    const diffWeek = Math.round(diffDay / 7);
    if (Math.abs(diffWeek) < 4) return rtf.format(diffWeek, 'week');
    const diffMonth = Math.round(diffDay / 30);
    if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, 'month');
    const diffYear = Math.round(diffDay / 365);
    return rtf.format(diffYear, 'year');
  }

  // Initialize member profile
  function initProfile() {
    const m = state.member;
    document.getElementById('memberName').textContent = m.name;
    document.getElementById('profileName').textContent = m.name;
    document.getElementById('profileRole').textContent = m.role;
    document.getElementById('profileMajor').textContent = m.specialty;
    document.getElementById('profileEmail').textContent = m.email;
    const phoneEl = document.getElementById('profilePhone'); if (phoneEl) phoneEl.textContent = m.phone || '';
    document.getElementById('profileRegNum').textContent = m.regNumber;
    document.getElementById('profileLevel').textContent = m.level;
    document.getElementById('profileJoinDate').textContent = `Joined: ${m.joinDate}`;
    const avatarImg = document.getElementById('profileAvatar');
    if (avatarImg) avatarImg.src = m.avatar || DEFAULT_AVATAR;
    const bioEl = document.getElementById('profileBio'); if (bioEl) bioEl.textContent = m.bio || '';
    // Stats
    const statsEl = document.getElementById('profileStats');
    if (statsEl) {
      const stats = Array.isArray(m.stats) ? m.stats : [];
      statsEl.innerHTML = stats.map(s=>`<div class="mini-stat"><div class="val">${s.value}</div><div class="lbl">${s.label}</div></div>`).join('');
    }
    // Skills
    const skillsEl = document.getElementById('profileSkills');
    if (skillsEl) {
      const skills = Array.isArray(m.skills) ? m.skills : [];
      skillsEl.innerHTML = skills.map(k=>`<span class="chip">${k}</span>`).join('');
    }
    // Links
    const linksEl = document.getElementById('profileLinks');
    if (linksEl) {
      const links = Array.isArray(m.links) ? m.links : [];
      linksEl.innerHTML = links.map(l=>`<a class="link-btn" href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join('');
    }
  }

  // Render upcoming events
  function renderUpcomingEvents() {
    const container = document.getElementById('upcomingEventsList');
    if (!container) return;

    if (state.upcoming.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">No upcoming events</p>';
      return;
    }

    container.innerHTML = state.upcoming.map(event => `
      <div class="event-item">
        <div class="event-date-badge">
          <span class="day">${event.date}</span>
          <span class="month">${event.month}</span>
        </div>
        <div class="event-info">
          <div class="event-title">${event.title}</div>
          <div class="event-time">
            <i class="fa-solid fa-clock"></i> ${event.time}
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render projects
  function renderProjects() {
    const container = document.getElementById('projectsList');
    if (!container) return;

    if (state.projects.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">No projects yet</p>';
      return;
    }

    container.innerHTML = state.projects.map((project, idx) => {
      const statusClass = project.status === 'active' ? 'active' : 'completed';
      const statusText = project.status === 'active' ? 'Active' : 'Completed';
      const deadlineDate = new Date(project.deadline);
      const formattedDeadline = deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      return `
        <div class="project-item" draggable="true" data-index="${idx}">
          <div class="project-header">
            <div>
              <div class="project-title">${project.title}</div>
              <span class="project-status ${statusClass}">${statusText}</span>
            </div>
            <div class="project-actions">
              <button class="edit-btn project-edit" data-index="${idx}"><i class="fa-solid fa-pen"></i> Edit</button>
              <button class="edit-btn btn-danger project-delete" data-index="${idx}"><i class="fa-solid fa-trash"></i> Delete</button>
            </div>
          </div>
          <p class="project-description">${project.description}</p>
          <div class="project-meta">
            <span><i class="fa-solid fa-chart-line"></i> ${project.progress}% Complete</span>
            <span><i class="fa-solid fa-users"></i> ${project.teamSize} Members</span>
            <span><i class="fa-solid fa-calendar"></i> ${formattedDeadline}</span>
          </div>
          <div style="margin-top:10px;background:rgba(255,255,255,0.06);border:1px solid var(--border-color);height:10px;border-radius:8px;overflow:hidden">
            <div style="height:100%;width:${Math.min(Math.max(project.progress,0),100)}%;background:linear-gradient(135deg, var(--primary-color), var(--secondary-color));"></div>
          </div>
        </div>
      `;
    }).join('');

    // Bind edit/delete
    container.querySelectorAll('.project-edit').forEach(btn => btn.addEventListener('click', () => {
      const i = parseInt(btn.getAttribute('data-index'), 10);
      openProjectModalForEdit(i);
    }));
    container.querySelectorAll('.project-delete').forEach(btn => btn.addEventListener('click', () => {
      const i = parseInt(btn.getAttribute('data-index'), 10);
      if (!Number.isInteger(i)) return;
      deleteProjectIndex = i;
      openDeleteModal();
    }));

    // Drag & drop reorder
    const items = container.querySelectorAll('.project-item');
    let dragIndex = null;
    items.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        dragIndex = parseInt(item.getAttribute('data-index'), 10);
        e.dataTransfer.effectAllowed = 'move';
        item.classList.add('dragging');
      });
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        container.querySelectorAll('.drag-over').forEach(el=>el.classList.remove('drag-over'));
      });
      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        item.classList.add('drag-over');
      });
      item.addEventListener('dragleave', () => {
        item.classList.remove('drag-over');
      });
      item.addEventListener('drop', (e) => {
        e.preventDefault();
        item.classList.remove('drag-over');
        const dropIndex = parseInt(item.getAttribute('data-index'), 10);
        if (!Number.isInteger(dragIndex) || !Number.isInteger(dropIndex) || dragIndex===dropIndex) return;
        const moved = state.projects.splice(dragIndex, 1)[0];
        state.projects.splice(dropIndex, 0, moved);
        saveState(state);
        renderProjects();
        showToast('Projects reordered', 'success');
      });
    });
  }

  // Render activity timeline
  function renderActivities() {
    const container = document.getElementById('activityTimeline');
    if (!container) return;

    if (state.activities.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">No recent activity</p>';
      return;
    }

    container.innerHTML = state.activities.map(activity => `
      <div class="activity-item">
        <div class="activity-icon">
          <i class="fa-solid ${activity.icon}"></i>
        </div>
        <div class="activity-content">
          <div class="activity-text">${activity.text}</div>
          <div class="activity-time">${activity.ts ? formatRelativeTime(activity.ts) : ''}</div>
        </div>
      </div>
    `).join('');
  }

  // Render achievements
  function renderAchievements() {
    const container = document.getElementById('achievementsGrid');
    if (!container) return;

    container.innerHTML = state.achievements.map(achievement => `
      <div class="achievement-badge" title="${achievement.name}">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-name">${achievement.name}</div>
      </div>
    `).join('');
  }

  // Initialize counters
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      // Use IntersectionObserver to trigger animation when visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            updateCounter();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(counter);
    });
  }

  // Edit profile button handler
  function initEditProfile() {
    const editBtn = document.getElementById('editProfileBtn');
    const overlay = document.getElementById('profileEditOverlay');
    const closeBtn = document.getElementById('profileEditClose');
    const cancelBtn = document.getElementById('profileEditCancel');
    const saveBtn = document.getElementById('profileEditSave');
    const form = document.getElementById('profileEditForm');
    const nameInput = document.getElementById('editName');
    const emailInput = document.getElementById('editEmail');
    const phoneInput = document.getElementById('editPhone');
    const levelInput = document.getElementById('editLevel');
    const specialtyInput = document.getElementById('editSpecialty');
    const bioInput = document.getElementById('editBio');

    function openModal(){
      if (!overlay) return;
      // Prefill
      nameInput.value = state.member.name || '';
      emailInput.value = state.member.email || '';
      if (phoneInput) phoneInput.value = state.member.phone || '';
      levelInput.value = state.member.level || '';
      specialtyInput.value = state.member.specialty || '';
      if (bioInput) bioInput.value = state.member.bio || '';
      overlay.style.display = 'flex';
      setTimeout(()=>overlay.classList.add('open'), 10);
    }
    function closeModal(){
      if (!overlay) return;
      overlay.classList.remove('open');
      setTimeout(()=>{ overlay.style.display = 'none'; }, 150);
    }

    if (editBtn) editBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', (e)=>{ if(e.target===overlay) closeModal(); });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });

    if (saveBtn && form) {
      saveBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const updatedMember = {
          ...state.member,
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          phone: phoneInput ? phoneInput.value.trim() : state.member.phone,
          level: levelInput.value.trim(),
          specialty: specialtyInput.value.trim(),
          bio: bioInput ? bioInput.value.trim() : state.member.bio
        };
        state.member = updatedMember;
        saveState(state);
        initProfile();
        closeModal();
        showToast('Profile saved', 'success');
        // Persist to backend (name, level, specialty)
        fetch(`${API_BASE}/api/auth/me`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify({
            name: updatedMember.name,
            level: updatedMember.level,
            specialty: updatedMember.specialty
          })
        }).catch(()=>{});
      });
    }

    // Avatar upload
    const avatarBtn = document.getElementById('avatarEditBtn');
    const avatarInput = document.getElementById('avatarFileInput');
    if (avatarBtn && avatarInput) {
      avatarBtn.addEventListener('click', () => avatarInput.click());
      avatarInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          state.member = { ...state.member, avatar: reader.result };
          saveState(state);
          initProfile();
          showToast('Avatar updated', 'success');
        };
        reader.readAsDataURL(file);
      });
    }
  }

  // Add project button handler
  function initAddProject() {
    const addBtn = document.getElementById('addProjectBtn');
    const overlay = document.getElementById('projectModalOverlay');
    const closeBtn = document.getElementById('projectModalClose');
    const cancelBtn = document.getElementById('projectCancelBtn');
    const saveBtn = document.getElementById('projectSaveBtn');
    const form = document.getElementById('projectForm');
    const titleInput = document.getElementById('projTitle');
    const descInput = document.getElementById('projDesc');
    const progInput = document.getElementById('projProgress');
    const teamInput = document.getElementById('projTeam');
    const deadlineInput = document.getElementById('projDeadline');

    function openModal(){ if(overlay){ overlay.style.display='flex'; setTimeout(()=>overlay.classList.add('open'), 10);} }
    function closeModal(){ if(overlay){ overlay.classList.remove('open'); setTimeout(()=>{ overlay.style.display='none'; },150);} }

    if (addBtn) addBtn.addEventListener('click', () => {
      // Reset form defaults
      if (form) form.reset();
      const today = new Date().toISOString().slice(0,10);
      deadlineInput.value = today;
      deadlineInput.min = today;
      openModal();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', (e)=>{ if(e.target===overlay) closeModal(); });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });

    if (saveBtn && form) {
      saveBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const title = titleInput.value.trim();
        const description = descInput.value.trim();
        const progress = Math.max(0, Math.min(100, parseInt(progInput.value, 10)));
        const teamSize = Math.max(1, parseInt(teamInput.value, 10) || 1);
        const deadline = deadlineInput.value || new Date().toISOString().slice(0,10);
        state.projects.unshift({ title, description, status: progress>=100?'completed':'active', progress, teamSize, deadline });
        saveState(state);
        renderProjects();
        closeModal();
        showToast('Project created', 'success');
      });
    }
  }

  // Open project modal populated for edit
  function openProjectModalForEdit(index){
    const overlay = document.getElementById('projectModalOverlay');
    const closeBtn = document.getElementById('projectModalClose');
    const cancelBtn = document.getElementById('projectCancelBtn');
    const saveBtn = document.getElementById('projectSaveBtn');
    const form = document.getElementById('projectForm');
    const titleInput = document.getElementById('projTitle');
    const descInput = document.getElementById('projDesc');
    const progInput = document.getElementById('projProgress');
    const teamInput = document.getElementById('projTeam');
    const deadlineInput = document.getElementById('projDeadline');
    if (!overlay || !form) return;
    const p = state.projects[index];
    if (!p) return;
    titleInput.value = p.title;
    descInput.value = p.description;
    progInput.value = p.progress;
    teamInput.value = p.teamSize;
    deadlineInput.value = p.deadline;
    const today = new Date().toISOString().slice(0,10);
    deadlineInput.min = today;
    overlay.style.display='flex'; setTimeout(()=>overlay.classList.add('open'), 10);
    saveBtn.onclick = (e)=>{
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const title = titleInput.value.trim();
      const description = descInput.value.trim();
      const progress = Math.max(0, Math.min(100, parseInt(progInput.value, 10)));
      const teamSize = Math.max(1, parseInt(teamInput.value, 10) || 1);
      const deadline = deadlineInput.value || today;
      state.projects[index] = { ...p, title, description, progress, teamSize, deadline, status: progress>=100?'completed':'active' };
      saveState(state);
      renderProjects();
      overlay.classList.remove('open'); setTimeout(()=>{ overlay.style.display='none'; },150);
      showToast('Project updated', 'success');
    }
    if (closeBtn) closeBtn.onclick = ()=>{ overlay.classList.remove('open'); setTimeout(()=>{ overlay.style.display='none'; },150); };
    if (cancelBtn) cancelBtn.onclick = ()=>{ overlay.classList.remove('open'); setTimeout(()=>{ overlay.style.display='none'; },150); };
  }

  // Toast utility
  function ensureToastContainer(){ let c=document.querySelector('.toast-container'); if(!c){ c=document.createElement('div'); c.className='toast-container'; document.body.appendChild(c);} return c; }
  function showToast(message, type){
    const c = ensureToastContainer();
    const el = document.createElement('div');
    el.className = `toast ${type||'success'}`;
    el.innerHTML = `<i class="fa-solid ${type==='error'?'fa-circle-xmark':'fa-circle-check'}"></i><span>${message}</span><button class="close" aria-label="Close">&times;</button>`;
    c.appendChild(el);
    const remove = ()=>{ el.style.opacity='0'; setTimeout(()=>el.remove(), 200); };
    el.querySelector('.close').addEventListener('click', remove);
    setTimeout(remove, 3000);
  }

  // Import/Export handlers
  function initImportExport() {
    const exportBtn = document.getElementById('exportDataBtn');
    const importBtn = document.getElementById('importDataBtn');
    const fileInput = document.getElementById('importFileInput');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const dataStr = JSON.stringify(state, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'emta-dashboard-data.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      });
    }
    if (importBtn && fileInput) {
      importBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(reader.result);
            // basic validation
            if (!parsed || typeof parsed !== 'object') throw new Error('Invalid JSON');
            state = {
              member: parsed.member || state.member,
              upcoming: Array.isArray(parsed.upcoming) ? parsed.upcoming : state.upcoming,
              projects: Array.isArray(parsed.projects) ? parsed.projects : state.projects,
              activities: Array.isArray(parsed.activities) ? parsed.activities : state.activities,
              achievements: Array.isArray(parsed.achievements) ? parsed.achievements : state.achievements,
            };
            saveState(state);
            // re-render
            initProfile();
            renderUpcomingEvents();
            renderProjects();
            renderActivities();
            renderAchievements();
            alert('Import successful.');
          } catch (err) {
            alert('Failed to import JSON.');
          }
          fileInput.value = '';
        };
        reader.readAsText(file);
      });
    }
  }

  // Initialize everything
  function init() {
    initProfile();
    renderUpcomingEvents();
    renderProjects();
    renderActivities();
    renderAchievements();
    initCounters();
    initEditProfile();
    initAddProject();
    initImportExport();
    initDeleteModalBindings();
    // Fetch latest profile from backend and refresh UI
    loadProfileFromAPI().then(()=>{ try { initProfile(); } catch(_) {} });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


