// ===== JOBS BOARD JS =====
const STORAGE_KEY = 'sprout_wfs_jobs';

const DOMAINS = [
  'Software & Technology', 'Design & Creative', 'Sales & Business Development',
  'Marketing', 'Project Management', 'Customer Support & Success',
  'Product Management', 'Accounts & Finance', 'Human Resource Management',
  'Business & Strategy', 'Education & Training', 'Hardware Technology',
  'DevOps & Infrastructure', 'Data & Analytics', 'Cybersecurity'
];

const LOCATIONS = [
  'Remote', 'Bengaluru', 'Pune, Maharashtra', 'Mumbai', 'Gurugram',
  'Hyderabad', 'Chennai', 'Noida', 'Ahmedabad', 'Kolkata', 'Delhi',
  'Navi Mumbai'
];

const EXP_RANGES = [
  { label: '0 – 2 yrs', min: 0, max: 2 },
  { label: '3 – 5 yrs', min: 3, max: 5 },
  { label: '6 – 8 yrs', min: 6, max: 8 },
  { label: '9 – 12 yrs', min: 9, max: 12 },
  { label: '12+ yrs', min: 12, max: 100 }
];

const WORK_MODES = ['Work from office', 'Remote', 'Hybrid'];

let allJobs = [];
let activeFilters = {
  domains: [],
  locations: [],
  experience: [],
  workMode: [],
  search: ''
};

document.addEventListener('DOMContentLoaded', () => {
  loadJobs();
  renderFilters();
  applyFilters();
  setupSearch();
});

function loadJobs() {
  const stored = localStorage.getItem(STORAGE_KEY);
  allJobs = stored ? JSON.parse(stored) : getSampleJobs();
  if (!stored) localStorage.setItem(STORAGE_KEY, JSON.stringify(allJobs));
}

function getSampleJobs() {
  return [
    {
      id: 'j1', title: 'Cloud Automation Architect',
      companyType: 'B2B • Service • Public', location: 'Hyderabad',
      experience: '8-12 yrs', workMode: 'Work from office',
      applyUrl: 'https://app.talentxo.com/s/012Oc',
      domain: 'Software & Technology', postedDate: '2026-11-22'
    },
    {
      id: 'j2', title: 'Senior Developer (Ruby on Rails, Python, Agentic AI)',
      companyType: 'B2B • Service • Seed', location: 'Pune, Maharashtra',
      experience: '2-4 yrs', workMode: 'Hybrid',
      applyUrl: 'https://app.talentxo.com/s/012Od',
      domain: 'Software & Technology', postedDate: '2026-11-22'
    },
    {
      id: 'j3', title: 'Lead Developer (Ruby on Rails, Python, Agentic AI)',
      companyType: 'B2B • Service • Seed', location: 'Pune, Maharashtra',
      experience: '4-6 yrs', workMode: 'Hybrid',
      applyUrl: 'https://app.talentxo.com/s/012Oe',
      domain: 'Software & Technology', postedDate: '2026-11-22'
    },
    {
      id: 'j4', title: 'Senior Firewall Engineer (Palo Alto / Check Point)',
      companyType: 'B2B • Service • Bootstrapped', location: 'Navi Mumbai',
      experience: '4-7 yrs', workMode: 'Work from office',
      applyUrl: 'https://app.talentxo.com/s/012Of',
      domain: 'Software & Technology', postedDate: '2026-11-22'
    },
    {
      id: 'j5', title: 'AWS Golden Jacket Architect (6-Month Contract)',
      companyType: 'B2B • Service • Bootstrapped', location: 'Remote',
      experience: '8-10 yrs', workMode: 'Remote',
      applyUrl: 'https://app.talentxo.com/s/012Og',
      domain: 'Software & Technology', postedDate: '2026-11-22'
    },
    {
      id: 'j6', title: 'Business Development Manager (B2B SaaS, Field Sales)',
      companyType: 'B2B • Product • Series A', location: 'Pune, Maharashtra',
      experience: '2-7 yrs', workMode: 'Work from office',
      applyUrl: 'https://app.talentxo.com/s/012Oh',
      domain: 'Sales & Business Development', postedDate: '2026-11-22'
    },
    {
      id: 'j7', title: 'Salesforce OMS Architect (6-Month Contract)',
      companyType: 'B2B • Service • Bootstrapped', location: 'Remote',
      experience: '8-10 yrs', workMode: 'Remote',
      applyUrl: 'https://app.talentxo.com/s/012Oi',
      domain: 'Software & Technology', postedDate: '2026-11-22'
    },
    {
      id: 'j8', title: 'Mid-Level Shopify Developer (Liquid, Javascript/CSS)',
      companyType: 'B2C • Product • Bootstrapped', location: 'Mumbai',
      experience: '2-4 yrs', workMode: 'Work from office',
      applyUrl: 'https://app.talentxo.com/s/012Oj',
      domain: 'Software & Technology', postedDate: '2026-11-22'
    },
    {
      id: 'j9', title: 'Server Admin / DevOps Engineer',
      companyType: 'B2C • Product • Bootstrapped', location: 'Mumbai',
      experience: '3-5 yrs', workMode: 'Work from office',
      applyUrl: 'https://app.talentxo.com/s/012Ok',
      domain: 'DevOps & Infrastructure', postedDate: '2026-11-22'
    },
    {
      id: 'j10', title: 'MIS Executive (Data management, PwD)',
      companyType: 'B2B2C • Product • Public', location: 'Pune, Maharashtra',
      experience: '0-3 yrs', workMode: 'Work from office',
      applyUrl: 'https://app.talentxo.com/s/012Ol',
      domain: 'Data & Analytics', postedDate: '2026-11-22'
    }
  ];
}

