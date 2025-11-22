(function(){
  'use strict';

  const TOKEN_KEY = 'emta_token';
  const API_BASE = (typeof window!=='undefined'&&window.API_BASE) || (function(){ try { return localStorage.getItem('emta_api_base'); } catch { return null; } })() || 'http://127.0.0.1:5000';

  function getToken(){
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  }

  // Applications actions: edit/save/delete
  function attachAppActions(tbody, token){
    if(!tbody) return;
    tbody.addEventListener('click', async (e)=>{
      const btn = e.target.closest('button[data-action]');
      if(!btn) return;
      const tr = btn.closest('tr');
      const id = Number(tr?.getAttribute('data-id'));
      const action = btn.getAttribute('data-action');
      if(!id) return;
      if(action==='app-edit'){
        const firstEditable = tr.querySelector('[data-field]');
        tr.classList.add('editing');
        if(firstEditable){ firstEditable.focus(); document.getSelection()?.selectAllChildren(firstEditable); }
        return;
      }
      if(action==='app-save'){
        const payload = {
          name: tr.querySelector('[data-field="name"]').textContent.trim(),
          email: tr.querySelector('[data-field="email"]').textContent.trim(),
          registration: tr.querySelector('[data-field="registration"]').textContent.trim(),
          level: tr.querySelector('[data-field="level"]').textContent.trim(),
          specialty: tr.querySelector('[data-field="specialty"]').textContent.trim(),
          message: tr.querySelector('[data-field="message"]').textContent.trim(),
        };
        try{
          await fetch(`${API_BASE}/api/admin/applications/${id}`, {
            method:'PUT', headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
          }).then(r=>{ if(!r.ok) throw new Error('Update failed'); });
          alert('Application saved');
          tr.classList.remove('editing');
        }catch(err){ alert(err.message||'Error'); }
        return;
      }
      if(action==='app-delete'){
        const ok = await confirmModal('Delete this application?','Delete');
        if(!ok) return;
        try{
          await fetch(`${API_BASE}/api/admin/applications/${id}`, {
            method:'DELETE', headers:{ 'Authorization': `Bearer ${token}` }
          }).then(r=>{ if(!r.ok) throw new Error('Delete failed'); });
          tr.remove();
        }catch(err){ alert(err.message||'Error'); }
        return;
      }
    });
  }

  // Manual add for applications (uses public apply endpoint)
  function initAddAppForm(){
    const btn = document.getElementById('addAppSubmit');
    const form = document.getElementById('addAppForm');
    if(!btn || !form) return;
    btn.addEventListener('click', async ()=>{
      const name = document.getElementById('addAppName')?.value.trim() || '';
      const email = document.getElementById('addAppEmail')?.value.trim() || '';
      const registration = document.getElementById('addAppRegistration')?.value.trim() || '';
      const level = document.getElementById('addAppLevel')?.value.trim() || '';
      const specialty = document.getElementById('addAppSpecialty')?.value.trim() || '';
      const message = document.getElementById('addAppMessage')?.value.trim() || '';
      if(!name || !email || !registration || !level || !specialty){
        alert('Please fill Name, Email, Registration, Level, and Specialty');
        return;
      }
      try{
        await fetchJSON(`${API_BASE}/api/members/apply`, {
          method:'POST', headers:{ 'Content-Type':'application/json' },
          body: JSON.stringify({ name, email, registration, level, specialty, message })
        });
        alert('Application added');
        form.reset();
        window.location.reload();
      } catch(err){
        alert(err.message || 'Failed to add application');
      }
    });
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
    if(btnCsv && table){ btnCsv.addEventListener('click', ()=>{
      const csv = tableToCSV(table);
      downloadBlob(csv, 'users.csv', 'text/csv;charset=utf-8;');
    }); }
    if(btnXls && table){ btnXls.addEventListener('click', ()=>{
      const html = `\uFEFF<table>${table.querySelector('thead').outerHTML}${table.querySelector('tbody').outerHTML}</table>`;
      downloadBlob(html, 'users.xls', 'application/vnd.ms-excel');
    }); }
  }

  function initAppsExport(){
    const table = document.getElementById('appsTable');
    const btnCsv = document.getElementById('exportAppsCsv');
    const btnXls = document.getElementById('exportAppsXls');
    if(btnCsv && table){ btnCsv.addEventListener('click', ()=>{
      const csv = tableToCSV(table);
      downloadBlob(csv, 'applications.csv', 'text/csv;charset=utf-8;');
    }); }
    if(btnXls && table){ btnXls.addEventListener('click', ()=>{
      const html = `\uFEFF<table>${table.querySelector('thead').outerHTML}${table.querySelector('tbody').outerHTML}</table>`;
      downloadBlob(html, 'applications.xls', 'application/vnd.ms-excel');
    }); }
  }

  function initMsgsExport(){
    const table = document.getElementById('msgsTable');
    const btnCsv = document.getElementById('exportMsgsCsv');
    const btnXls = document.getElementById('exportMsgsXls');
    if(btnCsv && table){ btnCsv.addEventListener('click', ()=>{
      const csv = tableToCSV(table);
      downloadBlob(csv, 'messages.csv', 'text/csv;charset=utf-8;');
    }); }
    if(btnXls && table){ btnXls.addEventListener('click', ()=>{
      const html = `\uFEFF<table>${table.querySelector('thead').outerHTML}${table.querySelector('tbody').outerHTML}</table>`;
      downloadBlob(html, 'messages.xls', 'application/vnd.ms-excel');
    }); }
  }

  // Basic CSV parser compatible with tableToCSV output
  function parseCSV(text){
    const rows = [];
    let cur = '';
    let inQuotes = false;
    let row = [];
    for(let i=0;i<text.length;i++){
      const c = text[i];
      if(c === '"'){
        if(inQuotes && text[i+1] === '"'){
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if(c === ',' && !inQuotes){
        row.push(cur);
        cur = '';
      } else if((c === '\n' || c === '\r') && !inQuotes){
        if(c === '\r' && text[i+1] === '\n') i++;
        row.push(cur);
        cur = '';
        if(row.length){
          if(row.some(v => v.trim() !== '')) rows.push(row);
        }
        row = [];
      } else {
        cur += c;
      }
    }
    if(cur.length || row.length){
      row.push(cur);
      if(row.some(v => v.trim() !== '')) rows.push(row);
    }
    return rows;
  }

  function initUsersImport(token){
    const btn = document.getElementById('importUsersCsvBtn');
    const input = document.getElementById('importUsersCsvInput');
    if(!btn || !input) return;
    btn.addEventListener('click', ()=> input.click());
    input.addEventListener('change', async (e)=>{
      const file = e.target.files && e.target.files[0];
      if(!file) return;
      if(!file.name.toLowerCase().endsWith('.csv')){
        alert('Please select a .csv file for users import');
        input.value = '';
        return;
      }
      try{
        const text = await file.text();
        const rows = parseCSV(text);
        if(!rows.length){ alert('CSV file is empty'); return; }
        const header = rows[0].map(h => h.trim().toLowerCase());
        const idxOf = (name) => header.indexOf(name.toLowerCase());
        const nameIdx = idxOf('name');
        const emailIdx = idxOf('email');
        const regIdx = idxOf('registration');
        const levelIdx = idxOf('level');
        const specIdx = idxOf('specialty');
        if(nameIdx === -1 || emailIdx === -1 || regIdx === -1){
          alert('CSV header must contain at least Name, Email, and Registration columns.');
          return;
        }
        if(!window.confirm('Import users from CSV? Existing users with same email/registration will be skipped if backend rejects them.')) return;
        let okCount = 0;
        let failCount = 0;
        for(let i=1;i<rows.length;i++){
          const r = rows[i];
          const name = (r[nameIdx] || '').trim();
          const email = (r[emailIdx] || '').trim();
          const registration = String(r[regIdx] || '').trim();
          const level = levelIdx !== -1 ? String(r[levelIdx] || '').trim() : '';
          const specialty = specIdx !== -1 ? String(r[specIdx] || '').trim() : '';
          if(!name && !email) continue;
          try{
            await fetchJSON(`${API_BASE}/api/auth/signup`, {
              method:'POST',
              headers:{ 'Content-Type':'application/json' },
              body: JSON.stringify({ name, email, registration, level, specialty })
            });
            okCount++;
          } catch(err){
            console.error('Import user failed', err);
            failCount++;
          }
        }
        alert(`Users import finished. Success: ${okCount}, Failed: ${failCount}.`);
        if(okCount) window.location.reload();
      } finally {
        input.value = '';
      }
    });
  }

  function initAppsImport(){
    const btn = document.getElementById('importAppsCsvBtn');
    const input = document.getElementById('importAppsCsvInput');
    if(!btn || !input) return;
    btn.addEventListener('click', ()=> input.click());
    input.addEventListener('change', async (e)=>{
      const file = e.target.files && e.target.files[0];
      if(!file) return;
      if(!file.name.toLowerCase().endsWith('.csv')){
        alert('Please select a .csv file for applications import');
        input.value = '';
        return;
      }
      try{
        const text = await file.text();
        const rows = parseCSV(text);
        if(!rows.length){ alert('CSV file is empty'); return; }
        const header = rows[0].map(h => h.trim().toLowerCase());
        const idxOf = (name) => header.indexOf(name.toLowerCase());
        const nameIdx = idxOf('name');
        const emailIdx = idxOf('email');
        const regIdx = idxOf('registration');
        const levelIdx = idxOf('level');
        const specIdx = idxOf('specialty');
        const msgIdx = idxOf('message');
        if(nameIdx === -1 || emailIdx === -1 || regIdx === -1 || levelIdx === -1 || specIdx === -1){
          alert('CSV header must contain Name, Email, Registration, Level, Specialty (and optionally Message).');
          return;
        }
        if(!window.confirm('Import member applications from CSV?')) return;
        let okCount = 0;
        let failCount = 0;
        for(let i=1;i<rows.length;i++){
          const r = rows[i];
          const name = (r[nameIdx] || '').trim();
          const email = (r[emailIdx] || '').trim();
          const registration = String(r[regIdx] || '').trim();
          const level = String(r[levelIdx] || '').trim();
          const specialty = String(r[specIdx] || '').trim();
          const message = msgIdx !== -1 ? String(r[msgIdx] || '').trim() : '';
          if(!name && !email) continue;
          try{
            await fetchJSON(`${API_BASE}/api/members/apply`, {
              method:'POST',
              headers:{ 'Content-Type':'application/json' },
              body: JSON.stringify({ name, email, registration, level, specialty, message })
            });
            okCount++;
          } catch(err){
            console.error('Import application failed', err);
            failCount++;
          }
        }
        alert(`Applications import finished. Success: ${okCount}, Failed: ${failCount}.`);
        if(okCount) window.location.reload();
      } finally {
        input.value = '';
      }
    });
  }

  function initMsgsImport(){
    const btn = document.getElementById('importMsgsCsvBtn');
    const input = document.getElementById('importMsgsCsvInput');
    if(!btn || !input) return;
    btn.addEventListener('click', ()=> input.click());
    input.addEventListener('change', async (e)=>{
      const file = e.target.files && e.target.files[0];
      if(!file) return;
      if(!file.name.toLowerCase().endsWith('.csv')){
        alert('Please select a .csv file for messages import');
        input.value = '';
        return;
      }
      try{
        const text = await file.text();
        const rows = parseCSV(text);
        if(!rows.length){ alert('CSV file is empty'); return; }
        const header = rows[0].map(h => h.trim().toLowerCase());
        const idxOf = (name) => header.indexOf(name.toLowerCase());
        const nameIdx = idxOf('name');
        const emailIdx = idxOf('email');
        const subjectIdx = idxOf('subject');
        const phoneIdx = idxOf('phone');
        const msgIdx = idxOf('message');
        if(nameIdx === -1 || emailIdx === -1 || subjectIdx === -1 || msgIdx === -1){
          alert('CSV header must contain Name, Email, Subject, Message (and optionally Phone).');
          return;
        }
        if(!window.confirm('Import contact messages from CSV?')) return;
        let okCount = 0;
        let failCount = 0;
        for(let i=1;i<rows.length;i++){
          const r = rows[i];
          const name = (r[nameIdx] || '').trim();
          const email = (r[emailIdx] || '').trim();
          const subject = String(r[subjectIdx] || '').trim();
          const phone = phoneIdx !== -1 ? String(r[phoneIdx] || '').trim() : '';
          const message = String(r[msgIdx] || '').trim();
          if(!name && !email && !message) continue;
          try{
            await fetchJSON(`${API_BASE}/api/contact/messages`, {
              method:'POST',
              headers:{ 'Content-Type':'application/json' },
              body: JSON.stringify({ name, email, subject, phone, message })
            });
            okCount++;
          } catch(err){
            console.error('Import message failed', err);
            failCount++;
          }
        }
        alert(`Messages import finished. Success: ${okCount}, Failed: ${failCount}.`);
        if(okCount) window.location.reload();
      } finally {
        input.value = '';
      }
    });
  }

  function initAddUserForm(token){
    const btn = document.getElementById('addUserSubmit');
    const form = document.getElementById('addUserForm');
    if(!btn || !form) return;
    btn.addEventListener('click', async ()=>{
      const name = document.getElementById('addUserName')?.value.trim() || '';
      const email = document.getElementById('addUserEmail')?.value.trim() || '';
      const registration = document.getElementById('addUserRegistration')?.value.trim() || '';
      const level = document.getElementById('addUserLevel')?.value.trim() || '';
      const specialty = document.getElementById('addUserSpecialty')?.value.trim() || '';
      if(!name || !email || !registration){
        alert('Please fill Name, Email and Registration');
        return;
      }
      try{
        await fetchJSON(`${API_BASE}/api/auth/signup`, {
          method:'POST',
          headers:{ 'Content-Type':'application/json' },
          body: JSON.stringify({ name, email, registration, level, specialty })
        });
        alert('User added');
        form.reset();
        window.location.reload();
      } catch(err){
        alert(err.message || 'Failed to add user');
      }
    });
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

      // Applications
      const appsTbody = document.querySelector('#appsTable tbody');
      appsTbody.innerHTML = (apps.items||[]).map(a=>`
        <tr data-id="${a.id}">
          <td>${a.id}</td>
          <td contenteditable="true" data-field="name">${a.name||''}</td>
          <td contenteditable="true" data-field="email">${a.email||''}</td>
          <td contenteditable="true" data-field="registration">${a.registration||''}</td>
          <td contenteditable="true" data-field="level">${a.level||''}</td>
          <td contenteditable="true" data-field="specialty">${a.specialty||''}</td>
          <td contenteditable="true" data-field="message">${(a.message||'').replace(/</g,'&lt;')}</td>
          <td>${fmtDate(a.created_at)}</td>
          <td>
            <button class="btn btn-sm btn-outline btn-icon" data-action="app-edit"><i class="fa-solid fa-pen"></i><span>Edit</span></button>
            <button class="btn btn-sm btn-primary btn-icon" data-action="app-save"><i class="fa-solid fa-floppy-disk"></i><span>Save</span></button>
            <button class="btn btn-sm btn-danger btn-icon" data-action="app-delete"><i class="fa-solid fa-trash"></i><span>Delete</span></button>
          </td>
        </tr>`).join('');
      attachAppActions(appsTbody, token);

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
      // Export / Import initialisation after tables are rendered
      initUsersExport();
      initAppsExport();
      initMsgsExport();
      initUsersImport(token);
      initAppsImport();
      initMsgsImport();
      initAddUserForm(token);
      initAddAppForm();
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
