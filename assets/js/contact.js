/**
 * Contact Page JavaScript
 * Handles contact form, FAQ, and office status
 */

(function(){
  'use strict';

  // Backend API base URL
  const API_BASE = (typeof window!=='undefined'&&window.API_BASE) || (function(){ try { return localStorage.getItem('emta_api_base'); } catch { return null; } })() || 'http://127.0.0.1:5000';

  // ===== FAQ Data =====
  const faqData = [
    {
      questionKey: "faq_join_question",
      answerKey: "faq_join_answer"
    },
    {
      questionKey: "faq_student_requirement_question",
      answerKey: "faq_student_requirement_answer"
    },
    {
      questionKey: "faq_membership_cost_question",
      answerKey: "faq_membership_cost_answer"
    },
    {
      questionKey: "faq_activities_question",
      answerKey: "faq_activities_answer"
    },
    {
      questionKey: "faq_workshop_frequency_question",
      answerKey: "faq_workshop_frequency_answer"
    },
    {
      questionKey: "faq_beginner_friendly_question",
      answerKey: "faq_beginner_friendly_answer"
    }
  ];

  // ===== Contact Form Handler =====
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Character counter for message
    const messageTextarea = document.getElementById('contactMessage');
    const charCount = document.getElementById('contactCharCount');
    const charCountContainer = charCount?.parentElement;

    if (messageTextarea && charCount) {
      const maxLength = 1000;
      messageTextarea.setAttribute('maxlength', maxLength);

      messageTextarea.addEventListener('input', () => {
        const length = messageTextarea.value.length;
        charCount.textContent = length;

        if (charCountContainer) {
          charCountContainer.classList.remove('warning', 'error');
          
          if (length > maxLength * 0.9) {
            charCountContainer.classList.add('warning');
          }
          
          if (length > maxLength) {
            charCountContainer.classList.add('error');
          }
        }
      });
    }

    // Form validation and submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.contactName.value.trim();
      const email = form.contactEmail.value.trim();
      const subject = form.contactSubject.value;
      const message = form.contactMessage.value.trim();
      const phone = (form.contactPhone && form.contactPhone.value || '').trim();

      // Validation
      if (!name || !email || !subject || !message) {
        showNotification('⚠️ Please fill in all required fields.', 'error');
        return;
      }

      if (!validateEmail(email)) {
        showNotification('📧 Please enter a valid email address.', 'error');
        form.contactEmail.focus();
        return;
      }

      // Real API submission
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.querySelector('.btn-text').textContent;
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'Sending...';

      fetch(`${API_BASE}/api/contact/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, phone, message })
      })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const errMsg = data && data.error ? data.error : `Request failed (${res.status})`;
          throw new Error(errMsg);
        }
        return data;
      })
      .then(() => {
        showNotification(`✅ Thank you, ${name}! Your message has been sent successfully. We'll get back to you soon.`, 'success');
        form.reset();
        if (charCount) charCount.textContent = '0';
      })
      .catch((err) => {
        showNotification(`❌ Failed to submit: ${err.message || 'Network error'}`, 'error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = originalText;
      });
    });
  }

  // ===== FAQ Handler =====
  function initFAQ() {
    const container = document.getElementById('faqContainer');
    if (!container) return;

    container.innerHTML = '';

    faqData.forEach((faq, index) => {
      const item = document.createElement('div');
      item.className = 'faq-item';
      item.setAttribute('data-aos', 'fade-up');
      item.setAttribute('data-aos-delay', (index * 50).toString());

      // Get translations using i18n system with fallback to keys
      const question = window.EMTA_I18N ? window.EMTA_I18N.t(faq.questionKey) : faq.questionKey;
      const answer = window.EMTA_I18N ? window.EMTA_I18N.t(faq.answerKey) : faq.answerKey;

      item.innerHTML = `
        <div class="faq-question">
          <span data-key="${faq.questionKey}">${escapeHtml(question)}</span>
          <i class="fa-solid fa-chevron-down"></i>
        </div>
        <div class="faq-answer" data-key="${faq.answerKey}">
          ${escapeHtml(answer)}
        </div>
      `;

      item.addEventListener('click', () => {
        const wasActive = item.classList.contains('active');
        
        // Close all other items
        container.querySelectorAll('.faq-item').forEach(faqItem => {
          faqItem.classList.remove('active');
        });
        
        // Toggle current item
        if (!wasActive) {
          item.classList.add('active');
        }
      });

      container.appendChild(item);
    });
  }

  // ===== Office Status =====
  function updateOfficeStatus() {
    const statusElement = document.getElementById('officeStatus');
    if (!statusElement) return;

    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();

    // Monday to Friday, 9 AM to 5 PM
    const isOpen = day >= 1 && day <= 5 && hour >= 9 && hour < 17;

    const statusParent = statusElement.parentElement;
    
    if (isOpen) {
      statusElement.textContent = (window.EMTA_I18N && typeof window.EMTA_I18N.t === 'function')
        ? window.EMTA_I18N.t('office_open')
        : 'Open Now';
      statusParent.className = 'contact-status';
      statusParent.style.background = 'rgba(16, 185, 129, 0.15)';
      statusParent.style.borderColor = 'rgba(16, 185, 129, 0.3)';
      statusParent.style.color = '#10b981';
      statusParent.querySelector('i').style.color = '#10b981';
    } else {
      statusElement.textContent = (window.EMTA_I18N && typeof window.EMTA_I18N.t === 'function')
        ? window.EMTA_I18N.t('office_closed')
        : 'Closed';
      statusParent.style.background = 'rgba(239, 68, 68, 0.15)';
      statusParent.style.borderColor = 'rgba(239, 68, 68, 0.3)';
      statusParent.style.color = '#ef4444';
      statusParent.querySelector('i').style.color = '#ef4444';
    }
  }

  // ===== Helper Functions =====
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showNotification(message, type = 'info') {
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

  // Add CSS for animations if not exists
  if (!document.getElementById('contact-animations')) {
    const style = document.createElement('style');
    style.id = 'contact-animations';
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

  // ===== Initialize =====
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initContactForm();
        initFAQ();
        updateOfficeStatus();
        
        // Update status every minute
        setInterval(updateOfficeStatus, 60000);
      });
    } else {
      initContactForm();
      initFAQ();
      updateOfficeStatus();
      setInterval(updateOfficeStatus, 60000);
    }
  }

  init();
})();