function renderFilters() {
  const sidebar = document.getElementById('filterSidebar');
  if (!sidebar) return;

  // Count jobs per filter value
  const domainCounts = {};
  const locationCounts = {};
  const expCounts = {};
  const modeCounts = {};

  allJobs.forEach(job => {
    domainCounts[job.domain] = (domainCounts[job.domain] || 0) + 1;

    // Normalize location for counting
    const jobLoc = normalizeLocation(job.location);
    LOCATIONS.forEach(loc => {
      if (jobLoc.includes(normalizeLocation(loc)) || normalizeLocation(loc).includes(jobLoc)) {
        locationCounts[loc] = (locationCounts[loc] || 0) + 1;
      }
    });

    // Experience range counting
    const minExp = parseMinExp(job.experience);
    EXP_RANGES.forEach(range => {
      if (minExp >= range.min && minExp <= range.max) {
        expCounts[range.label] = (expCounts[range.label] || 0) + 1;
      }
    });

    // Work mode counting
    const mode = detectWorkMode(job.workMode);
    modeCounts[mode] = (modeCounts[mode] || 0) + 1;
  });

  sidebar.innerHTML = `
    <div class="filter-header">
      <h3>🔍 Filters</h3>
      <button class="clear-filters" onclick="clearAllFilters()">Clear all</button>
    </div>
    ${buildFilterGroup('Domain', 'domain', DOMAINS, domainCounts)}
    ${buildFilterGroup('Location', 'location', LOCATIONS, locationCounts)}
    ${buildFilterGroup('Experience', 'experience', EXP_RANGES.map(r => r.label), expCounts)}
    ${buildFilterGroup('Work Mode', 'workMode', WORK_MODES, modeCounts)}
  `;
}

function buildFilterGroup(title, key, options, counts) {
  const optionsHtml = options.map(opt => {
    const count = counts[opt] || 0;
    if (count === 0) return '';
    return `
      <div class="filter-option">
        <label>
          <input type="checkbox" data-filter="${key}" value="${opt}" onchange="onFilterChange()">
          ${opt}
        </label>
        <span class="filter-count">${count}</span>
      </div>
    `;
  }).filter(Boolean).join('');

  if (!optionsHtml) return '';

  return `
    <div class="filter-group">
      <div class="filter-group-title" onclick="toggleFilterGroup(this)">
        ${title} <span class="chevron">▾</span>
      </div>
      <div class="filter-options">${optionsHtml}</div>
    </div>
  `;
}

function toggleFilterGroup(el) {
  const opts = el.nextElementSibling;
  const chevron = el.querySelector('.chevron');
  opts.classList.toggle('collapsed');
  chevron.classList.toggle('collapsed');
}

function onFilterChange() {
  activeFilters.domains = getCheckedValues('domain');
  activeFilters.locations = getCheckedValues('location');
  activeFilters.experience = getCheckedValues('experience');
  activeFilters.workMode = getCheckedValues('workMode');
  applyFilters();
}

function getCheckedValues(filterKey) {
  return Array.from(
    document.querySelectorAll(`input[data-filter="${filterKey}"]:checked`)
  ).map(cb => cb.value);
}

