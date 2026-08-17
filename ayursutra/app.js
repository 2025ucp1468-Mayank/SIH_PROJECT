// AyurSutra Application Controller, Scroll Synchronization Engine & Billing/Payment System
import {
  initialPatients,
  scheduledTherapies,
  chikitsaRooms,
  ayurvedicElements,
  initialInvoices,
  pricingCatalog
} from './data.js';

const state = {
  patients: [...initialPatients],
  invoices: [...initialInvoices],
  searchQuery: '',
  selectedDoshaFilter: 'All',
  invoiceSearchQuery: '',
  invoiceFilter: 'All',
  selectedInvoiceForPayment: null,
  activePaymentTab: 'upi',
  activeSection: 'overview',
  timerDuration: 45 * 60,
  timerRemaining: 45 * 60,
  timerRunning: false,
  timerInterval: null
};

const elements = {
  patientTableBody: document.getElementById('patient-table-body'),
  patientSearchInput: document.getElementById('patient-search-input'),
  doshaFilterContainer: document.getElementById('dosha-filter-container'),
  pipelineContainer: document.getElementById('pipeline-container'),
  roomsGrid: document.getElementById('rooms-grid'),
  mahabhutaGrid: document.getElementById('mahabhuta-grid'),
  sidebarNav: document.getElementById('sidebar-nav'),
  topbarTitle: document.getElementById('topbar-title'),
  topbarSubtitle: document.getElementById('topbar-subtitle'),
  scrollProgressBar: document.getElementById('scroll-progress-bar'),
  liveClock: document.getElementById('live-clock'),
  badgePatientCount: document.getElementById('badge-patient-count'),
  kpiPatientCount: document.getElementById('kpi-patient-count'),
  modalAdmitPatient: document.getElementById('modal-admit-patient'),
  formAdmitPatient: document.getElementById('form-admit-patient'),
  btnOpenAdmitModal: document.getElementById('btn-open-admit-modal'),
  btnCloseModal: document.getElementById('btn-close-modal'),
  btnCancelModal: document.getElementById('btn-cancel-modal'),
  drawerPatientDetails: document.getElementById('drawer-patient-details'),
  btnCloseDrawer: document.getElementById('btn-close-drawer'),
  btnAudioToggle: document.getElementById('btn-audio-toggle'),
  audioStatus: document.getElementById('audio-status'),
  therapyTimerDisplay: document.getElementById('therapy-timer-display'),
  btnTimerToggle: document.getElementById('btn-timer-toggle'),
  timerBtnText: document.getElementById('timer-btn-text'),
  timerBtnIcon: document.getElementById('timer-btn-icon'),
  btnTimerReset: document.getElementById('btn-timer-reset'),
  toastContainer: document.getElementById('toast-container'),

  // Billing & Payment Elements
  invoiceTableBody: document.getElementById('invoice-table-body'),
  invoiceSearchInput: document.getElementById('invoice-search-input'),
  invoiceFilterContainer: document.getElementById('invoice-filter-container'),
  tariffCatalogGrid: document.getElementById('tariff-catalog-grid'),
  badgeInvoiceCount: document.getElementById('badge-invoice-count'),
  kpiTotalInvoiced: document.getElementById('kpi-total-invoiced'),
  kpiTotalCollected: document.getElementById('kpi-total-collected'),
  kpiCollectionRate: document.getElementById('kpi-collection-rate'),
  kpiPendingBalance: document.getElementById('kpi-pending-balance'),
  kpiPendingCount: document.getElementById('kpi-pending-count'),

  // Payment Checkout Modal Elements
  modalPaymentCheckout: document.getElementById('modal-payment-checkout'),
  btnClosePayModal: document.getElementById('btn-close-pay-modal'),
  btnCancelPay: document.getElementById('btn-cancel-pay'),
  btnExecutePayment: document.getElementById('btn-execute-payment'),
  btnPayLabel: document.getElementById('btn-pay-label'),
  paySummaryInvid: document.getElementById('pay-summary-invid'),
  paySummaryPatient: document.getElementById('pay-summary-patient'),
  paySummaryPackage: document.getElementById('pay-summary-package'),
  paySummaryAmount: document.getElementById('pay-summary-amount'),
  payMethodsTabs: document.getElementById('pay-methods-tabs'),
  paymentProcessingState: document.getElementById('payment-processing-state'),
  processingStatusText: document.getElementById('processing-status-text'),
  paymentActionsFooter: document.getElementById('payment-actions-footer'),

  // Visual Card Preview
  inputCardNumber: document.getElementById('input-card-number'),
  inputCardName: document.getElementById('input-card-name'),
  inputCardExpiry: document.getElementById('input-card-expiry'),
  inputCardCvv: document.getElementById('input-card-cvv'),
  cardPreviewNumber: document.getElementById('card-preview-number'),
  cardPreviewName: document.getElementById('card-preview-name'),
  cardPreviewExpiry: document.getElementById('card-preview-expiry'),

  // Invoice Viewer Modal
  modalInvoiceViewer: document.getElementById('modal-invoice-viewer'),
  btnCloseInvoiceViewer: document.getElementById('btn-close-invoice-viewer'),

  // Create Invoice Modal
  modalCreateInvoice: document.getElementById('modal-create-invoice'),
  btnOpenCreateInvoice: document.getElementById('btn-open-create-invoice'),
  btnCloseCreateInvModal: document.getElementById('btn-close-create-inv-modal'),
  btnCancelCreateInv: document.getElementById('btn-cancel-create-inv'),
  formCreateInvoice: document.getElementById('form-create-invoice'),
  createInvPatientSelect: document.getElementById('create-inv-patient-select')
};

