(function(){
  'use strict';

  const TOKEN_KEY = 'emta_token';
  const API_BASE = (typeof window!=='undefined'&&window.API_BASE) || (function(){ try { return localStorage.getItem('emta_api_base'); } catch { return null; } })() || 'http://127.0.0.1:5000';

  function getToken(){
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  }

  async function fetchJSON(url, opts={}){
    const res = await fetch(url, opts);
    const data = await res.json().catch(()=>({}));
    if(!res.ok){
      const msg = data && (data.error || data.message);
      throw new Error(msg || ('HTTP '+res.status));
    }
    return data;
  }

  function fmtDate(iso){
    if(!iso) return '';
    try { return new Date(iso).toLocaleString(); } catch { return iso; }
  }

  // Modal confirm utility
  function confirmModal(message='Are you sure?', confirmText='Delete'){
    return new Promise((resolve)=>{
      const overlay = document.getElementById('confirmOverlay');
      const msgEl = document.getElementById('confirmMessage');
      const btnOk = document.getElementById('confirmOk');
      const btnCancel = document.getElementById('confirmCancel');
      const btnClose = document.getElementById('confirmClose');
      if(!overlay){ resolve(window.confirm(message)); return; }
      msgEl.textContent = message;
      btnOk.textContent = confirmText;
      overlay.style.display = 'flex';
      requestAnimationFrame(()=> overlay.classList.add('open'));
      const cleanup = ()=>{
        overlay.classList.remove('open');
        setTimeout(()=>{ overlay.style.display='none'; }, 150);
        btnOk.removeEventListener('click', onOk);
        btnCancel.removeEventListener('click', onCancel);
        btnClose.removeEventListener('click', onCancel);
      };
      const onOk = ()=>{ cleanup(); resolve(true); };
      const onCancel = ()=>{ cleanup(); resolve(false); };
      btnOk.addEventListener('click', onOk);
      btnCancel.addEventListener('click', onCancel);
      btnClose.addEventListener('click', onCancel);
    });
  }

  function setAdminMeta(user){
    const meta = document.getElementById('adminMeta');
    if(!meta || !user) return;
    meta.textContent = `Signed in as ${user.name} (${user.email})`;
  }

  function renderTableBody(tbody, rows, cols){
    if(!tbody) return;
    tbody.innerHTML = rows.map(r => {
      const tds = cols.map(c => `<td>${(r[c]!==undefined && r[c]!==null)? String(r[c]) : ''}</td>`).join('');
      return `<tr>${tds}</tr>`;
    }).join('');
  }

  function renderUsers(tbody, items, me){
    const cols = ['id','name','email','registration','level','specialty','created'];
    if(!tbody) return;
    tbody.innerHTML = items.map(u => {
      const isSelf = me && me.email && (String(u.email).toLowerCase() === String(me.email).toLowerCase());
      return `<tr data-id="${u.id}">
        <td>${u.id}</td>
        <td contenteditable="true" data-field="name">${u.name||''}</td>
        <td>${u.email||''}</td>
        <td>${u.registration||''}</td>
        <td contenteditable="true" data-field="level">${u.level||''}</td>
        <td contenteditable="true" data-field="specialty">${u.specialty||''}</td>
        <td>${fmtDate(u.created_at)}</td>
        <td>
          <button class="btn btn-sm btn-outline btn-icon" data-action="edit"><i class="fa-solid fa-pen"></i><span>Edit</span></button>
          <button class="btn btn-sm btn-primary btn-icon" data-action="save"><i class="fa-solid fa-floppy-disk"></i><span>Save</span></button>
          <button class="btn btn-sm btn-danger btn-icon" data-action="delete" ${isSelf? 'disabled':''}><i class="fa-solid fa-trash"></i><span>Delete</span></button>
        </td>
      </tr>`;
    }).join('');
  }

  function attachUserActions(tbody, token){
    tbody.addEventListener('click', async (e)=>{
      const btn = e.target.closest('button[data-action]');
      if(!btn) return;
      const tr = btn.closest('tr');
      const id = Number(tr?.getAttribute('data-id'));
      if(!id) return;
      const action = btn.getAttribute('data-action');
      if(action==='edit'){
        const firstEditable = tr.querySelector('[data-field]');
        tr.classList.add('editing');
        if(firstEditable){
          firstEditable.focus();
          document.getSelection()?.selectAllChildren(firstEditable);
        }
        return;
      }
      if(action==='save'){
        const name = tr.querySelector('[data-field="name"]').textContent.trim();
        const level = tr.querySelector('[data-field="level"]').textContent.trim();
        const specialty = tr.querySelector('[data-field="specialty"]').textContent.trim();
        try{
          await fetch(`${API_BASE}/api/admin/users/${id}`, {
            method:'PUT', headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ name, level, specialty })
          }).then(r=>{ if(!r.ok) throw new Error('Update failed'); });
          alert('Saved');
          tr.classList.remove('editing');
        }catch(err){ alert(err.message||'Error'); }
      } else if(action==='delete'){
        const ok = await confirmModal('Delete this user?','Delete');
        if(!ok) return;
        try{
          await fetch(`${API_BASE}/api/admin/users/${id}`, {
            method:'DELETE', headers:{ 'Authorization': `Bearer ${token}` }
          }).then(r=>{ if(!r.ok) throw new Error('Delete failed'); });
          tr.remove();
        }catch(err){ alert(err.message||'Error'); }
      }
    });
  }

  // Simple sorting for users table
  function makeUsersSortable(table){
    if(!table) return;
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const headers = Array.from(thead.querySelectorAll('th'));
    headers.forEach((th, idx)=>{
      if(idx === headers.length-1) return; // skip Actions
      th.classList.add('sortable');
      th.addEventListener('click', ()=>{
        const current = th.classList.contains('asc') ? 'asc' : th.classList.contains('desc') ? 'desc' : null;
        headers.forEach(h=> h.classList.remove('asc','desc'));
        const nextDir = current === 'asc' ? 'desc' : 'asc';
        th.classList.add(nextDir);
        const rows = Array.from(tbody.querySelectorAll('tr'));
        rows.sort((a,b)=>{
          const av = a.children[idx].textContent.trim().toLowerCase();
          const bv = b.children[idx].textContent.trim().toLowerCase();
          if(av===bv) return 0;
          const res = av < bv ? -1 : 1;
          return nextDir==='asc' ? res : -res;
        });
        tbody.innerHTML='';
        rows.forEach(r=> tbody.appendChild(r));
      });
    });
  }

  // Search/filter for users table
  function initUsersSearch(){
    const input = document.getElementById('usersSearch');
    const tbody = document.querySelector('#usersTable tbody');
    if(!input || !tbody) return;
    input.addEventListener('input', ()=>{
      const q = input.value.trim().toLowerCase();
      tbody.querySelectorAll('tr').forEach(tr=>{
        const text = tr.textContent.toLowerCase();
        tr.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  // Export utilities
  function tableToCSV(table){
    const rows = Array.from(table.querySelectorAll('tr'));
    return rows.map(tr => Array.from(tr.children).map(td => {
      const t = td.textContent.replace(/\"/g,'""');
      return '"'+t+'"';
    }).join(',')).join('\r\n');
  }
  function downloadBlob(content, filename, type){
    const blob = new Blob([content], {type});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(()=> URL.revokeObjectURL(a.href), 1000);
  }
  function initUsersExport(){
    const table = document.getElementById('usersTable');
    const btnCsv = document.getElementById('exportUsersCsv');
    const btnXls = document.getElementById('exportUsersXls');
    if(btnCsv){ btnCsv.addEventListener('click', ()=>{
      const csv = tableToCSV(table);
      downloadBlob(csv, 'users.csv', 'text/csv;charset=utf-8;');
    }); }
    if(btnXls){ btnXls.addEventListener('click', ()=>{
      // Simple Excel-compatible HTML table
      const html = `\uFEFF<table>${table.querySelector('thead').outerHTML}${table.querySelector('tbody').outerHTML}</table>`;
      downloadBlob(html, 'users.xls', 'application/vnd.ms-excel');
    }); }
  }

  async function loadData(){
    const token = getToken();
    if(!token){
      window.location.href = 'login.html?redirect=admin.html';
      return;
    }

    // Check admin
    let me;
    try{
      const meResp = await fetchJSON(`${API_BASE}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      me = meResp.user;
      setAdminMeta(me);
      if(!me || !me.is_admin){
        alert('Admin only');
        window.location.href = 'index.html';
        return;
      }
    } catch(err){
      console.error(err);
      window.location.href = 'login.html?redirect=admin.html';
      return;
    }

    // Fetch all admin data in parallel
    try{
      const [users, apps, msgs] = await Promise.all([
        fetchJSON(`${API_BASE}/api/admin/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetchJSON(`${API_BASE}/api/admin/applications`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetchJSON(`${API_BASE}/api/admin/messages`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      // Users
      const usersTable = document.getElementById('usersTable') || document.querySelector('#usersTable');
      const usersTbody = usersTable.querySelector('tbody');
      renderUsers(usersTbody, (users.items||[]), me);
      attachUserActions(usersTbody, token);
      makeUsersSortable(usersTable);
      initUsersSearch();
      initUsersExport();

      // Applications
      const appsTbody = document.querySelector('#appsTable tbody');
      appsTbody.innerHTML = (apps.items||[]).map(a=>`
        <tr data-id="${a.id}">
          <td>${a.id}</td>
          <td>${a.name||''}</td>
          <td>${a.email||''}</td>
          <td>${a.registration||''}</td>
          <td>${a.level||''}</td>
          <td>${a.specialty||''}</td>
          <td>${(a.message||'').replace(/</g,'&lt;')}</td>
          <td>${fmtDate(a.created_at)}</td>
          <td><button class="btn btn-sm" data-app-id="${a.id}" disabled>—</button></td>
        </tr>`).join('');

      // Messages
      const msgsTbody = document.querySelector('#msgsTable tbody');
      const msgsRows = (msgs.items||[]).map(m=>({
        id: m.id,
        name: m.name,
        email: m.email,
        subject: m.subject,
        phone: m.phone || '',
        message: m.message,
        created: fmtDate(m.created_at)
      }));
      renderTableBody(msgsTbody, msgsRows, ['id','name','email','subject','phone','message','created']);
    } catch(err){
      console.error(err);
      alert('Failed to load admin data');
    }

    // Admin password change
    const formPwd = document.getElementById('adminPasswordForm');
    if(formPwd){
      formPwd.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const current_password = document.getElementById('currentPassword').value.trim();
        const new_password = document.getElementById('newPassword').value.trim();
        if(!current_password || !new_password){ alert('Fill both fields'); return; }
        try{
          await fetch(`${API_BASE}/api/admin/change_password`, {
            method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ current_password, new_password })
          }).then(async r=>{ const d=await r.json().catch(()=>({})); if(!r.ok||!d.ok) throw new Error(d.error||'Change password failed'); });
          alert('Password changed');
          formPwd.reset();
        } catch(err){ alert(err.message||'Error'); }
      });
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', loadData);
  } else {
    loadData();
  }
})();
