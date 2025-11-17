/**
 * Join Form Handler
 * Validates and processes membership application form
 */

(function() {
  'use strict';

  // Backend API base URL
  const API_BASE = (typeof window !== 'undefined' && window.API_BASE) || (function() { try { return localStorage.getItem('emta_api_base'); } catch { return null; } })() || 'http://127.0.0.1:5000';

  function showMessage(message, type = 'info') {
    // Create a more user-friendly notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      animation: slideIn 0.3s ease;
      max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateUniversityEmail(email) {
    // Allow any domain (university domain not required)
    return true;
  }
  

  function validateRegistrationNumber(regNum) {
    const regRegex = /^[0-9]{8,12}$/;
    return regRegex.test(regNum);
  }

  // Calculate form completion percentage
  function calculateProgress() {
    const form = document.getElementById("joinForm");
    if (!form) return 0;

    const requiredFields = form.querySelectorAll('input[required], textarea[required], select[required]');
    let filledFields = 0;

    requiredFields.forEach(field => {
      if (field.tagName === 'SELECT') {
        if (field.value !== '') filledFields++;
      } else if (field.value.trim() !== '') {
        filledFields++;
      }
    });

    return Math.round((filledFields / requiredFields.length) * 100);
  }

  // Update progress bar
  function updateProgress() {
    const progress = calculateProgress();
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (progressText) {
      progressText.textContent = `${progress}% Complete`;
    }
  }

  // Specialty options based on academic level
  const specialtyOptions = {
    'L1': [
      { value: 'ST', label: 'ST (Science and Technology)' },
      { value: 'INFO', label: 'Informatique' }
    ],
    'L2': [
      { value: 'AUT', label: 'Automatique (AUT)' },
      { value: 'ELM-TECH', label: 'Electrotechnique (ELM)' },
      { value: 'ELM-MEC', label: 'Electromécanique (ELM)' },
      { value: 'INFO', label: 'Informatique' }
    ],
    'L3': [
      { value: 'AUT', label: 'Automatique (AUT)' },
      { value: 'ELM-TECH', label: 'Electrotechnique (ELM)' },
      { value: 'ELM-MEC', label: 'Electromécanique (ELM)' },
      { value: 'INFO', label: 'Informatique' }
    ],
    'LP1-Pro': [
      { value: 'PRE', label: 'Protection des Réseaux Electriques' },
      { value: 'INFO', label: 'Informatique' }
    ],
    'LP2-Pro': [
      { value: 'PRE', label: 'Protection des Réseaux Electriques' },
      { value: 'INFO', label: 'Informatique' }
    ],
    'LP3-Pro': [
      { value: 'PRE', label: 'Protection des Réseaux Electriques' },
      { value: 'INFO', label: 'Informatique' }
    ],
    'M1': [
      { value: 'AII', label: 'AII (Automatique et Informatique Industrielle)' },
      { value: 'ELM-MEC', label: 'Electromécanique (ELM)' },
      { value: 'RE', label: 'Réseaux Électrique (RE)' },
      { value: 'INFO', label: 'Informatique' }
    ],
    'M2': [
      { value: 'AII', label: 'AII (Automatique et Informatique Industrielle)' },
      { value: 'ELM-MEC', label: 'Electromécanique (ELM)' },
      { value: 'RE', label: 'Réseaux Électrique (RE)' },
      { value: 'INFO', label: 'Informatique' }
    ]
  };

  // Update specialty options based on selected level
  function updateSpecialtyOptions() {
    const levelSelect = document.getElementById('level');
    const specialtySelect = document.getElementById('specialty');
    
    if (!levelSelect || !specialtySelect) return;

    const selectedLevel = levelSelect.value;
    
    // Clear existing options
    specialtySelect.innerHTML = '<option value="">Select your specialty</option>';
    
      // Add options based on selected level
      if (selectedLevel && specialtyOptions[selectedLevel]) {
        specialtyOptions[selectedLevel].forEach(option => {
          const optionElement = document.createElement('option');
          optionElement.value = option.value;
          optionElement.textContent = option.label;
          specialtySelect.appendChild(optionElement);
        });
        
        // Enable specialty select and hide hint
        specialtySelect.disabled = false;
        specialtySelect.style.opacity = '1';
        specialtySelect.closest('.form-group').style.display = 'block';
        const hint = specialtySelect.closest('.form-group').querySelector('.field-hint');
        if (hint) hint.style.display = 'none';
        
        // Add smooth transition
        specialtySelect.style.transition = 'opacity 0.3s ease';
      } else {
        // Disable specialty select and show hint
        specialtySelect.disabled = true;
        specialtySelect.value = '';
        specialtySelect.style.opacity = '0.5';
        const hint = specialtySelect.closest('.form-group').querySelector('.field-hint');
        if (hint) hint.style.display = 'block';
      }
    
    updateProgress();
  }

  // Initialize specialty field handler
  function initSpecialtyField() {
    const levelSelect = document.getElementById('level');
    if (!levelSelect) return;

    // Listen for level changes
    levelSelect.addEventListener('change', updateSpecialtyOptions);
    
    // Initial update
    updateSpecialtyOptions();
  }

  // Character counter for textarea
  function initCharacterCounter() {
    const textarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    const charCountContainer = charCount?.parentElement;

    if (!textarea || !charCount) return;

    const maxLength = 500;

    textarea.addEventListener('input', () => {
      const length = textarea.value.length;
      charCount.textContent = length;

      if (charCountContainer) {
        charCountContainer.classList.remove('warning', 'error');
        
        if (length > maxLength * 0.9) {
          charCountContainer.classList.add('warning');
        }
        
        if (length > maxLength) {
          charCountContainer.classList.add('error');
          textarea.setCustomValidity('Message is too long (max 500 characters)');
        } else {
          textarea.setCustomValidity('');
        }
      }
    });

    // Set maxlength attribute
    textarea.setAttribute('maxlength', maxLength);
  }

  function initJoinForm() {
    const form = document.getElementById("joinForm");
    if (!form) return;

    // Initialize specialty field
    initSpecialtyField();

    // Initialize character counter
    initCharacterCounter();

    // Add input validation feedback and progress tracking
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      // Validation feedback
      input.addEventListener('blur', () => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          input.style.borderColor = '#ef4444';
        } else {
          input.style.borderColor = '';
        }
        updateProgress();
      });

      input.addEventListener('input', () => {
        if (input.style.borderColor === 'rgb(239, 68, 68)') {
          input.style.borderColor = '';
        }
        updateProgress();
      });

      // Special validation for registration number
      if (input.id === 'registration') {
        input.addEventListener('blur', () => {
          const value = input.value.trim();
          if (value && !validateRegistrationNumber(value)) {
            input.style.borderColor = '#ef4444';
            input.setCustomValidity('Registration number must be 8-12 digits');
          } else {
            input.setCustomValidity('');
          }
        });
      }
    });

    // Initial progress update
    updateProgress();

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const registration = form.registration.value.trim();
      const level = form.level.value;
      const specialty = form.specialty.value;
      const message = form.message.value.trim();

      // Validation
      if (!name || !email || !registration || !level || !specialty || !message) {
        showMessage("⚠️ Please fill in all fields.", "error");
        return;
      }

      if (!validateEmail(email)) {
        showMessage("📧 Please enter a valid email address.", "error");
        form.email.focus();
        return;
      }

      // University email not required; skipping domain enforcement

      if (!validateRegistrationNumber(registration)) {
        showMessage("🆔 Please enter a valid registration number (8-12 digits).", "error");
        form.registration.focus();
        return;
      }

      // Real API submission
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      // 1) Sign up the user (password = registration). If exists, login.
      const TOKEN_KEY = 'emta_token';
      const signup = () => fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, registration, level, specialty })
      });
      const login = () => fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: registration })
      });

      signup()
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.token) { localStorage.setItem(TOKEN_KEY, data.token); return true; }
          if (res.status === 409) return false; // already exists -> login next
          const errMsg = data && data.error ? data.error : `Signup failed (${res.status})`;
          throw new Error(errMsg);
        })
        .then(async (signedUp) => {
          if (!signedUp) {
            const res = await login();
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.token) throw new Error(data.error || `Login failed (${res.status})`);
            localStorage.setItem(TOKEN_KEY, data.token);
          }
          // If admin, skip application and go to admin page
          try {
            const token = localStorage.getItem(TOKEN_KEY);
            const meRes = await fetch(`${API_BASE}/api/auth/me`, { headers: { 'Authorization': `Bearer ${token}` } });
            const meData = await meRes.json().catch(()=>({}));
            if (meRes.ok && meData && meData.user && meData.user.is_admin) {
              showMessage(`🔐 Welcome admin ${name}. Redirecting to Admin...`, 'success');
              setTimeout(()=>{ window.location.href = 'admin.html'; }, 600);
              return null; // signal to skip application
            }
          } catch(_) { /* fall through to application */ }
          // Fallback: if email matches fixed admin email, redirect directly
          if ((email||'').trim().toLowerCase() === 'abdou.temaini@gmail.com') {
            showMessage(`🔐 Welcome admin ${name}. Redirecting to Admin...`, 'success');
            setTimeout(()=>{ window.location.href = 'admin.html'; }, 600);
            return null;
          }
          // 2) Submit member application for normal users
          const res2 = await fetch(`${API_BASE}/api/members/apply`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, registration, level, specialty, message })
          });
          const data2 = await res2.json().catch(() => ({}));
          if (!res2.ok) throw new Error(data2 && data2.error ? data2.error : `Request failed (${res2.status})`);
          return data2;
        })
        .then(async () => {
          showMessage(`✅ Thank you, ${name}! Your application has been received.`, 'success');
          form.reset();
          updateProgress();
          // No automatic dashboard redirect for members; they stay on public pages
        })
        .catch((err) => {
          showMessage(`❌ Failed to submit: ${err.message || 'Network error'}`, 'error');
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJoinForm);
  } else {
    initJoinForm();
  }

  // Add CSS for animations
  if (!document.getElementById('join-animations')) {
    const style = document.createElement('style');
    style.id = 'join-animations';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
})();
