// AyurSutra Application Controller & Scroll Synchronization Engine

import { initialPatients, scheduledTherapies, chikitsaRooms, ayurvedicElements } from './data.js';

// Application State
const state = {
  patients: [...initialPatients],
  searchQuery: '',
  selectedDoshaFilter: 'All',
  activeSection: 'hero',
  selectedPatientId: null,
  
  // Timer State
  timerDuration: 45 * 60, // 45 minutes in seconds
  timerRemaining: 45 * 60,
  timerRunning: false,
  timerInterval: null
};

// DOM References
const elements = {
  patientTableBody: document.getElementById('patient-table-body'),
  patientSearchInput: document.getElementById('patient-search-input'),
  doshaFilterContainer: document.getElementById('dosha-filter-container'),
  pipelineContainer: document.getElementById('pipeline-container'),
  roomsGrid: document.getElementById('rooms-grid'),
  mahabhutaGrid: document.getElementById('mahabhuta-grid'),
  
  // Navigation & Topbar
  sidebarNav: document.getElementById('sidebar-nav'),
  topbarTitle: document.getElementById('topbar-title'),
  topbarSubtitle: document.getElementById('topbar-subtitle'),
  scrollProgressBar: document.getElementById('scroll-progress-bar'),
  liveClock: document.getElementById('live-clock'),
  badgePatientCount: document.getElementById('badge-patient-count'),
  kpiPatientCount: document.getElementById('kpi-patient-count'),
  
  // Modals & Drawers
  modalAdmitPatient: document.getElementById('modal-admit-patient'),
  formAdmitPatient: document.getElementById('form-admit-patient'),
  btnOpenAdmitModal: document.getElementById('btn-open-admit-modal'),
  btnAdmitTrigger2: document.getElementById('btn-admit-trigger-2'),
  btnCloseModal: document.getElementById('btn-close-modal'),
  btnCancelModal: document.getElementById('btn-cancel-modal'),
  
  drawerPatientDetails: document.getElementById('drawer-patient-details'),
  btnCloseDrawer: document.getElementById('btn-close-drawer'),
  
  // Audio & Timer
  btnAudioToggle: document.getElementById('btn-audio-toggle'),
  audioLabel: document.getElementById('audio-label'),
  audioStatus: document.getElementById('audio-status'),
  therapyTimerDisplay: document.getElementById('therapy-timer-display'),
  btnTimerToggle: document.getElementById('btn-timer-toggle'),
  timerBtnText: document.getElementById('timer-btn-text'),
  timerBtnIcon: document.getElementById('timer-btn-icon'),
  btnTimerReset: document.getElementById('btn-timer-reset'),
  
  toastContainer: document.getElementById('toast-container')
};

// Section metadata for dynamic topbar updates
const sectionMeta = {
  'hero': {
    title: 'Cosmic Origin & Earth',
    subtitle: 'The 5 Mahabhutas & Sacred Panchakarma Harmony'
  },
  'overview': {
    title: 'Operations & Session Overview',
    subtitle: 'Real-Time Panchakarma Clinical Telemetry & Workflows'
  },
  'patients': {
    title: 'Clinical Patient Records',
    subtitle: 'Comprehensive Prakriti, Nadi Diagnostics & Treatment Cycles'
  },
  'schedule': {
    title: 'Therapy Protocols & Three-Stage Tracker',
    subtitle: 'Purva Karma • Pradhana Karma • Paschat Karma Management'
  },
  'suites': {
    title: 'Chikitsa Suites & Herbarium Telemetry',
    subtitle: 'Active Therapy Chambers, Temperature Monitoring & Siddha Pharmacy'
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Initialize 3D Cosmic Background
  let bgEngine = null;
  if (window.AyurCosmosBackground) {
    bgEngine = new window.AyurCosmosBackground('bg-canvas-container');
  }

  // 3. Render Initial Components
  renderMahabhutaElements();
  renderPatientTable();
  renderPipeline();
  renderRooms();
  updateKPIs();

  // 4. Setup Scroll-Driven Menu Synchronization
  setupScrollSync(bgEngine);

  // 5. Setup Event Listeners
  setupEventListeners();

  // 6. Setup Live Clock
  startLiveClock();
});

