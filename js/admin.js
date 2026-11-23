// ===== ADMIN DASHBOARD JS =====
const ADMIN_STORAGE_KEY = 'sprout_wfs_jobs';
const MESSAGES_STORAGE_KEY = 'sprout_wfs_messages';

document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  loadDashboard();
  loadManageTable();
  setupPasteArea();
});

// ===== TABS =====
function setupTabs() {
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.panel).classList.add('active');
      if (tab.dataset.panel === 'managePanel') loadManageTable();
      if (tab.dataset.panel === 'dashPanel') loadDashboard();
      if (tab.dataset.panel === 'messagesPanel') loadMessagesTable();
    });
  });
}

// ===== DASHBOARD =====
function loadDashboard() {
  const jobs = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY) || '[]');

  // Stats
  const totalEl = document.getElementById('dashTotalJobs');
  const domainsEl = document.getElementById('dashDomains');
  const locationsEl = document.getElementById('dashLocations');
  const remoteEl = document.getElementById('dashRemote');

  if (totalEl) totalEl.textContent = jobs.length;

  const domains = [...new Set(jobs.map(j => j.domain))];
  if (domainsEl) domainsEl.textContent = domains.length;

  const locations = [...new Set(jobs.map(j => j.location))];
  if (locationsEl) locationsEl.textContent = locations.length;

  const remoteCount = jobs.filter(j => j.workMode && j.workMode.toLowerCase().includes('remote')).length;
  if (remoteEl) remoteEl.textContent = remoteCount;

  // Messages count & badge
  const messages = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
  const msgCountEl = document.getElementById('dashTotalMessages');
  if (msgCountEl) msgCountEl.textContent = messages.length;
  const badge = document.getElementById('dashMsgCountBadge');
  if (badge) {
    if (messages.length > 0) {
      badge.textContent = messages.length;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }

  // Domain bar chart
  renderDomainChart(jobs);

  // Work mode chart
  renderWorkModeChart(jobs);

  // Recent jobs list
  renderRecentJobs(jobs);
}

function renderDomainChart(jobs) {
  const container = document.getElementById('domainChart');
  if (!container) return;

  const domainCounts = {};
  jobs.forEach(j => { domainCounts[j.domain] = (domainCounts[j.domain] || 0) + 1; });

  const sorted = Object.entries(domainCounts).sort((a, b) => b[1] - a[1]);
  const max = sorted.length ? sorted[0][1] : 1;

  if (sorted.length === 0) {
    container.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 40px;">No jobs data yet. Add jobs to see analytics.</p>';
    return;
  }

  const colors = ['#0B4F8A', '#1976D2', '#4CAF50', '#2E7D32', '#00897B', '#3F51B5', '#E65100', '#7B1FA2', '#C62828', '#00695C', '#F57C00', '#1565C0', '#6A1B9A', '#AD1457', '#00838F'];

  container.innerHTML = sorted.map(([domain, count], i) => {
    const pct = Math.round((count / max) * 100);
    const shortName = domain.length > 25 ? domain.substring(0, 22) + '…' : domain;
    return `
      <div class="dash-bar-row">
        <span class="dash-bar-label">${shortName}</span>
        <div class="dash-bar-track">
          <div class="dash-bar-fill" style="width: ${pct}%; background: ${colors[i % colors.length]};"></div>
        </div>
        <span class="dash-bar-value">${count}</span>
      </div>
    `;
  }).join('');
}

