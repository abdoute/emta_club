(function(){
  'use strict';

  const API_BASE = (typeof window!=='undefined'&&window.API_BASE) || (function(){ try { return localStorage.getItem('emta_api_base'); } catch { return null; } })() || 'http://127.0.0.1:5000';
  const TOKEN_KEY = 'emta_token';

  function showToast(msg, type='info'){
    const el = document.createElement('div');
    el.className = `notification notification-${type}`;
    el.textContent = msg;
    el.style.cssText = `position: fixed; top: 100px; right: 20px; background: ${type==='success'?'#10b981': type==='error'?'#ef4444':'#3b82f6'}; color: #fff; padding: 12px 16px; border-radius: 8px; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,.3);`;
    document.body.appendChild(el);
    setTimeout(()=>{ el.style.opacity='0'; setTimeout(()=>el.remove(), 250); }, 3000);
  }

  function init(){
    const form = document.getElementById('loginForm');
    const emailEl = document.getElementById('loginEmail');
    const passEl = document.getElementById('loginPassword');
    const toggle = document.getElementById('togglePassword');
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');

    if(toggle){
      toggle.addEventListener('click', ()=>{
        const isPwd = passEl.getAttribute('type') === 'password';
        passEl.setAttribute('type', isPwd ? 'text' : 'password');
        toggle.querySelector('i').className = `fa-solid ${isPwd ? 'fa-eye-slash':'fa-eye'}`;
      });
    }

    if(!form) return;
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = (emailEl.value||'').trim();
      const password = (passEl.value||'').trim();
      if(!email || !password){
        const msg = (window.EMTA_I18N && typeof window.EMTA_I18N.t === 'function')
          ? window.EMTA_I18N.t('login_required')
          : 'Email and password are required';
        showToast(msg,'error');
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const original = btn.querySelector('.btn-text');
      const originalText = original ? original.textContent : btn.textContent;
      btn.disabled = true;
      const signingText = (window.EMTA_I18N && typeof window.EMTA_I18N.t === 'function')
        ? window.EMTA_I18N.t('login_signing_in')
        : 'Signing in...';
      if(original) original.textContent = signingText; else btn.textContent = signingText;

      fetch(`${API_BASE}/api/auth/login`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      })
      .then(async (res)=>{ const data = await res.json().catch(()=>({})); if(!res.ok){ throw new Error(data.error||`Login failed (${res.status})`);} return data; })
      .then(async (data)=>{
        if(data && data.token){ localStorage.setItem(TOKEN_KEY, data.token); }
        const msgOk = (window.EMTA_I18N && typeof window.EMTA_I18N.t === 'function')
          ? window.EMTA_I18N.t('login_success')
          : 'Logged in successfully';
        showToast(msgOk,'success');
        // This login page is reserved for admins; always send to admin panel
        try {
          const token = localStorage.getItem(TOKEN_KEY);
          const resMe = await fetch(`${API_BASE}/api/auth/me`, { headers: { 'Authorization': `Bearer ${token}` } });
          const me = await resMe.json().catch(()=>({}));
          const isAdmin = !!(me && me.user && me.user.is_admin);
          if (!isAdmin) {
            const msg = (window.EMTA_I18N && typeof window.EMTA_I18N.t === 'function')
              ? window.EMTA_I18N.t('login_admin_only')
              : 'This login is reserved for admin accounts only.';
            showToast(msg,'error');
          }
        } catch(_) { /* ignore, still redirect to admin */ }
        window.location.href = 'admin.html';
      })
      .catch((err)=>{ showToast(err.message||'Network error','error'); })
      .finally(()=>{ btn.disabled=false; if(original) original.textContent=originalText; else btn.textContent=originalText; });
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