const sectionMeta = {
  'overview': { title: 'Clinical Dashboard & Operations', subtitle: 'Hospital EHR & Panchakarma Clinical Management System' },
  'patients': { title: 'Clinical Patient Records & EMR', subtitle: 'Comprehensive Prakriti, Nadi Diagnostics & Treatment Cycles' },
  'schedule': { title: 'Therapy Protocols & Three-Stage Tracker', subtitle: 'Purva Karma • Pradhana Karma • Paschat Karma Management' },
  'suites': { title: 'Chikitsa Suites & Herbarium Telemetry', subtitle: 'Active Therapy Chambers, Temperature Monitoring & Siddha Pharmacy' },
  'billing': { title: 'Billing, Invoices & Payment Gateway', subtitle: 'GST-Compliant Tax Invoices, Ayush TPA Claims & Multichannel POS Gateway' }
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  
  renderMahabhutaElements();
  renderPatientTable();
  renderPipeline();
  renderRooms();
  renderInvoices();
  renderRevenueKPIs();
  renderTariffCatalog();
  updateKPIs();
  setupScrollSync();
  setupEventListeners();
  setupBillingListeners();
  startLiveClock();
});

// Setup Scroll-Driven Menu & Section Synchronization
function setupScrollSync() {
  const sections = document.querySelectorAll('.content-section');
  const navLinks = document.querySelectorAll('.nav-item');

  const onScroll = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollY / docHeight : 0;

    if (elements.scrollProgressBar) elements.scrollProgressBar.style.width = `${progress * 100}%`;

    let currentActiveId = 'overview';
    sections.forEach((section) => {
      const top = section.offsetTop - 140;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentActiveId = section.getAttribute('id');
      }
    });

    if (scrollY + window.innerHeight >= document.documentElement.scrollHeight - 60) {
      currentActiveId = 'billing';
    }

    if (state.activeSection !== currentActiveId) {
      state.activeSection = currentActiveId;
      navLinks.forEach((link) => {
        const href = link.getAttribute('href').replace('#', '');
        if (href === currentActiveId) link.classList.add('active');
        else link.classList.remove('active');
      });

      const meta = sectionMeta[currentActiveId] || sectionMeta['overview'];
      if (elements.topbarTitle && elements.topbarSubtitle) {
        elements.topbarTitle.textContent = meta.title;
        elements.topbarSubtitle.textContent = meta.subtitle;
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function setupEventListeners() {
  if (elements.patientSearchInput) {
    elements.patientSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      renderPatientTable();
    });
  }

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

  const openModal = () => elements.modalAdmitPatient?.classList.remove('hidden');
  const closeModal = () => {
    elements.modalAdmitPatient?.classList.add('hidden');
    elements.formAdmitPatient?.reset();
  };

  if (elements.btnOpenAdmitModal) elements.btnOpenAdmitModal.addEventListener('click', openModal);
  if (elements.btnCloseModal) elements.btnCloseModal.addEventListener('click', closeModal);
  if (elements.btnCancelModal) elements.btnCancelModal.addEventListener('click', closeModal);

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

      if (window.soundEngine) window.soundEngine.playSingingBowlChime(640, 2.0);
      showToast(`Admitted patient ${name} (${newId}) successfully!`, 'success');
    });
  }

  if (elements.btnCloseDrawer) {
    elements.btnCloseDrawer.addEventListener('click', () => {
      elements.drawerPatientDetails.classList.add('hidden');
    });
  }

  if (elements.btnAudioToggle) {
    elements.btnAudioToggle.addEventListener('click', () => {
      if (window.soundEngine) {
        const isPlaying = window.soundEngine.toggle();
        if (isPlaying) {
          elements.audioStatus.textContent = 'ON';
          elements.audioStatus.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-stone-950 font-bold';
          showToast('Vedic Tanpura Soundscape (432Hz) Activated', 'info');
        } else {
          elements.audioStatus.textContent = 'OFF';
          elements.audioStatus.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-900/90 text-emerald-300';
          showToast('Soundscape Muted', 'info');
        }
      }
    });
  }

  if (elements.btnTimerToggle) elements.btnTimerToggle.addEventListener('click', toggleTimer);
  if (elements.btnTimerReset) elements.btnTimerReset.addEventListener('click', resetTimer);
}