// Setup Scroll-Driven Menu & Section Synchronization
function setupScrollSync(bgEngine) {
  const sections = document.querySelectorAll('.content-section');
  const navLinks = document.querySelectorAll('.nav-item');

  const onScroll = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollY / docHeight : 0;

    // Update Top Progress Bar
    if (elements.scrollProgressBar) {
      elements.scrollProgressBar.style.width = `${progress * 100}%`;
    }

    // Update 3D Background Scroll Camera
    if (bgEngine) {
      bgEngine.setScrollProgress(progress);
    }

    // Determine current active section based on scroll offset
    let currentActiveId = 'hero';
    sections.forEach((section) => {
      const top = section.offsetTop - 140;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentActiveId = section.getAttribute('id');
      }
    });

    // If near bottom, activate last section
    if (scrollY + window.innerHeight >= document.documentElement.scrollHeight - 50) {
      currentActiveId = 'suites';
    }

    // Only update DOM if section changed
    if (state.activeSection !== currentActiveId) {
      state.activeSection = currentActiveId;

      // Update Sidebar Nav active classes
      navLinks.forEach((link) => {
        const href = link.getAttribute('href').replace('#', '');
        if (href === currentActiveId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Update Topbar Title & Subtitle dynamically
      const meta = sectionMeta[currentActiveId] || sectionMeta['hero'];
      if (elements.topbarTitle && elements.topbarSubtitle) {
        elements.topbarTitle.textContent = meta.title;
        elements.topbarSubtitle.textContent = meta.subtitle;
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial call
}

// Setup Interactive UI Event Listeners
function setupEventListeners() {
  // Search Input
  if (elements.patientSearchInput) {
    elements.patientSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      renderPatientTable();
    });
  }

  // Dosha Filter Buttons
  if (elements.doshaFilterContainer) {
    elements.doshaFilterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.dosha-filter-btn');
      if (!btn) return;

      document.querySelectorAll('.dosha-filter-btn').forEach(b => {
        b.classList.remove('active', 'bg-emerald-800/80', 'text-white');
        b.classList.add('bg-emerald-950/40');
      });

      btn.classList.add('active', 'bg-emerald-800/80', 'text-white');
      btn.classList.remove('bg-emerald-950/40');

      state.selectedDoshaFilter = btn.dataset.filter;
      renderPatientTable();
    });
  }

  // Admit Patient Modal Open / Close
  const openModal = () => {
    elements.modalAdmitPatient.classList.remove('hidden');
  };
  const closeModal = () => {
    elements.modalAdmitPatient.classList.add('hidden');
    elements.formAdmitPatient.reset();
  };

  if (elements.btnOpenAdmitModal) elements.btnOpenAdmitModal.addEventListener('click', openModal);
  if (elements.btnAdmitTrigger2) elements.btnAdmitTrigger2.addEventListener('click', openModal);
  if (elements.btnCloseModal) elements.btnCloseModal.addEventListener('click', closeModal);
  if (elements.btnCancelModal) elements.btnCancelModal.addEventListener('click', closeModal);

  // Admit Patient Form Submit
  if (elements.formAdmitPatient) {
    elements.formAdmitPatient.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('input-patient-name').value.trim();
      const age = parseInt(document.getElementById('input-patient-age').value);
      const gender = document.getElementById('input-patient-gender').value;
      const dosha = document.getElementById('input-patient-dosha').value;
      const contact = document.getElementById('input-patient-contact').value.trim();
      const therapy = document.getElementById('input-patient-therapy').value;
      const room = document.getElementById('input-patient-room').value;
      const therapist = document.getElementById('input-patient-therapist').value;

      const newId = `AY-2026-00${state.patients.length + 1}`;

      const newPatient = {
        id: newId,
        name,
        age,
        gender,
        contact,
        dosha,
        doshaBalance: {
          vata: dosha.includes('Vata') ? 50 : 25,
          pitta: dosha.includes('Pitta') ? 45 : 30,
          kapha: dosha.includes('Kapha') ? 45 : 20
        },
        currentTherapy: therapy,
        phase: 'Purva Karma',
        dayCount: 'Day 1 of 7',
        progressPercent: 14,
        status: 'Scheduled',
        room,
        therapist,
        nadiPulse: `${dosha} (Samata Gati)`,
        formulations: ['Mahanarayana Taila', 'Triphala Kashayam'],
        diet: 'Deepana-Pachana laghu ahara (warm herbal rice broth)',
        notes: 'Initial clinical assessment recorded. Starting snehana preparatory protocol.'
      };

      state.patients.unshift(newPatient);
      renderPatientTable();
      updateKPIs();
      closeModal();

      if (window.AyurSoundscape) {
        window.AyurSoundscape.playSingingBowlChime(640, 2.0);
      }

      showToast(`Admitted patient ${name} (${newId}) successfully!`, 'success');
    });
  }

  // Patient Details Drawer Close
  if (elements.btnCloseDrawer) {
    elements.btnCloseDrawer.addEventListener('click', () => {
      elements.drawerPatientDetails.classList.add('hidden');
    });
  }

  // Audio Ambient Synthesizer Toggle
  if (elements.btnAudioToggle) {
    elements.btnAudioToggle.addEventListener('click', () => {
      if (window.AyurSoundscape) {
        const isPlaying = window.AyurSoundscape.toggle();
        if (isPlaying) {
          elements.audioStatus.textContent = 'ON';
          elements.audioStatus.classList.remove('bg-emerald-900/90', 'text-emerald-300');
          elements.audioStatus.classList.add('bg-amber-500', 'text-stone-950', 'font-bold');
          showToast('Vedic Tanpura Soundscape (432Hz) Activated', 'info');
        } else {
          elements.audioStatus.textContent = 'OFF';
          elements.audioStatus.classList.add('bg-emerald-900/90', 'text-emerald-300');
          elements.audioStatus.classList.remove('bg-amber-500', 'text-stone-950');
          showToast('Soundscape Muted', 'info');
        }
      }
    });
  }

  // Shirodhara Session Timer Controls
  if (elements.btnTimerToggle) {
    elements.btnTimerToggle.addEventListener('click', toggleTimer);
  }
  if (elements.btnTimerReset) {
    elements.btnTimerReset.addEventListener('click', resetTimer);
  }
}