function renderWorkModeChart(jobs) {
  const container = document.getElementById('workModeChart');
  if (!container) return;

  const modeCounts = { 'Office': 0, 'Remote': 0, 'Hybrid': 0 };
  jobs.forEach(j => {
    const m = (j.workMode || '').toLowerCase();
    if (m.includes('remote')) modeCounts['Remote']++;
    else if (m.includes('hybrid')) modeCounts['Hybrid']++;
    else modeCounts['Office']++;
  });

  const total = jobs.length || 1;
  const colors = { 'Office': '#0B4F8A', 'Remote': '#4CAF50', 'Hybrid': '#FF9800' };

  if (jobs.length === 0) {
    container.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 40px;">No data yet.</p>';
    return;
  }

  container.innerHTML = `
    <div class="dash-donut-legend">
      ${Object.entries(modeCounts).map(([mode, count]) => `
        <div class="dash-legend-item">
          <span class="dash-legend-dot" style="background: ${colors[mode]};"></span>
          <span class="dash-legend-label">${mode}</span>
          <span class="dash-legend-value">${count} (${Math.round(count / total * 100)}%)</span>
        </div>
      `).join('')}
    </div>
    <div class="dash-mode-bars">
      ${Object.entries(modeCounts).map(([mode, count]) => `
        <div class="dash-mode-bar-wrap">
          <div class="dash-mode-bar" style="width: ${Math.round(count / total * 100)}%; background: ${colors[mode]};">
            ${count > 0 ? mode : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderRecentJobs(jobs) {
  const container = document.getElementById('recentJobsList');
  if (!container) return;

  const recent = jobs.slice(-5).reverse();
  if (recent.length === 0) {
    container.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 24px;">No jobs yet. Start by adding some!</p>';
    return;
  }

  container.innerHTML = recent.map(job => `
    <div class="dash-recent-item">
      <div class="dash-recent-info">
        <strong>${job.title}</strong>
        <span class="dash-recent-meta">${job.domain} • ${job.location} • ${job.experience}</span>
      </div>
      <span class="job-tag mode ${(job.workMode || '').toLowerCase().includes('remote') ? 'remote' : ''}" style="font-size: 0.72rem;">
        ${job.workMode || 'Office'}
      </span>
    </div>
  `).join('');
}

// ===== QUICK ADD =====
function quickAddJob() {
  const title = document.getElementById('qaTitle').value.trim();
  const domain = document.getElementById('qaDomain').value;
  const companyType = document.getElementById('qaCompanyType').value.trim();
  const location = document.getElementById('qaLocation').value.trim();
  const experience = document.getElementById('qaExperience').value.trim();
  const workMode = document.getElementById('qaWorkMode').value;
  const applyUrl = document.getElementById('qaApplyUrl').value.trim();

  if (!title || !domain || !location || !experience) {
    showToast('Please fill in all required fields (Title, Domain, Location, Experience).', 'error');
    return;
  }

  const job = {
    id: 'j_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    title, domain, companyType, location, experience, workMode, applyUrl,
    postedDate: new Date().toISOString().split('T')[0]
  };

  const existing = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY) || '[]');
  existing.push(job);
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(existing));

  showToast(`Added: ${title}`, 'success');

  // Reset form
  document.getElementById('qaTitle').value = '';
  document.getElementById('qaDomain').value = '';
  document.getElementById('qaCompanyType').value = '';
  document.getElementById('qaLocation').value = '';
  document.getElementById('qaExperience').value = '';
  document.getElementById('qaApplyUrl').value = '';

  loadDashboard();
}

// ===== PASTE & PARSE =====
function setupPasteArea() {
  const textarea = document.getElementById('pasteInput');
  if (textarea) {
    textarea.addEventListener('paste', () => {
      setTimeout(() => autoDetectDomain(textarea.value), 100);
    });
  }
}

function autoDetectDomain(text) {
  const domainSelect = document.getElementById('domainSelect');
  if (!domainSelect) return;

  const headerMatch = text.match(/\d+\s+(.+?)\s+roles?\s+open/i);
  if (headerMatch) {
    const detected = headerMatch[1].trim();
    for (const opt of domainSelect.options) {
      if (opt.value.toLowerCase() === detected.toLowerCase()) {
        domainSelect.value = opt.value;
        break;
      }
    }
  }
}

function parseJobs() {
  const textarea = document.getElementById('pasteInput');
  const domainSelect = document.getElementById('domainSelect');
  const text = textarea.value.trim();

  if (!text) {
    showToast('Please paste job listings first.', 'error');
    return;
  }

  const domain = domainSelect.value;
  if (!domain) {
    showToast('Please select a domain category.', 'error');
    return;
  }

  const jobs = parseJobText(text, domain);

  if (jobs.length === 0) {
    showToast('Could not parse any jobs. Check the format.', 'error');
    return;
  }

  showPreview(jobs);
  showToast(`Parsed ${jobs.length} job(s) successfully!`, 'success');
}