function renderMahabhutaElements() {
  if (!elements.mahabhutaGrid) return;
  elements.mahabhutaGrid.innerHTML = ayurvedicElements.map((el) => `
    <button class="mahabhuta-card glass-card p-3 text-left transition-all hover:scale-105 border-emerald-800/60" data-name="${el.name}">
      <div class="flex items-center justify-between">
        <span class="text-base font-serif font-bold text-amber-300">${el.sanskrit}</span>
        <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">${el.english}</span>
      </div>
      <p class="text-xs font-bold text-stone-100 mt-1">${el.name}</p>
      <p class="text-[10px] text-emerald-400/80 mt-0.5 truncate">${el.property}</p>
    </button>
  `).join('');

  document.querySelectorAll('.mahabhuta-card').forEach((card) => {
    card.addEventListener('click', () => {
      const el = ayurvedicElements.find(item => item.name === card.dataset.name);
      if (el) {
        if (window.soundEngine) window.soundEngine.playSingingBowlChime(528, 1.8);
        showToast(`${el.name} (${el.sanskrit}) — ${el.property}`, 'info');
      }
    });
  });
}

function renderPatientTable() {
  if (!elements.patientTableBody) return;
  const filtered = state.patients.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(state.searchQuery) ||
      p.id.toLowerCase().includes(state.searchQuery) ||
      p.dosha.toLowerCase().includes(state.searchQuery) ||
      p.therapist.toLowerCase().includes(state.searchQuery);

    let matchDosha = true;
    if (state.selectedDoshaFilter === 'Vata') matchDosha = p.dosha.includes('Vata');
    else if (state.selectedDoshaFilter === 'Pitta') matchDosha = p.dosha.includes('Pitta');
    else if (state.selectedDoshaFilter === 'Kapha') matchDosha = p.dosha.includes('Kapha');

    return matchSearch && matchDosha;
  });

  if (filtered.length === 0) {
    elements.patientTableBody.innerHTML = `<tr><td colspan="7" class="px-5 py-8 text-center text-stone-400">No patient records match the filter.</td></tr>`;
    return;
  }

  elements.patientTableBody.innerHTML = filtered.map((p) => {
    let doshaColor = p.dosha.includes('Vata') ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
      p.dosha.includes('Pitta') ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';

    let statusColor = p.status === 'Scheduled' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
      p.status === 'Completed' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

    return `
      <tr class="hover:bg-emerald-900/20 transition-colors">
        <td class="px-5 py-3.5">
          <p class="font-bold text-stone-100">${p.name}</p>
          <p class="text-emerald-400/80 text-[11px] font-mono">${p.id} • ${p.age}y, ${p.gender}</p>
        </td>
        <td class="px-5 py-3.5"><span class="inline-block px-2.5 py-0.5 rounded-lg font-semibold text-[11px] border ${doshaColor}">${p.dosha}</span></td>
        <td class="px-5 py-3.5 font-medium text-stone-200">${p.currentTherapy}</td>
        <td class="px-5 py-3.5">
          <div class="flex items-center gap-2">
            <span class="text-stone-300 font-medium">${p.dayCount}</span>
            <div class="w-16 bg-emerald-950 h-1.5 rounded-full overflow-hidden">
              <div class="bg-emerald-400 h-full" style="width: ${p.progressPercent}%"></div>
            </div>
          </div>
        </td>
        <td class="px-5 py-3.5"><p class="font-semibold text-stone-200">${p.therapist.split('(')[0]}</p><p class="text-stone-400 text-[11px]">${p.room}</p></td>
        <td class="px-5 py-3.5"><span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusColor}"><span class="w-1.5 h-1.5 rounded-full bg-current"></span>${p.status}</span></td>
        <td class="px-5 py-3.5 text-right">
          <button class="btn-view-chart px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 hover:text-white border border-emerald-800 text-[11px] font-semibold" data-id="${p.id}">View Chart</button>
        </td>
      </tr>
    `;
  }).join('');

  document.querySelectorAll('.btn-view-chart').forEach((btn) => {
    btn.addEventListener('click', () => openPatientDrawer(btn.dataset.id));
  });
  if (window.lucide) window.lucide.createIcons();
}