// Render Pancha Mahabhuta Elements Bar in Hero
function renderMahabhutaElements() {
  if (!elements.mahabhutaGrid) return;
  elements.mahabhutaGrid.innerHTML = ayurvedicElements.map((el) => `
    <button class="mahabhuta-card glass-card p-3 text-left transition-all hover:scale-105 border-emerald-800/60" data-name="${el.name}">
      <div class="flex items-center justify-between">
        <span class="text-base font-serif font-bold text-amber-300">${el.sanskrit}</span>
        <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">${el.english}</span>
      </div>
      <p class="text-xs font-bold text-stone-100 mt-1">${el.name}</p>
      <p class="text-[10px] text-emerald-400/80 mt-0.5">${el.dosha} • ${el.geometry.split('/')[0]}</p>
    </button>
  `).join('');

  // Add click info trigger for each element
  document.querySelectorAll('.mahabhuta-card').forEach((card) => {
    card.addEventListener('click', () => {
      const name = card.dataset.name;
      const el = ayurvedicElements.find(item => item.name === name);
      if (el) {
        if (window.AyurSoundscape) window.AyurSoundscape.playSingingBowlChime(528, 1.8);
        showToast(`${el.name} (${el.sanskrit}) — ${el.property}`, 'info');
      }
    });
  });
}

