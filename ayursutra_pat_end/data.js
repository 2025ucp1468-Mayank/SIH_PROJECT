// AyurSutra Patient End - Medical Report Presets & Panchakarma Treatment Data

export const sampleReports = [
  {
    id: 'report-migraine',
    title: 'Migraine & Neurological Diagnostic Report',
    subtitle: 'Vata-Pitta Imbalance • Cervical & Head Vascular Assessment',
    patientName: 'Ananya Sharma',
    age: 34,
    gender: 'Female',
    bloodGroup: 'O+',
    phone: '+91 98765 43210',
    doshaBalance: { vata: 55, pitta: 35, kapha: 10 },
    nadiPulse: 'Vata-Pitta (Chapa & Sarpa Gati)',
    symptoms: 'Chronic left-sided migraine headaches, sensitivity to sound and bright light, insomnia, cervical neck stiffness, elevated stress.',
    medicalHistory: 'Cervical spondylosis since 2023, high workload burnout, frequent analgesic usage.',
    rawOCRText: `AYURVEDIC DIAGNOSTIC & CLINICAL REPORT
PATIENT: Ananya Sharma | AGE: 34 | GENDER: Female | BLOOD: O+
PHONE: +91 98765 43210 | CLINIC: AyurSutra Central Sanctorum
----------------------------------------------------------------
CHIEF COMPLAINTS:
Patient reports severe throbbing migraine headaches recurring 3-4 times weekly.
Cervical spine stiffness extending to occipital region. Disturbed sleep cycle.

DOSHA DIAGNOSTIC EVALUATION:
Vata Dosha: 55% (Aggravated - Prana & Vyana Vayu)
Pitta Dosha: 35% (Elevated - Sadhaka Pitta)
Kapha Dosha: 10% (Deficient)

NADI PARIKSHA FINDINGS:
Pulse Type: Vata-Pitta Gati (Chapa & Sarpa Gati - Cobra/Frog pulse)
Agni Status: Vishama Agni (Irregular Digestive Capacity)

RECOMMENDED THERAPY CANDIDACY:
Purva Karma: Sarvanga Abhyanga with Mahanarayana & Dhanwantharam Taila
Pradhana Karma: Takradhara & Shirodhara Protocol (38.5°C Medicated Flow)
Pharmacy: Brahmi Ghrita, Ksheerabala 101 Drops, Saraswatarishta`
  },
  {
    id: 'report-sinus',
    title: 'Chronic Sinusitis & Metabolic Diagnostic Report',
    subtitle: 'Kapha Predominant • Respiratory & Mucus Congestion',
    patientName: 'Rajesh Verma',
    age: 48,
    gender: 'Male',
    bloodGroup: 'B+',
    phone: '+91 91234 56789',
    doshaBalance: { vata: 15, pitta: 25, kapha: 60 },
    nadiPulse: 'Kapha (Mando Gati / Hamsa Gati)',
    symptoms: 'Heaviness in forehead, chronic sinus obstruction, sluggish digestion, daytime lethargy, excess throat mucus.',
    medicalHistory: 'Fatty liver grade 1 diagnosed in 2024, recurrent seasonal allergic rhinitis.',
    rawOCRText: `AYURVEDIC DIAGNOSTIC & CLINICAL REPORT
PATIENT: Rajesh Verma | AGE: 48 | GENDER: Male | BLOOD: B+
PHONE: +91 91234 56789 | CLINIC: AyurSutra Coastal Retreat
----------------------------------------------------------------
CHIEF COMPLAINTS:
Chronic sinus blockage, heaviness in chest, sluggish morning metabolism.
Persistent mucus accumulation in nasal passages.

DOSHA DIAGNOSTIC EVALUATION:
Vata Dosha: 15% (Normal)
Pitta Dosha: 25% (Moderate)
Kapha Dosha: 60% (Severely Aggravated - Kledaka & Bodhaka Kapha)

NADI PARIKSHA FINDINGS:
Pulse Type: Kapha Mando Gati (Slow swan-like pulse)
Agni Status: Manda Agni (Low metabolic fire)

RECOMMENDED THERAPY CANDIDACY:
Purva Karma: Snehapana (Internal Oleation with Sukumara Ghrita) & Swedana
Pradhana Karma: Vamana Karma (Therapeutic Emetic Shodhana)
Pharmacy: Triphala Kashayam, Trikatu Churna, Kanchanar Guggulu`
  },
  {
    id: 'report-sciatica',
    title: 'Sciatica & Spine MRI Diagnostic Report',
    subtitle: 'Vata Predominant • Lumbar L4-L5 Compression',
    patientName: 'Devendra Pant',
    age: 62,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+91 94112 34567',
    doshaBalance: { vata: 65, pitta: 20, kapha: 15 },
    nadiPulse: 'Vata-Mando Gati (Gridhrasi Pulse)',
    symptoms: 'Radiating pain along left posterior thigh to foot, morning lower back stiffness, cold lower extremities.',
    medicalHistory: 'MRI confirms L4-L5 disc protrusion with neural foraminal narrowing.',
    rawOCRText: `AYURVEDIC DIAGNOSTIC & CLINICAL REPORT
PATIENT: Devendra Pant | AGE: 62 | GENDER: Male | BLOOD: O+
PHONE: +91 94112 34567 | CLINIC: AyurSutra Himalayan Sanctuary
----------------------------------------------------------------
CHIEF COMPLAINTS:
Gridhrasi (Sciatica) symptoms with sharp radiating neuralgic pain down left leg.
Inability to sit continuously for more than 20 minutes.

DOSHA DIAGNOSTIC EVALUATION:
Vata Dosha: 65% (Severely Aggravated - Apana Vayu)
Pitta Dosha: 20% (Subdued)
Kapha Dosha: 15% (Deficient)

NADI PARIKSHA FINDINGS:
Pulse Type: Vata Gridhrasi Gati (Tremulous irregular nerve pulse)
Agni Status: Sama Agni

RECOMMENDED THERAPY CANDIDACY:
Purva Karma: Kati Basti (Warm Medicated Oil Reservoir on Lumbar)
Pradhana Karma: Sneha & Kashaya Basti Enema Protocol
Pharmacy: Yogaraja Guggulu, Sahacharadi Kashayam, Ksheerabala 101`
  }
];