function openPatientDrawer(patientId) {
  const p = state.patients.find(item => item.id === patientId);
  if (!p) return;

  document.getElementById('drawer-patient-id').textContent = p.id;
  document.getElementById('drawer-patient-name').textContent = `${p.name} (${p.age}y, ${p.gender})`;
  document.getElementById('drawer-vata-pct').textContent = `${p.doshaBalance.vata}%`;
  document.getElementById('drawer-vata-bar').style.width = `${p.doshaBalance.vata}%`;
  document.getElementById('drawer-pitta-pct').textContent = `${p.doshaBalance.pitta}%`;
  document.getElementById('drawer-pitta-bar').style.width = `${p.doshaBalance.pitta}%`;
  document.getElementById('drawer-kapha-pct').textContent = `${p.doshaBalance.kapha}%`;
  document.getElementById('drawer-kapha-bar').style.width = `${p.doshaBalance.kapha}%`;
  document.getElementById('drawer-nadi-pulse').textContent = p.nadiPulse;
  document.getElementById('drawer-therapy').textContent = `${p.currentTherapy} (${p.phase})`;
  document.getElementById('drawer-formulations-list').innerHTML = p.formulations.map(f => `<li>${f}</li>`).join('');
  document.getElementById('drawer-diet').textContent = p.diet;
  document.getElementById('drawer-notes').textContent = p.notes;
  elements.drawerPatientDetails.classList.remove('hidden');

  if (window.soundEngine) window.soundEngine.playSingingBowlChime(720, 1.2);
}

function renderPipeline() {
  if (!elements.pipelineContainer) return;
  elements.pipelineContainer.innerHTML = scheduledTherapies.map((item) => `
    <div class="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/40 hover:border-emerald-700/60 transition-all">
      <div class="flex items-start gap-3">
        <span class="text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-lg font-mono">${item.time}</span>
        <div><p class="text-xs font-bold text-stone-100">${item.therapy}</p><p class="text-[11px] text-emerald-400/80">${item.patient} • ${item.room}</p></div>
      </div>
      <span class="text-[11px] font-medium text-stone-300 bg-emerald-900/50 px-2.5 py-0.5 rounded-lg border border-emerald-800/40">${item.therapist}</span>
    </div>
  `).join('');
}

function renderRooms() {
  if (!elements.roomsGrid) return;
  elements.roomsGrid.innerHTML = chikitsaRooms.map((rm) => {
    const isOccupied = rm.status === 'Occupied';
    return `
      <div class="glass-card p-5 space-y-3 ${isOccupied ? 'border-emerald-700/50' : 'border-stone-700/40'}">
        <div class="flex items-start justify-between">
          <div><span class="text-[10px] font-mono text-stone-400">${rm.id}</span><h4 class="font-bold text-sm text-stone-100 font-serif">${rm.name}</h4></div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${isOccupied ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-stone-800 text-stone-300 border border-stone-700'}">${rm.status}</span>
        </div>
        <p class="text-xs text-stone-300">${rm.type}</p>
        <div class="pt-2 border-t border-emerald-900/50 text-xs space-y-1">
          <div class="flex justify-between text-stone-400"><span>Current Patient:</span><span class="font-semibold text-stone-200">${rm.patient}</span></div>
          <div class="flex justify-between text-stone-400"><span>Oil Temperature:</span><span class="font-mono text-amber-300 font-semibold">${rm.oilTemp}</span></div>
          <div class="flex justify-between text-stone-400"><span>Micro-climate:</span><span class="text-stone-300">${rm.ambient}</span></div>
        </div>
      </div>
    `;
  }).join('');
}