// Render Patient Records Table with Search & Filter
function renderPatientTable() {
  if (!elements.patientTableBody) return;

  const filtered = state.patients.filter((p) => {
    // Search Query Match
    const matchSearch =
      p.name.toLowerCase().includes(state.searchQuery) ||
      p.id.toLowerCase().includes(state.searchQuery) ||
      p.dosha.toLowerCase().includes(state.searchQuery) ||
      p.therapist.toLowerCase().includes(state.searchQuery);

    // Dosha Filter Match
    let matchDosha = true;
    if (state.selectedDoshaFilter === 'Vata') matchDosha = p.dosha.includes('Vata');
    else if (state.selectedDoshaFilter === 'Pitta') matchDosha = p.dosha.includes('Pitta');
    else if (state.selectedDoshaFilter === 'Kapha') matchDosha = p.dosha.includes('Kapha');
    else if (state.selectedDoshaFilter === 'Dual') matchDosha = p.dosha.includes('-') || p.dosha.includes('Tridoshic');

    return matchSearch && matchDosha;
  });

  if (filtered.length === 0) {
    elements.patientTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="px-5 py-8 text-center text-stone-400">
          <i data-lucide="search-x" class="w-6 h-6 mx-auto mb-2 text-emerald-600"></i>
          No patient records match the selected search or Dosha filter.
        </td>
      </tr>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  elements.patientTableBody.innerHTML = filtered.map((p) => {
    // Dosha badge styling
    let doshaColor = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    if (p.dosha.includes('Vata')) doshaColor = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    if (p.dosha.includes('Pitta')) doshaColor = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    if (p.dosha.includes('Kapha')) doshaColor = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';

    // Status badge styling
    let statusColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (p.status === 'Scheduled') statusColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (p.status === 'Completed') statusColor = 'bg-blue-500/20 text-blue-300 border-blue-500/40';

    return `
      <tr class="hover:bg-emerald-900/20 transition-colors">
        <td class="px-5 py-3.5">
          <p class="font-bold text-stone-100">${p.name}</p>
          <p class="text-emerald-400/80 text-[11px] font-mono">${p.id} • ${p.age}y, ${p.gender}</p>
        </td>
        <td class="px-5 py-3.5">
          <span class="inline-block px-2.5 py-0.5 rounded-lg font-semibold text-[11px] border ${doshaColor}">
            ${p.dosha}
          </span>
        </td>
        <td class="px-5 py-3.5 font-medium text-stone-200">
          ${p.currentTherapy}
        </td>
        <td class="px-5 py-3.5">
          <div class="flex items-center gap-2">
            <span class="text-stone-300 font-medium">${p.dayCount}</span>
            <div class="w-16 bg-emerald-950 h-1.5 rounded-full overflow-hidden">
              <div class="bg-emerald-400 h-full" style="width: ${p.progressPercent}%"></div>
            </div>
          </div>
        </td>
        <td class="px-5 py-3.5">
          <p class="font-semibold text-stone-200">${p.therapist.split('(')[0]}</p>
          <p class="text-stone-400 text-[11px]">${p.room}</p>
        </td>
        <td class="px-5 py-3.5">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusColor}">
            <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
            ${p.status}
          </span>
        </td>
        <td class="px-5 py-3.5 text-right">
          <button class="btn-view-chart px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-800/80 text-emerald-300 hover:text-white border border-emerald-800 text-[11px] font-semibold transition-all" data-id="${p.id}">
            View Chart
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // Attach View Chart Buttons
  document.querySelectorAll('.btn-view-chart').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      openPatientDrawer(id);
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

// Open Patient Slide-over Drawer
function openPatientDrawer(patientId) {
  const p = state.patients.find(item => item.id === patientId);
  if (!p) return;

  document.getElementById('drawer-patient-id').textContent = p.id;
  document.getElementById('drawer-patient-name').textContent = `${p.name} (${p.age}y, ${p.gender})`;
  
  // Dosha bars
  document.getElementById('drawer-vata-pct').textContent = `${p.doshaBalance.vata}%`;
  document.getElementById('drawer-vata-bar').style.width = `${p.doshaBalance.vata}%`;

  document.getElementById('drawer-pitta-pct').textContent = `${p.doshaBalance.pitta}%`;
  document.getElementById('drawer-pitta-bar').style.width = `${p.doshaBalance.pitta}%`;

  document.getElementById('drawer-kapha-pct').textContent = `${p.doshaBalance.kapha}%`;
  document.getElementById('drawer-kapha-bar').style.width = `${p.doshaBalance.kapha}%`;

  document.getElementById('drawer-nadi-pulse').textContent = p.nadiPulse;
  document.getElementById('drawer-therapy').textContent = `${p.currentTherapy} (${p.phase})`;
  
  // Formulations
  const formList = document.getElementById('drawer-formulations-list');
  formList.innerHTML = p.formulations.map(f => `<li>${f}</li>`).join('');

  document.getElementById('drawer-diet').textContent = p.diet;
  document.getElementById('drawer-notes').textContent = p.notes;

  elements.drawerPatientDetails.classList.remove('hidden');

  if (window.AyurSoundscape) {
    window.AyurSoundscape.playSingingBowlChime(720, 1.2);
  }
}

// Render Treatment Pipeline in Overview
function renderPipeline() {
  if (!elements.pipelineContainer) return;
  elements.pipelineContainer.innerHTML = scheduledTherapies.map((item) => `
    <div class="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/40 hover:border-emerald-700/60 transition-all">
      <div class="flex items-start gap-3">
        <span class="text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-lg font-mono">
          ${item.time}
        </span>
        <div>
          <p class="text-xs font-bold text-stone-100">${item.therapy}</p>
          <p class="text-[11px] text-emerald-400/80">${item.patient} • ${item.room}</p>
        </div>
      </div>
      <span class="text-[11px] font-medium text-stone-300 bg-emerald-900/50 px-2.5 py-0.5 rounded-lg border border-emerald-800/40">
        ${item.therapist}
      </span>
    </div>
  `).join('');
}

// Render 6 Chikitsa Suites Cards
function renderRooms() {
  if (!elements.roomsGrid) return;
  elements.roomsGrid.innerHTML = chikitsaRooms.map((rm) => {
    const isOccupied = rm.status === 'Occupied';
    return `
      <div class="glass-card p-5 space-y-3 ${isOccupied ? 'border-emerald-700/50' : 'border-stone-700/40'}">
        <div class="flex items-start justify-between">
          <div>
            <span class="text-[10px] font-mono text-stone-400">${rm.id}</span>
            <h4 class="font-bold text-sm text-stone-100 font-serif">${rm.name}</h4>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isOccupied
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-stone-800 text-stone-300 border border-stone-700'
          }">
            ${rm.status}
          </span>
        </div>

        <p class="text-xs text-stone-300">${rm.type}</p>

        <div class="pt-2 border-t border-emerald-900/50 text-xs space-y-1">
          <div class="flex justify-between text-stone-400">
            <span>Current Patient:</span>
            <span class="font-semibold text-stone-200">${rm.patient}</span>
          </div>
          <div class="flex justify-between text-stone-400">
            <span>Oil Temperature:</span>
            <span class="font-mono text-amber-300 font-semibold">${rm.oilTemp}</span>
          </div>
          <div class="flex justify-between text-stone-400">
            <span>Micro-climate:</span>
            <span class="text-stone-300">${rm.ambient}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Update Topbar and Overview KPIs
function updateKPIs() {
  const count = state.patients.length;
  if (elements.badgePatientCount) elements.badgePatientCount.textContent = count;
  if (elements.kpiPatientCount) elements.kpiPatientCount.textContent = count;
}

// Shirodhara Session Timer Functions
function toggleTimer() {
  if (state.timerRunning) {
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    elements.timerBtnText.textContent = 'Resume';
    elements.timerBtnIcon.setAttribute('data-lucide', 'play');
  } else {
    state.timerRunning = true;
    elements.timerBtnText.textContent = 'Pause';
    elements.timerBtnIcon.setAttribute('data-lucide', 'pause');

    if (window.AyurSoundscape) {
      window.AyurSoundscape.playSingingBowlChime(432, 2.0);
    }

    state.timerInterval = setInterval(() => {
      if (state.timerRemaining > 0) {
        state.timerRemaining--;
        updateTimerDisplay();
      } else {
        clearInterval(state.timerInterval);
        state.timerRunning = false;
        elements.timerBtnText.textContent = 'Start';
        elements.timerBtnIcon.setAttribute('data-lucide', 'play');
        if (window.AyurSoundscape) {
          window.AyurSoundscape.playSingingBowlChime(528, 4.0);
        }
        showToast('Shirodhara Session Completed for Ananya Sharma!', 'success');
      }
    }, 1000);
  }

  if (window.lucide) window.lucide.createIcons();
}

function resetTimer() {
  clearInterval(state.timerInterval);
  state.timerRunning = false;
  state.timerRemaining = state.timerDuration;
  elements.timerBtnText.textContent = 'Start';
  elements.timerBtnIcon.setAttribute('data-lucide', 'play');
  updateTimerDisplay();
  if (window.lucide) window.lucide.createIcons();
}

function updateTimerDisplay() {
  const minutes = Math.floor(state.timerRemaining / 60);
  const seconds = state.timerRemaining % 60;
  elements.therapyTimerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Live Clock for Jaipur Central Chikitsalaya
function startLiveClock() {
  const tick = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    if (elements.liveClock) {
      elements.liveClock.textContent = `${timeStr} IST`;
    }
  };
  tick();
  setInterval(tick, 1000);
}

// Toast Feedback Notification Generator
function showToast(message, type = 'info') {
  if (!elements.toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all transform translate-y-2 opacity-0 pointer-events-auto ${
    type === 'success'
      ? 'bg-emerald-950/95 text-emerald-200 border-emerald-500/60 shadow-emerald-900/50'
      : 'bg-stone-900/95 text-amber-200 border-amber-500/60 shadow-amber-900/50'
  }`;

  toast.innerHTML = `
    <span class="w-2 h-2 rounded-full ${type === 'success' ? 'bg-emerald-400' : 'bg-amber-400'}"></span>
    <span>${message}</span>
  `;

  elements.toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}