function parseJobText(text, domain) {
  const jobs = [];
  const entries = text.split(/(?=^\d+\.\s)/m).filter(e => e.trim());

  for (const entry of entries) {
    const lines = entry.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) continue;

    const titleLine = lines[0];
    const titleMatch = titleLine.match(/^\d+\.\s*(.+?)(?:,\s*at\s+(?:a|an)\s+(.+))?$/i);
    if (!titleMatch) continue;

    const title = titleMatch[1].trim();
    const companyType = titleMatch[2] ? titleMatch[2].replace(/\s*company\s*$/i, '').trim() : '';

    let location = '', experience = '', workMode = '';
    const metaLine = lines.find(l => l.includes('📍') || l.includes('|'));
    if (metaLine) {
      const cleaned = metaLine.replace('📍', '').trim();
      const parts = cleaned.split('|').map(p => p.trim());
      location = parts[0] || '';
      experience = parts[1] || '';
      workMode = parts[2] || '';
    }

    let applyUrl = '';
    const applyLine = lines.find(l => l.toLowerCase().startsWith('apply'));
    if (applyLine) {
      const urlMatch = applyLine.match(/https?:\/\/\S+/);
      applyUrl = urlMatch ? urlMatch[0] : '';
    }

    if (!workMode && location.toLowerCase().includes('remote')) workMode = 'Remote';
    if (!workMode) workMode = 'Work from office';
    if (workMode.toLowerCase().includes('hybrid')) workMode = 'Hybrid';

    jobs.push({
      id: 'j_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      title, companyType,
      location: location.replace(/,?\s*\+\d+\s*more/i, '').trim(),
      experience, workMode, applyUrl, domain,
      postedDate: new Date().toISOString().split('T')[0]
    });
  }

  return jobs;
}

function showPreview(jobs) {
  const previewArea = document.getElementById('previewArea');
  const previewGrid = document.getElementById('previewGrid');
  const previewCount = document.getElementById('previewCount');

  if (!previewArea || !previewGrid) return;

  previewArea.style.display = 'block';
  previewCount.textContent = `${jobs.length} job(s) parsed`;

  window._parsedJobs = jobs;

  previewGrid.innerHTML = jobs.map(job => `
    <article class="job-card">
      <div class="job-card-header">
        <div class="job-domain-badge">${job.domain}</div>
        <h3>${job.title}</h3>
        <div class="job-company">${job.companyType}</div>
      </div>
      <div class="job-meta">
        <span class="job-tag location"><span class="tag-icon">📍</span> ${job.location}</span>
        <span class="job-tag experience"><span class="tag-icon">⏳</span> ${job.experience}</span>
        <span class="job-tag mode ${job.workMode.toLowerCase().includes('remote') ? 'remote' : ''}">
          <span class="tag-icon">${job.workMode.toLowerCase().includes('remote') ? '🌐' : '🏢'}</span> ${job.workMode}
        </span>
      </div>
      <div class="job-card-footer">
        <span class="job-date">Just now</span>
        <a href="${job.applyUrl}" target="_blank" rel="noopener" class="job-apply-btn">
          Apply Now <span>→</span>
        </a>
      </div>
    </article>
  `).join('');
}

function publishJobs() {
  if (!window._parsedJobs || window._parsedJobs.length === 0) {
    showToast('No parsed jobs to publish.', 'error');
    return;
  }

  const existing = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY) || '[]');
  const merged = [...existing, ...window._parsedJobs];
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(merged));

  showToast(`Published ${window._parsedJobs.length} job(s) to the job board!`, 'success');

  document.getElementById('pasteInput').value = '';
  document.getElementById('previewArea').style.display = 'none';
  window._parsedJobs = null;
  loadManageTable();
  loadDashboard();
}