function setupSearch() {
  const searchInput = document.getElementById('jobSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeFilters.search = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }
}

function applyFilters() {
  let filtered = [...allJobs];

  // Search filter
  if (activeFilters.search) {
    const q = activeFilters.search;
    filtered = filtered.filter(job =>
      job.title.toLowerCase().includes(q) ||
      job.domain.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      job.companyType.toLowerCase().includes(q)
    );
  }

  // Domain filter
  if (activeFilters.domains.length) {
    filtered = filtered.filter(job => activeFilters.domains.includes(job.domain));
  }

  // Location filter
  if (activeFilters.locations.length) {
    filtered = filtered.filter(job => {
      const jobLoc = normalizeLocation(job.location);
      return activeFilters.locations.some(loc =>
        jobLoc.includes(normalizeLocation(loc)) || normalizeLocation(loc).includes(jobLoc)
      );
    });
  }

  // Experience filter
  if (activeFilters.experience.length) {
    const selectedRanges = activeFilters.experience.map(label =>
      EXP_RANGES.find(r => r.label === label)
    ).filter(Boolean);
    filtered = filtered.filter(job => {
      const minExp = parseMinExp(job.experience);
      return selectedRanges.some(range => minExp >= range.min && minExp <= range.max);
    });
  }

  // Work mode filter
  if (activeFilters.workMode.length) {
    filtered = filtered.filter(job => {
      const mode = detectWorkMode(job.workMode);
      return activeFilters.workMode.includes(mode);
    });
  }

  renderJobs(filtered);
  renderActiveFilters();
  updateResultsCount(filtered.length);
}

function renderJobs(jobs) {
  const grid = document.getElementById('jobsGrid');
  if (!grid) return;

  if (jobs.length === 0) {
    grid.innerHTML = `
      <div class="no-jobs">
        <div class="no-jobs-icon">📭</div>
        <h3>No jobs match your filters</h3>
        <p>Try adjusting your search or clearing some filters.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = jobs.map(job => createJobCard(job)).join('');
}

function createJobCard(job) {
  const modeClass = job.workMode.toLowerCase().includes('remote') ? 'remote' : '';
  const daysAgo = getDaysAgo(job.postedDate);

  return `
    <article class="job-card">
      <div class="job-card-header">
        <div class="job-domain-badge">${job.domain}</div>
        <h3>${job.title}</h3>
        <div class="job-company">${job.companyType}</div>
      </div>
      <div class="job-meta">
        <span class="job-tag location"><span class="tag-icon">📍</span> ${job.location}</span>
        <span class="job-tag experience"><span class="tag-icon">⏳</span> ${job.experience}</span>
        <span class="job-tag mode ${modeClass}"><span class="tag-icon">${modeClass ? '🌐' : '🏢'}</span> ${job.workMode}</span>
      </div>
      <div class="job-card-footer">
        <span class="job-date">${daysAgo}</span>
        <a href="${job.applyUrl}" target="_blank" rel="noopener" class="job-apply-btn">
          Apply Now <span>→</span>
        </a>
      </div>
    </article>
  `;
}

function renderActiveFilters() {
  const container = document.getElementById('activeFilters');
  if (!container) return;

  const allActive = [
    ...activeFilters.domains.map(v => ({ key: 'domain', value: v })),
    ...activeFilters.locations.map(v => ({ key: 'location', value: v })),
    ...activeFilters.experience.map(v => ({ key: 'experience', value: v })),
    ...activeFilters.workMode.map(v => ({ key: 'workMode', value: v }))
  ];

  if (allActive.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = allActive.map(f => `
    <span class="active-filter-tag">
      ${f.value}
      <span class="remove-filter" onclick="removeFilter('${f.key}', '${f.value}')">&times;</span>
    </span>
  `).join('');
}

function removeFilter(key, value) {
  const cb = document.querySelector(`input[data-filter="${key}"][value="${value}"]`);
  if (cb) { cb.checked = false; onFilterChange(); }
}

function clearAllFilters() {
  document.querySelectorAll('.filter-option input:checked').forEach(cb => cb.checked = false);
  const searchInput = document.getElementById('jobSearch');
  if (searchInput) searchInput.value = '';
  activeFilters = { domains: [], locations: [], experience: [], workMode: [], search: '' };
  applyFilters();
}

function updateResultsCount(count) {
  const el = document.getElementById('resultsCount');
  if (el) el.innerHTML = `Showing <strong>${count}</strong> of <strong>${allJobs.length}</strong> positions`;
}

// Helpers
function normalizeLocation(loc) {
  return loc.toLowerCase().replace(/,?\s*(maharashtra|karnataka|telangana|tamil nadu|haryana|uttar pradesh|west bengal|gujarat|delhi)/gi, '').trim();
}

function parseMinExp(expStr) {
  const match = expStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function detectWorkMode(mode) {
  if (!mode) return 'Work from office';
  const m = mode.toLowerCase();
  if (m.includes('remote')) return 'Remote';
  if (m.includes('hybrid')) return 'Hybrid';
  return 'Work from office';
}

function getDaysAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} week${Math.floor(diff / 7) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diff / 30)} month${Math.floor(diff / 30) > 1 ? 's' : ''} ago`;
}

// Also render featured jobs on home page
function renderFeaturedJobs() {
  const container = document.getElementById('featuredJobs');
  if (!container) return;
  const stored = localStorage.getItem(STORAGE_KEY);
  const jobs = stored ? JSON.parse(stored) : getSampleJobs();
  const featured = jobs.slice(0, 6);
  container.innerHTML = featured.map(job => createJobCard(job)).join('');
}

// Auto-call for home page
if (document.getElementById('featuredJobs')) {
  document.addEventListener('DOMContentLoaded', renderFeaturedJobs);
}
