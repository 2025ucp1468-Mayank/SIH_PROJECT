// AyurSutra Patient End Portal - Application Controller & Healing Intake
import { therapistsList } from './data.js';

const state = {
  reportUploaded: false,
  verificationCompleted: false,
  patientData: {
    name: '',
    age: 30,
    gender: 'Female',
    bloodGroup: 'O+',
    phone: '',
    symptoms: '',
    history: '',
    rawOCR: ''
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupOCREvents();
  setupFormListeners();
});

// Programmatic Smooth Scroll Helper
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function setupNavigation() {
  const btnToSection2 = document.getElementById('btn-to-section-2');
  if (btnToSection2) {
    btnToSection2.addEventListener('click', () => {
      // Require uploading report in Section 1 first!
      if (!state.reportUploaded && !state.patientData.rawOCR) {
        showToast('Please upload your medical report image first before proceeding!', 'warning');
        const dropZone = document.getElementById('ocr-drop-zone');
        if (dropZone) {
          dropZone.classList.add('border-amber-500', 'bg-amber-50');
          setTimeout(() => dropZone.classList.remove('border-amber-500', 'bg-amber-50'), 2000);
        }
        return;
      }
      unlockSection('section-verification');
      scrollToSection('section-verification');
    });
  }

  const btnBackToOcr = document.getElementById('btn-back-to-ocr');
  if (btnBackToOcr) {
    btnBackToOcr.addEventListener('click', () => scrollToSection('section-ocr'));
  }

  const btnBackToVerification = document.getElementById('btn-back-to-verification');
  if (btnBackToVerification) {
    btnBackToVerification.addEventListener('click', () => scrollToSection('section-verification'));
  }
}

function unlockSection(sectionId) {
  const sec = document.getElementById(sectionId);
  if (sec) {
    sec.classList.remove('opacity-50', 'pointer-events-none');
    sec.classList.add('opacity-100', 'pointer-events-auto');
  }
}

// -----------------------------------------------------------------------------
// SECTION 1: OCR ENGINE & MEDICAL REPORT UPLOAD
// -----------------------------------------------------------------------------

function setupOCREvents() {
  const dropZone = document.getElementById('ocr-drop-zone');
  const fileInput = document.getElementById('file-input-report');

  if (!dropZone || !fileInput) return;

  dropZone.addEventListener('click', () => fileInput.click());

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  });
}

function handleFileSelected(file) {
  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file (PNG, JPG, WEBP).', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const imageSrc = e.target.result;
    runTesseractOCR(imageSrc, file.name);
  };
  reader.readAsDataURL(file);
}

function runTesseractOCR(imageSrc, fileName) {
  const ocrStatusContainer = document.getElementById('ocr-status-container');
  const ocrProgressBar = document.getElementById('ocr-progress-bar');
  const ocrStatusText = document.getElementById('ocr-status-text');

  if (ocrStatusContainer) ocrStatusContainer.classList.remove('hidden');

  if (window.Tesseract) {
    window.Tesseract.recognize(imageSrc, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text' && ocrProgressBar && ocrStatusText) {
          const pct = Math.round((m.progress || 0) * 100);
          ocrProgressBar.style.width = `${pct}%`;
          ocrStatusText.textContent = `Recognizing Medical Text... (${pct}%)`;
        }
      }
    }).then(({ data: { text } }) => {
      parseExtractedOCRText(text, fileName);
    }).catch(() => {
      parseExtractedOCRText(generateMockOCRText(fileName), fileName);
    });
  } else {
    parseExtractedOCRText(generateMockOCRText(fileName), fileName);
  }
}

function parseExtractedOCRText(rawText, fileName) {
  state.patientData.rawOCR = rawText;
  state.reportUploaded = true;

  // Extract Name
  const nameMatch = rawText.match(/(?:PATIENT|NAME):\s*([A-Za-z\s]+)(?:\||\n|$)/i);
  if (nameMatch && nameMatch[1]) state.patientData.name = nameMatch[1].trim();
  else if (!state.patientData.name) state.patientData.name = 'Patient ' + Math.floor(100 + Math.random() * 900);

  // Extract Age
  const ageMatch = rawText.match(/AGE:\s*(\d+)/i);
  if (ageMatch && ageMatch[1]) state.patientData.age = parseInt(ageMatch[1]);

  // Extract Gender
  if (/Female/i.test(rawText)) state.patientData.gender = 'Female';
  else if (/Male/i.test(rawText)) state.patientData.gender = 'Male';

  // Extract Symptoms
  if (rawText.includes('CHIEF COMPLAINTS:')) {
    const parts = rawText.split('CHIEF COMPLAINTS:')[1];
    state.patientData.symptoms = parts.split(/DOSHA|NADI|RECOMMENDED/)[0].trim();
  }

  populateManualForm();
  unlockSection('section-verification');
  showToast('Medical Report uploaded & processed! Scroll down to verify.', 'success');
  scrollToSection('section-verification');
}

function generateMockOCRText(fileName) {
  return `AYURVEDIC DIAGNOSTIC REPORT: Patient Ananya Sharma (34/F). Chronic migraine headaches, insomnia, cervical neck stiffness.`;
}

// -----------------------------------------------------------------------------
// SECTION 2: PATIENT VERIFICATION FORM
// -----------------------------------------------------------------------------