export const therapistsList = [
  {
    id: 'doc-001',
    name: 'Dr. Ramesh Vaidya',
    title: 'Chief Acharya & Head Vaidya',
    qualifications: 'BAMS, MD (Panchakarma), PhD',
    specialization: 'Vata Neurological & Spine Disorders',
    doshaFocus: 'Vata',
    matchScore: 98,
    experience: '24 Years Exp',
    rating: 4.95,
    clinic: 'Jaipur Central Sanctorum',
    consultationFee: '₹1,200',
    availableSlot: 'Today 04:30 PM',
    therapiesMastered: ['Shirodhara', 'Sarvanga Abhyanga', 'Sneha Basti', 'Kati Basti'],
    bio: 'Renowned expert in classical Shodhana chikitsa, Vata-Pitta migraine recalibration, and spinal alignment.'
  },
  {
    id: 'doc-002',
    name: 'Vaidya Sneha Nair',
    title: 'Senior Panchakarma Specialist',
    qualifications: 'BAMS, MD (Kerala Panchakarma)',
    specialization: 'Shirodhara, Takradhara & Stress Management',
    doshaFocus: 'Pitta',
    matchScore: 95,
    experience: '14 Years Exp',
    rating: 4.90,
    clinic: 'Fort Kochi Retreat',
    consultationFee: '₹950',
    availableSlot: 'Tomorrow 10:00 AM',
    therapiesMastered: ['Takradhara', 'Virechana Karma', 'Kashaya Basti', 'Shiro Pichu'],
    bio: 'Mastery in Ashtavaidya Kerala traditions, specializing in psychosomatic therapies, insomnia, and Pitta detox.'
  },
  {
    id: 'doc-003',
    name: 'Vaidya Harish Chandra',
    title: 'Senior Nadi Pariksha Consultant',
    qualifications: 'BAMS, MS (Shalya Tantra)',
    specialization: 'Nadi Pulse & Respiratory Nasya',
    doshaFocus: 'Kapha',
    matchScore: 94,
    experience: '18 Years Exp',
    rating: 4.88,
    clinic: 'Jaipur Central Sanctorum',
    consultationFee: '₹1,000',
    availableSlot: 'Today 05:15 PM',
    therapiesMastered: ['Vamana Karma', 'Nasya Karma', 'Udgharshana', 'Bashpa Swedana'],
    bio: 'Expert pulse diagnostician capable of identifying deep-seated Kapha blockages and sinus clearance protocols.'
  },
  {
    id: 'doc-004',
    name: 'Dr. Meenakshi Menon',
    title: 'Lead Rasayana & Hormonal Expert',
    qualifications: 'BAMS, MD (Prasuti Tantra)',
    specialization: 'Rasayana Therapy & Endocrine Health',
    doshaFocus: 'Vata',
    matchScore: 92,
    experience: '16 Years Exp',
    rating: 4.92,
    clinic: 'Fort Kochi Retreat',
    consultationFee: '₹1,100',
    availableSlot: 'Tomorrow 02:30 PM',
    therapiesMastered: ['Takradhara', 'Rasayana Abhyanga', 'Kashaya Basti'],
    bio: 'Integrates classical herbal Rasayana protocols with hormonal recalibration and stress management.'
  }
];

export const doshaTherapyMap = {
  Vata: {
    therapies: ['Sarvanga Abhyanga', 'Shirodhara', 'Sneha Basti', 'Kati Basti'],
    formulations: ['Mahanarayana Taila', 'Brahmi Ghrita', 'Ksheerabala 101', 'Sahacharadi Kashayam'],
    diet: ['Warm cooked grains', 'Cow Ghee', 'Moong Dal Yusha', 'Cardamom & Saffron Milk'],
    restrictions: ['Cold refrigerated food', 'Dry raw salads', 'Late night screen exposure', 'Fasting']
  },
  Pitta: {
    therapies: ['Takradhara', 'Virechana Karma', 'Kashaya Basti', 'Shiro Pichu'],
    formulations: ['Avipattikar Churna', 'Shatavari Ghrita', 'Amruthotharam Kashayam', 'Chandanadi Oil'],
    diet: ['Sweet pomegranate', 'Ash gourd juice', 'Basmati rice with Ghee', 'Cool herbal tea'],
    restrictions: ['Excess red chili & spices', 'Tamarind & tomatoes', 'Direct hot sunlight', 'Alcohol']
  },
  Kapha: {
    therapies: ['Vamana Karma', 'Udgharshana / Udwarthanam', 'Nasya Karma', 'Bashpa Swedana'],
    formulations: ['Trikatu Churna', 'Kanchanar Guggulu', 'Anu Taila', 'Triphala Kashayam'],
    diet: ['Barley water (Yava Peya)', 'Roasted cumin & ginger soup', 'Steamed green vegetables', 'Honey with warm water'],
    restrictions: ['Heavy dairy & ice cream', 'Daytime sleeping', 'Fried fatty foods', 'Cold sweet drinks']
  }
};