function updateKPIs() {
  const count = state.patients.length;
  if (elements.badgePatientCount) elements.badgePatientCount.textContent = count;
  if (elements.kpiPatientCount) elements.kpiPatientCount.textContent = count;
}

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
    if (window.soundEngine) window.soundEngine.playSingingBowlChime(432, 2.0);

    state.timerInterval = setInterval(() => {
      if (state.timerRemaining > 0) {
        state.timerRemaining--;
        updateTimerDisplay();
      } else {
        clearInterval(state.timerInterval);
        state.timerRunning = false;
        elements.timerBtnText.textContent = 'Start';
        elements.timerBtnIcon.setAttribute('data-lucide', 'play');
        if (window.soundEngine) window.soundEngine.playSingingBowlChime(528, 4.0);
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

function startLiveClock() {
  const tick = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    if (elements.liveClock) elements.liveClock.textContent = `${timeStr} IST`;
  };
  tick();
  setInterval(tick, 1000);
}

// ============================================================================
// BILLING, INVOICE & PAYMENT CONTROLLER
// ============================================================================

function renderInvoices() {
  if (!elements.invoiceTableBody) return;

  const filtered = state.invoices.filter((inv) => {
    const matchSearch =
      inv.id.toLowerCase().includes(state.invoiceSearchQuery) ||
      inv.patientName.toLowerCase().includes(state.invoiceSearchQuery) ||
      inv.packageTitle.toLowerCase().includes(state.invoiceSearchQuery) ||
      inv.paymentMethod.toLowerCase().includes(state.invoiceSearchQuery) ||
      inv.transactionId.toLowerCase().includes(state.invoiceSearchQuery);

    let matchFilter = true;
    if (state.invoiceFilter === 'Paid') matchFilter = inv.status === 'Paid';
    else if (state.invoiceFilter === 'Pending') matchFilter = inv.status === 'Pending';
    else if (state.invoiceFilter === 'Insurance') matchFilter = inv.paymentMethod.toLowerCase().includes('insurance') || inv.paymentMethod.toLowerCase().includes('tpa');

    return matchSearch && matchFilter;
  });

  if (filtered.length === 0) {
    elements.invoiceTableBody.innerHTML = `<tr><td colspan="7" class="px-5 py-8 text-center text-stone-400">No invoices match the selected filter.</td></tr>`;
    return;
  }

  elements.invoiceTableBody.innerHTML = filtered.map((inv) => {
    const isPaid = inv.status === 'Paid';
    const statusBadge = isPaid
      ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Paid</span>`
      : `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40"><span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>Pending Due</span>`;

    return `
      <tr class="hover:bg-emerald-900/25 transition-colors">
        <td class="px-5 py-3.5">
          <span class="font-bold text-amber-300 font-mono text-xs block">${inv.id}</span>
          <span class="text-stone-400 text-[11px] font-mono">${inv.date}</span>
        </td>
        <td class="px-5 py-3.5">
          <p class="font-bold text-stone-100">${inv.patientName}</p>
          <p class="text-stone-400 text-[11px]">${inv.doctorName}</p>
        </td>
        <td class="px-5 py-3.5">
          <p class="font-medium text-stone-200 text-xs">${inv.packageTitle}</p>
          <p class="text-emerald-400/80 text-[11px]">${inv.items.length} items billed</p>
        </td>
        <td class="px-5 py-3.5 font-mono">
          <p class="font-bold text-white text-xs">₹${inv.totalAmount.toLocaleString('en-IN')}</p>
          <p class="text-stone-400 text-[10px]">GST (5%): ₹${inv.taxGst.toLocaleString('en-IN')}</p>
        </td>
        <td class="px-5 py-3.5 text-xs">
          <p class="font-medium text-stone-300">${inv.paymentMethod}</p>
          <p class="text-stone-500 text-[10px] font-mono">${inv.transactionId}</p>
        </td>
        <td class="px-5 py-3.5">
          ${statusBadge}
        </td>
        <td class="px-5 py-3.5 text-right space-x-1.5">
          <button class="btn-view-invoice px-2.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-800 text-[11px] font-semibold transition-all" data-id="${inv.id}">
            View Invoice
          </button>
          ${!isPaid ? `
            <button class="btn-pay-now btn-gold px-3 py-1.5 rounded-lg text-[11px] font-bold shadow transition-all" data-id="${inv.id}">
              Pay Now
            </button>
          ` : ''}
        </td>
      </tr>
    `;
  }).join('');

  document.querySelectorAll('.btn-view-invoice').forEach((btn) => {
    btn.addEventListener('click', () => openInvoiceViewer(btn.dataset.id));
  });

  document.querySelectorAll('.btn-pay-now').forEach((btn) => {
    btn.addEventListener('click', () => openPaymentModal(btn.dataset.id));
  });

  if (window.lucide) window.lucide.createIcons();
}

function renderRevenueKPIs() {
  const totalInvoiced = state.invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalCollected = state.invoices.filter(i => i.status === 'Paid').reduce((acc, inv) => acc + inv.amountPaid, 0);
  const pendingBalance = state.invoices.filter(i => i.status === 'Pending').reduce((acc, inv) => acc + inv.balanceDue, 0);
  const pendingCount = state.invoices.filter(i => i.status === 'Pending').length;
  const rate = totalInvoiced > 0 ? ((totalCollected / totalInvoiced) * 100).toFixed(1) : 0;

  if (elements.kpiTotalInvoiced) elements.kpiTotalInvoiced.textContent = `₹${totalInvoiced.toLocaleString('en-IN')}`;
  if (elements.kpiTotalCollected) elements.kpiTotalCollected.textContent = `₹${totalCollected.toLocaleString('en-IN')}`;
  if (elements.kpiCollectionRate) elements.kpiCollectionRate.textContent = `${rate}% Realized Revenue`;
  if (elements.kpiPendingBalance) elements.kpiPendingBalance.textContent = `₹${pendingBalance.toLocaleString('en-IN')}`;
  if (elements.kpiPendingCount) elements.kpiPendingCount.textContent = `${pendingCount} Unsettled / Due`;
  if (elements.badgeInvoiceCount) elements.badgeInvoiceCount.textContent = state.invoices.length;
}

function renderTariffCatalog() {
  if (!elements.tariffCatalogGrid) return;
  elements.tariffCatalogGrid.innerHTML = pricingCatalog.slice(0, 6).map((item) => `
    <div class="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-900/50 hover:border-amber-500/40 transition-all">
      <span class="text-[9px] font-mono text-stone-400 block">${item.code} • ${item.type}</span>
      <p class="font-bold text-stone-100 text-xs mt-0.5 truncate">${item.name}</p>
      <p class="font-bold text-amber-300 font-mono text-xs mt-1">₹${item.price.toLocaleString('en-IN')}</p>
    </div>
  `).join('');
}

function setupBillingListeners() {
  if (elements.invoiceSearchInput) {
    elements.invoiceSearchInput.addEventListener('input', (e) => {
      state.invoiceSearchQuery = e.target.value.trim().toLowerCase();
      renderInvoices();
    });
  }

  if (elements.invoiceFilterContainer) {
    elements.invoiceFilterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.inv-filter-btn');
      if (!btn) return;
      document.querySelectorAll('.inv-filter-btn').forEach(b => {
        b.classList.remove('active', 'bg-emerald-800/80', 'text-white');
        b.classList.add('bg-emerald-950/40');
      });
      btn.classList.add('active', 'bg-emerald-800/80', 'text-white');
      btn.classList.remove('bg-emerald-950/40');
      state.invoiceFilter = btn.dataset.filter;
      renderInvoices();
    });
  }

  // Payment Checkout Modal
  const closePayModal = () => {
    elements.modalPaymentCheckout?.classList.add('hidden');
    elements.paymentProcessingState?.classList.add('hidden');
    elements.paymentActionsFooter?.classList.remove('hidden');
    state.selectedInvoiceForPayment = null;
  };

  if (elements.btnClosePayModal) elements.btnClosePayModal.addEventListener('click', closePayModal);
  if (elements.btnCancelPay) elements.btnCancelPay.addEventListener('click', closePayModal);

  // Tabs Switching inside Payment Checkout
  if (elements.payMethodsTabs) {
    elements.payMethodsTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.pay-tab-btn');
      if (!btn) return;
      document.querySelectorAll('.pay-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      state.activePaymentTab = tab;

      document.querySelectorAll('.pay-tab-content').forEach(c => c.classList.add('hidden'));
      const activeContent = document.getElementById(`pay-content-${tab}`);
      if (activeContent) activeContent.classList.remove('hidden');
    });
  }

  // Live Card Visualizer sync
  if (elements.inputCardNumber) {
    elements.inputCardNumber.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      val = val.match(/.{1,4}/g)?.join(' ') || val;
      e.target.value = val;
      if (elements.cardPreviewNumber) elements.cardPreviewNumber.textContent = val || '4532 •••• •••• 8821';
    });
  }
  if (elements.inputCardName) {
    elements.inputCardName.addEventListener('input', (e) => {
      if (elements.cardPreviewName) elements.cardPreviewName.textContent = e.target.value.toUpperCase() || 'PATIENT NAME';
    });
  }
  if (elements.inputCardExpiry) {
    elements.inputCardExpiry.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 3) val = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
      e.target.value = val;
      if (elements.cardPreviewExpiry) elements.cardPreviewExpiry.textContent = val || 'MM/YY';
    });
  }

  // Execute Simulated Payment
  if (elements.btnExecutePayment) {
    elements.btnExecutePayment.addEventListener('click', executePayment);
  }

  // Invoice Viewer Modal Close
  if (elements.btnCloseInvoiceViewer) {
    elements.btnCloseInvoiceViewer.addEventListener('click', () => {
      elements.modalInvoiceViewer?.classList.add('hidden');
    });
  }

  // Create Invoice Modal Open & Close
  if (elements.btnOpenCreateInvoice) {
    elements.btnOpenCreateInvoice.addEventListener('click', openCreateInvoiceModal);
  }
  if (elements.btnCloseCreateInvModal) {
    elements.btnCloseCreateInvModal.addEventListener('click', () => {
      elements.modalCreateInvoice?.classList.add('hidden');
    });
  }
  if (elements.btnCancelCreateInv) {
    elements.btnCancelCreateInv.addEventListener('click', () => {
      elements.modalCreateInvoice?.classList.add('hidden');
    });
  }

  if (elements.formCreateInvoice) {
    elements.formCreateInvoice.addEventListener('submit', saveNewInvoice);
  }
}