// ===== MANAGE JOBS =====
function loadManageTable() {
  const tbody = document.getElementById('jobsTableBody');
  const totalEl = document.getElementById('totalJobsCount');
  if (!tbody) return;

  const jobs = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY) || '[]');
  if (totalEl) totalEl.textContent = `${jobs.length} total jobs`;

  if (jobs.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-light);">
        No jobs published yet. Use the "Add Jobs" tab to add listings.
      </td></tr>
    `;
    return;
  }

  tbody.innerHTML = jobs.map((job, i) => `
    <tr>
      <td class="job-title-cell">${job.title}</td>
      <td>${job.domain}</td>
      <td>${job.location}</td>
      <td>${job.experience}</td>
      <td>${job.workMode}</td>
      <td><button class="delete-btn" onclick="deleteJob(${i})">Delete</button></td>
    </tr>
  `).join('');
}

function deleteJob(index) {
  const jobs = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY) || '[]');
  const removed = jobs.splice(index, 1);
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(jobs));
  loadManageTable();
  loadDashboard();
  showToast(`Removed: ${removed[0]?.title || 'Job'}`, 'success');
}

function deleteAllJobs() {
  if (!confirm('Are you sure you want to delete ALL jobs? This cannot be undone.')) return;
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify([]));
  loadManageTable();
  loadDashboard();
  showToast('All jobs have been deleted.', 'success');
}

// ===== EXPORT / IMPORT =====
function exportJobs() {
  const jobs = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY) || '[]');
  const blob = new Blob([JSON.stringify(jobs, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sprout-jobs-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Jobs exported successfully!', 'success');
}

function importJobs() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const jobs = JSON.parse(ev.target.result);
        if (!Array.isArray(jobs)) throw new Error('Invalid format');
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(jobs));
        loadManageTable();
        loadDashboard();
        showToast(`Imported ${jobs.length} job(s) successfully!`, 'success');
      } catch (err) {
        showToast('Invalid JSON file. Please check the format.', 'error');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// ===== INQUIRIES & MESSAGES =====
function loadMessagesTable() {
  const tbody = document.getElementById('messagesTableBody');
  if (!tbody) return;
  const messages = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
  
  if (messages.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-light); padding: 48px 24px;">
          <div style="font-size: 2rem; margin-bottom: 8px;">📭</div>
          <strong>No inquiries yet.</strong>
          <p style="font-size: 0.85rem; margin-top: 4px;">Customer inquiries submitted from the website Contact page will appear here.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = messages.map((m, idx) => `
    <tr>
      <td style="white-space: nowrap; font-size: 0.82rem; color: var(--text-light);">
        ${escapeHtml(m.date || 'Recent')}
      </td>
      <td>
        <strong style="color: var(--text);">${escapeHtml((m.firstName || '') + ' ' + (m.lastName || ''))}</strong>
      </td>
      <td>
        <a href="mailto:${escapeHtml(m.email)}?subject=Re:%20Your%20Inquiry%20with%20Sprout%20Workforce%20Solutions" style="color: var(--primary); font-weight: 600;">
          ${escapeHtml(m.email)}
        </a>
        ${m.phone ? `<div style="font-size: 0.8rem; color: var(--text-light); margin-top: 2px;">📞 ${escapeHtml(m.phone)}</div>` : ''}
      </td>
      <td>
        <strong>${escapeHtml(m.company || '—')}</strong>
        <div style="font-size: 0.8rem; color: var(--text-light); margin-top: 2px;">
          🏷️ ${escapeHtml(m.service || 'General Enquiry')}
        </div>
      </td>
      <td style="max-width: 320px; font-size: 0.88rem; line-height: 1.5; word-break: break-word;">
        ${escapeHtml(m.message || '')}
      </td>
      <td style="white-space: nowrap;">
        <a class="job-apply-btn" href="mailto:${escapeHtml(m.email)}?subject=Re:%20Your%20Inquiry%20with%20Sprout%20Workforce%20Solutions" style="padding: 6px 12px; font-size: 0.75rem; text-decoration: none; display: inline-flex; margin-right: 6px;">
          ✉️ Reply
        </a>
        <button class="delete-btn" onclick="deleteMessage(${idx})" title="Delete message">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function deleteMessage(index) {
  if (!confirm('Are you sure you want to delete this inquiry?')) return;
  const messages = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
  messages.splice(index, 1);
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  loadMessagesTable();
  loadDashboard();
  showToast('Inquiry deleted.', 'info');
}

function clearAllMessages() {
  const messages = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
  if (messages.length === 0) {
    showToast('No inquiries to clear.', 'info');
    return;
  }
  if (!confirm('Are you sure you want to permanently clear ALL inquiries?')) return;
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify([]));
  loadMessagesTable();
  loadDashboard();
  showToast('All inquiries cleared.', 'info');
}

function exportMessagesCSV() {
  const messages = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
  if (messages.length === 0) {
    showToast('No inquiries to export.', 'info');
    return;
  }
  const headers = ['Date', 'First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Service', 'Message'];
  const rows = messages.map(m => [
    `"${(m.date || '').replace(/"/g, '""')}"`,
    `"${(m.firstName || '').replace(/"/g, '""')}"`,
    `"${(m.lastName || '').replace(/"/g, '""')}"`,
    `"${(m.email || '').replace(/"/g, '""')}"`,
    `"${(m.phone || '').replace(/"/g, '""')}"`,
    `"${(m.company || '').replace(/"/g, '""')}"`,
    `"${(m.service || '').replace(/"/g, '""')}"`,
    `"${(m.message || '').replace(/"/g, '""')}"`
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sprout_inquiries_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Inquiries exported successfully as CSV.', 'success');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ===== TOAST =====
function showToast(message, type = '') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = 'toast' + (type ? ' ' + type : '');
  requestAnimationFrame(() => {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  });
}