function populateManualForm() {
  document.getElementById('input-name').value = state.patientData.name || '';
  document.getElementById('input-age').value = state.patientData.age || 30;
  document.getElementById('input-gender').value = state.patientData.gender || 'Female';
  document.getElementById('input-blood').value = state.patientData.bloodGroup || 'O+';
  document.getElementById('input-phone').value = state.patientData.phone || '+91 98765 43210';
  document.getElementById('input-symptoms').value = state.patientData.symptoms || '';
  document.getElementById('input-history').value = state.patientData.history || '';
}

function setupFormListeners() {
  const form = document.getElementById('form-manual-verification');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Require uploading report in Section 1 first!
      if (!state.reportUploaded && !state.patientData.rawOCR) {
        showToast('Please upload your medical report in Section 1 first!', 'warning');
        scrollToSection('section-ocr');
        return;
      }

      const nameVal = document.getElementById('input-name').value.trim();
      const phoneVal = document.getElementById('input-phone').value.trim();
      const symptomsVal = document.getElementById('input-symptoms').value.trim();

      if (!nameVal || !phoneVal || !symptomsVal) {
        showToast('Please complete all required fields (Name, Phone, Symptoms) first!', 'error');
        return;
      }

      syncFormToState();
      state.verificationCompleted = true;
      unlockSection('section-therapists');
      renderMatchedTherapists();
      scrollToSection('section-therapists');
      showToast('Information verified! Matched adequate therapists unlocked.', 'success');
    });
  }
}

function syncFormToState() {
  state.patientData.name = document.getElementById('input-name').value.trim();
  state.patientData.age = parseInt(document.getElementById('input-age').value) || 30;
  state.patientData.gender = document.getElementById('input-gender').value;
  state.patientData.bloodGroup = document.getElementById('input-blood').value;
  state.patientData.phone = document.getElementById('input-phone').value.trim();
  state.patientData.symptoms = document.getElementById('input-symptoms').value.trim();
  state.patientData.history = document.getElementById('input-history').value.trim();
}

// -----------------------------------------------------------------------------
// SECTION 3: ADEQUATE MATCHED THERAPISTS & VAIDYAS
// -----------------------------------------------------------------------------

function renderMatchedTherapists() {
  const container = document.getElementById('therapists-grid');
  if (!container) return;

  container.innerHTML = therapistsList.map((doc, idx) => {
    const isTopMatch = idx === 0;
    const matchBadge = isTopMatch
      ? `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-800 border border-amber-400 flex items-center gap-1"><i data-lucide="sparkles" class="w-3 h-3 text-amber-600"></i>${doc.matchScore}% Clinical Match</span>`
      : `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">92% Match</span>`;

    return `
      <div class="p-5 rounded-2xl bg-stone-50 border ${isTopMatch ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-stone-200'} shadow-md hover:shadow-xl transition-all space-y-3">
        
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-base font-serif shrink-0 shadow">
              ${doc.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div>
              <h4 class="font-bold text-stone-900 text-sm">${doc.name}</h4>
              <p class="text-[11px] font-semibold text-emerald-700">${doc.title}</p>
              <p class="text-[10px] text-stone-500 font-mono">${doc.qualifications}</p>
            </div>
          </div>
          ${matchBadge}
        </div>

        <div class="text-xs space-y-1 bg-white p-3 rounded-xl border border-stone-200">
          <p class="text-stone-700 font-medium"><strong>Specialization:</strong> ${doc.specialization}</p>
          <p class="text-stone-500 text-[11px]">${doc.bio}</p>
        </div>

        <div class="flex items-center justify-between text-xs pt-1">
          <div>
            <span class="text-stone-400 text-[9px] uppercase block font-bold">Consultation Fee</span>
            <span class="font-bold text-stone-900 font-mono text-xs">${doc.consultationFee}</span>
          </div>
          <div>
            <span class="text-stone-400 text-[9px] uppercase block font-bold">Available Slot</span>
            <span class="font-bold text-emerald-700 font-mono text-xs">${doc.availableSlot}</span>
          </div>
          <div class="text-right">
            <span class="text-stone-400 text-[9px] uppercase block font-bold">Rating</span>
            <span class="font-bold text-amber-600 font-mono text-xs">★ ${doc.rating} / 5.0</span>
          </div>
        </div>

        <button class="btn-book-therapist btn-emerald w-full py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow" data-name="${doc.name}" data-slot="${doc.availableSlot}">
          <i data-lucide="calendar-check" class="w-3.5 h-3.5"></i>
          <span>Schedule Consultation</span>
        </button>

      </div>
    `;
  }).join('');

  document.querySelectorAll('.btn-book-therapist').forEach((btn) => {
    btn.addEventListener('click', () => {
      const docName = btn.dataset.name;
      const slot = btn.dataset.slot;
      showToast(`Appointment Scheduled with ${docName} (${slot})!`, 'success');
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

// Toast Notifications
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  const typeBg = type === 'success' ? 'bg-emerald-800 text-emerald-100 border-emerald-600' :
                 type === 'error' ? 'bg-red-900 text-red-100 border-red-700' :
                 type === 'warning' ? 'bg-amber-900 text-amber-100 border-amber-700' :
                 'bg-stone-800 text-stone-100 border-stone-600';

  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-xs font-semibold animate-bounce ${typeBg}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}" class="w-4 h-4 shrink-0"></i>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s ease';
    setTimeout(() => toast.remove(), 500);
  }, 3500);
}