function openPaymentModal(invoiceId) {
  const inv = state.invoices.find(i => i.id === invoiceId);
  if (!inv) return;

  state.selectedInvoiceForPayment = inv;
  if (elements.paySummaryInvid) elements.paySummaryInvid.textContent = inv.id;
  if (elements.paySummaryPatient) elements.paySummaryPatient.textContent = inv.patientName;
  if (elements.paySummaryPackage) elements.paySummaryPackage.textContent = inv.packageTitle;
  if (elements.paySummaryAmount) elements.paySummaryAmount.textContent = `₹${inv.balanceDue.toLocaleString('en-IN')}`;
  if (elements.btnPayLabel) elements.btnPayLabel.textContent = `Authorize & Pay ₹${inv.balanceDue.toLocaleString('en-IN')}`;

  // Default cardholder sync
  if (elements.inputCardName) elements.inputCardName.value = inv.patientName;
  if (elements.cardPreviewName) elements.cardPreviewName.textContent = inv.patientName.toUpperCase();

  elements.paymentProcessingState?.classList.add('hidden');
  elements.paymentActionsFooter?.classList.remove('hidden');
  elements.modalPaymentCheckout?.classList.remove('hidden');

  if (window.soundEngine) window.soundEngine.playSingingBowlChime(480, 1.2);
}

function executePayment() {
  const inv = state.selectedInvoiceForPayment;
  if (!inv) return;

  elements.paymentProcessingState?.classList.remove('hidden');
  elements.paymentActionsFooter?.classList.add('hidden');

  const steps = [
    'Connecting to secure banking gateway...',
    'Authenticating encrypted card / UPI tokens...',
    'Authorizing transaction with Ayush National POS...',
    'Payment Authorized Successfully!'
  ];

  let stepIdx = 0;
  const interval = setInterval(() => {
    stepIdx++;
    if (elements.processingStatusText && steps[stepIdx]) {
      elements.processingStatusText.textContent = steps[stepIdx];
    }
    if (stepIdx >= steps.length) {
      clearInterval(interval);

      const txnId = `TXN-AYUR-${Math.floor(100000 + Math.random() * 900000)}`;
      const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      let methodLabel = 'UPI (GPay / PhonePe)';
      if (state.activePaymentTab === 'card') methodLabel = 'RuPay / VISA Platinum (•••• 8821)';
      else if (state.activePaymentTab === 'netbanking') methodLabel = 'Net Banking (SBI Bank)';
      else if (state.activePaymentTab === 'insurance') methodLabel = 'Ayush TPA Cashless Claim (Star Health)';
      else if (state.activePaymentTab === 'cash') methodLabel = 'Cash at Billing Desk';

      // Update Invoice State
      inv.status = 'Paid';
      inv.paymentMethod = methodLabel;
      inv.transactionId = txnId;
      inv.paidAt = nowStr;
      inv.amountPaid = inv.totalAmount;
      inv.balanceDue = 0;

      renderInvoices();
      renderRevenueKPIs();

      if (window.soundEngine) window.soundEngine.playSingingBowlChime(528, 3.0);
      showToast(`Payment of ₹${inv.totalAmount.toLocaleString('en-IN')} Received! (${txnId})`, 'success');

      elements.modalPaymentCheckout?.classList.add('hidden');
      openInvoiceViewer(inv.id);
    }
  }, 400);
}

function openInvoiceViewer(invoiceId) {
  const inv = state.invoices.find(i => i.id === invoiceId);
  if (!inv) return;

  document.getElementById('inv-view-id').textContent = inv.id;
  document.getElementById('inv-view-date').textContent = inv.date;
  document.getElementById('inv-view-patient-name').textContent = inv.patientName;
  document.getElementById('inv-view-patient-id').textContent = `Patient ID: ${inv.patientId}`;
  document.getElementById('inv-view-patient-contact').textContent = inv.contact;
  document.getElementById('inv-view-doctor').textContent = inv.doctorName;
  document.getElementById('inv-view-package').textContent = inv.packageTitle;

  const badge = document.getElementById('inv-view-badge');
  if (inv.status === 'Paid') {
    badge.textContent = 'PAID';
    badge.className = 'inline-flex px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
  } else {
    badge.textContent = 'PENDING DUE';
    badge.className = 'inline-flex px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40';
  }

  // Items table
  const tbody = document.getElementById('inv-view-items-body');
  tbody.innerHTML = inv.items.map((item, idx) => `
    <tr class="hover:bg-emerald-900/20">
      <td class="px-4 py-2.5 font-mono text-stone-400">${idx + 1}</td>
      <td class="px-4 py-2.5 font-medium text-stone-100">${item.description}</td>
      <td class="px-4 py-2.5 text-center font-mono text-stone-300">${item.qty}</td>
      <td class="px-4 py-2.5 text-right font-mono text-stone-300">₹${item.rate.toLocaleString('en-IN')}</td>
      <td class="px-4 py-2.5 text-right font-mono font-bold text-white">₹${item.amount.toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  document.getElementById('inv-view-pay-method').textContent = `${inv.paymentMethod} • ${inv.transactionId}`;
  document.getElementById('inv-view-paid-date').textContent = `Settlement Status: ${inv.paidAt}`;
  document.getElementById('inv-view-subtotal').textContent = `₹${inv.subtotal.toLocaleString('en-IN')}`;
  document.getElementById('inv-view-gst').textContent = `₹${inv.taxGst.toLocaleString('en-IN')}`;
  document.getElementById('inv-view-discount').textContent = `-₹${inv.discount.toLocaleString('en-IN')}`;
  document.getElementById('inv-view-total').textContent = `₹${inv.totalAmount.toLocaleString('en-IN')}`;
  document.getElementById('inv-view-amount-paid').textContent = `₹${inv.amountPaid.toLocaleString('en-IN')}`;
  document.getElementById('inv-view-balance-due').textContent = `₹${inv.balanceDue.toLocaleString('en-IN')}`;

  elements.modalInvoiceViewer?.classList.remove('hidden');
  if (window.soundEngine) window.soundEngine.playSingingBowlChime(640, 1.2);
}

function openCreateInvoiceModal() {
  if (elements.createInvPatientSelect) {
    elements.createInvPatientSelect.innerHTML = state.patients.map(p => `
      <option value="${p.id}">${p.name} (${p.id} • ${p.currentTherapy})</option>
    `).join('');
  }
  elements.modalCreateInvoice?.classList.remove('hidden');
}

function saveNewInvoice(e) {
  e.preventDefault();
  const patientId = elements.createInvPatientSelect.value;
  const patient = state.patients.find(p => p.id === patientId) || state.patients[0];
  const pkgTitle = document.getElementById('create-inv-package').value.trim();
  const therapyCharge = parseFloat(document.getElementById('create-inv-therapy-charge').value) || 0;
  const roomCharge = parseFloat(document.getElementById('create-inv-room-charge').value) || 0;
  const medCharge = parseFloat(document.getElementById('create-inv-med-charge').value) || 0;
  const discount = parseFloat(document.getElementById('create-inv-discount').value) || 0;
  const initialStatus = document.getElementById('create-inv-status').value;

  const subtotal = therapyCharge + roomCharge + medCharge;
  const taxGst = Math.round(subtotal * 0.05);
  const totalAmount = Math.max(0, subtotal + taxGst - discount);
  const isPaid = initialStatus === 'Paid';

  const newInvId = `INV-2026-${100 + state.invoices.length + 1}`;
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  const newInvoice = {
    id: newInvId,
    patientId: patient.id,
    patientName: patient.name,
    contact: patient.contact,
    date: dateStr,
    dueDate: dateStr,
    doctorName: patient.therapist,
    packageTitle: pkgTitle,
    status: initialStatus,
    paymentMethod: isPaid ? 'UPI (Instant QR Realization)' : 'Pending Payment',
    transactionId: isPaid ? `TXN-AYUR-${Math.floor(100000 + Math.random() * 900000)}` : 'N/A',
    paidAt: isPaid ? now.toLocaleString('en-IN') : 'Unpaid',
    items: [
      { description: `${pkgTitle} Core Therapy Sessions`, qty: 1, rate: therapyCharge, amount: therapyCharge },
      { description: `Chikitsa Private Suite Inpatient Accommodation`, qty: 1, rate: roomCharge, amount: roomCharge },
      { description: `Classical Medicated Tailas & Ayurvedic Formulations`, qty: 1, rate: medCharge, amount: medCharge }
    ],
    subtotal,
    gstPercent: 5,
    taxGst,
    discount,
    totalAmount,
    amountPaid: isPaid ? totalAmount : 0,
    balanceDue: isPaid ? 0 : totalAmount
  };

  state.invoices.unshift(newInvoice);
  renderInvoices();
  renderRevenueKPIs();
  elements.modalCreateInvoice?.classList.add('hidden');

  if (window.soundEngine) window.soundEngine.playSingingBowlChime(528, 2.0);
  showToast(`Created tax invoice ${newInvId} for ${patient.name} (₹${totalAmount.toLocaleString('en-IN')})`, 'success');
}

function showToast(message, type = 'info') {
  if (!elements.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all transform translate-y-2 opacity-0 pointer-events-auto ${
    type === 'success' ? 'bg-emerald-950/95 text-emerald-200 border-emerald-500/60 shadow-emerald-900/50' : 'bg-stone-900/95 text-amber-200 border-amber-500/60 shadow-amber-900/50'
  }`;
  toast.innerHTML = `<span class="w-2 h-2 rounded-full ${type === 'success' ? 'bg-emerald-400' : 'bg-amber-400'}"></span><span>${message}</span>`;
  elements.toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.remove('translate-y-2', 'opacity-0'));
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// Export for global access in HTML onclick attributes
window.openCreateInvoiceModal = openCreateInvoiceModal;
window.openInvoiceViewer = openInvoiceViewer;
window.openPaymentModal = openPaymentModal;
window.showToast = showToast;
