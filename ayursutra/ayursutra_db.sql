-- ======================================================================
-- Database: ayursutra_db
-- Description: Complete Ayurvedic Clinical Management, Vaidya/Therapist,
--              Clinic Locations, Schedules, Doctor & Patient Dashboards
-- Compatibility: MySQL 5.7+ / MariaDB 10.2+ (XAMPP phpMyAdmin compatible)
-- ======================================================================

CREATE DATABASE IF NOT EXISTS `ayursutra_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ayursutra_db`;

-- Drop existing tables/views if re-running
SET FOREIGN_KEY_CHECKS = 0;
DROP VIEW IF EXISTS `view_doctor_dashboard`;
DROP VIEW IF EXISTS `view_patient_dashboard`;
DROP TABLE IF EXISTS `prescriptions`;
DROP TABLE IF EXISTS `therapy_sessions`;
DROP TABLE IF EXISTS `consultation_schedules`;
DROP TABLE IF EXISTS `patients`;
DROP TABLE IF EXISTS `therapists_doctors`;
DROP TABLE IF EXISTS `clinics`;
SET FOREIGN_KEY_CHECKS = 1;

-- ======================================================================
-- 1. TABLE: clinics (Clinic Locations & Addresses)
-- ======================================================================
CREATE TABLE `clinics` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `branch_code` VARCHAR(20) NOT NULL UNIQUE,
  `clinic_name` VARCHAR(150) NOT NULL,
  `address_line1` VARCHAR(255) NOT NULL,
  `address_line2` VARCHAR(255) DEFAULT NULL,
  `landmark` VARCHAR(150) DEFAULT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `postal_code` VARCHAR(20) NOT NULL,
  `country` VARCHAR(50) DEFAULT 'India',
  `contact_phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(120) NOT NULL,
  `operating_hours` VARCHAR(100) DEFAULT '07:00 AM - 08:00 PM',
  `total_suites` INT DEFAULT 6,
  `status` ENUM('Active', 'Maintenance', 'Closed') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- 2. TABLE: therapists_doctors (Therapists / Vaidyas / Doctors)
-- ======================================================================
CREATE TABLE `therapists_doctors` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `doctor_code` VARCHAR(20) NOT NULL UNIQUE,
  `clinic_id` INT NOT NULL,
  `full_name` VARCHAR(120) NOT NULL,
  `designation` VARCHAR(100) NOT NULL,
  `qualification` VARCHAR(150) NOT NULL,
  `specialization` VARCHAR(150) NOT NULL,
  `experience_years` INT NOT NULL,
  `contact_phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(120) NOT NULL,
  `consultation_fee` DECIMAL(10,2) NOT NULL DEFAULT 800.00,
  `rating` DECIMAL(3,2) DEFAULT 4.80,
  `total_patients_treated` INT DEFAULT 0,
  `bio` TEXT DEFAULT NULL,
  `status` ENUM('Active', 'On Leave', 'Consulting') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- 3. TABLE: patients (Patient Dashboard & Clinical Profiles)
-- ======================================================================
CREATE TABLE `patients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `patient_code` VARCHAR(20) NOT NULL UNIQUE,
  `assigned_doctor_id` INT DEFAULT NULL,
  `assigned_clinic_id` INT DEFAULT NULL,
  `full_name` VARCHAR(120) NOT NULL,
  `age` INT NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `blood_group` VARCHAR(10) DEFAULT 'B+',
  `contact_phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(120) DEFAULT NULL,
  `address` TEXT NOT NULL,
  `emergency_contact` VARCHAR(30) DEFAULT NULL,
  `prakriti_dosha` VARCHAR(50) NOT NULL COMMENT 'e.g. Vata-Pitta, Kapha Predominant',
  `vata_percentage` INT DEFAULT 33,
  `pitta_percentage` INT DEFAULT 33,
  `kapha_percentage` INT DEFAULT 34,
  `nadi_pulse_type` VARCHAR(120) DEFAULT 'Samata Gati',
  `primary_symptoms` TEXT NOT NULL,
  `medical_history` TEXT DEFAULT NULL,
  `current_phase` ENUM('Consultation', 'Purva Karma', 'Pradhana Karma', 'Paschat Karma', 'Discharged') DEFAULT 'Consultation',
  `admission_status` ENUM('Outpatient', 'Inpatient', 'Scheduled', 'Completed') DEFAULT 'Inpatient',
  `room_suite` VARCHAR(60) DEFAULT 'Chikitsa Suite 1',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`assigned_doctor_id`) REFERENCES `therapists_doctors`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`assigned_clinic_id`) REFERENCES `clinics`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- 4. TABLE: consultation_schedules (Doctor & Patient Consultation Slots)
-- ======================================================================
CREATE TABLE `consultation_schedules` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `appointment_code` VARCHAR(30) NOT NULL UNIQUE,
  `doctor_id` INT NOT NULL,
  `patient_id` INT NOT NULL,
  `clinic_id` INT NOT NULL,
  `appointment_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `token_number` INT NOT NULL,
  `consultation_type` ENUM('In-Person Chikitsa', 'Nadi Pariksha Initial', 'Follow-up Review', 'Tele-Ayurveda') DEFAULT 'In-Person Chikitsa',
  `chief_complaint` TEXT DEFAULT NULL,
  `status` ENUM('Scheduled', 'In-Progress', 'Completed', 'Cancelled', 'No-Show') DEFAULT 'Scheduled',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`doctor_id`) REFERENCES `therapists_doctors`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- 5. TABLE: therapy_sessions (Panchakarma Protocol Sessions & Tracking)
-- ======================================================================
CREATE TABLE `therapy_sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `session_code` VARCHAR(30) NOT NULL UNIQUE,
  `patient_id` INT NOT NULL,
  `doctor_id` INT NOT NULL,
  `clinic_id` INT NOT NULL,
  `therapy_name` VARCHAR(150) NOT NULL COMMENT 'e.g. Shirodhara, Abhyanga, Basti, Vamana',
  `karma_phase` ENUM('Purva Karma', 'Pradhana Karma', 'Paschat Karma') NOT NULL,
  `scheduled_date` DATE NOT NULL,
  `scheduled_time` TIME NOT NULL,
  `duration_minutes` INT DEFAULT 45,
  `room_suite` VARCHAR(60) NOT NULL,
  `medicated_oil_used` VARCHAR(150) DEFAULT 'Mahanarayana Taila',
  `oil_temp_celsius` DECIMAL(4,1) DEFAULT 38.5,
  `day_number` INT DEFAULT 1,
  `total_days` INT DEFAULT 7,
  `status` ENUM('Scheduled', 'In Progress', 'Completed', 'Postponed') DEFAULT 'Scheduled',
  `vaidya_notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`doctor_id`) REFERENCES `therapists_doctors`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- 6. TABLE: prescriptions (Formulations, Diet, Pathya / Apathya)
-- ======================================================================
CREATE TABLE `prescriptions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `prescription_code` VARCHAR(30) NOT NULL UNIQUE,
  `patient_id` INT NOT NULL,
  `doctor_id` INT NOT NULL,
  `consultation_id` INT DEFAULT NULL,
  `ayurvedic_diagnosis` VARCHAR(255) NOT NULL,
  `herbal_formulations` TEXT NOT NULL COMMENT 'Decoctions, Kashayam, Tailam, Ghrita dosages',
  `pathya_diet` TEXT NOT NULL COMMENT 'Recommended diet & daily regimen',
  `apathya_restrictions` TEXT NOT NULL COMMENT 'Contraindicated food and lifestyle triggers',
  `followup_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`doctor_id`) REFERENCES `therapists_doctors`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`consultation_id`) REFERENCES `consultation_schedules`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- 7. VIEWS: Quick Backend Feeds for Doctor & Patient Dashboards
-- ======================================================================

-- VIEW: Doctor Dashboard Overview
CREATE OR REPLACE VIEW `view_doctor_dashboard` AS
SELECT 
  d.id AS doctor_id,
  d.doctor_code,
  d.full_name AS doctor_name,
  d.specialization,
  c.clinic_name,
  COUNT(DISTINCT cs.id) AS total_appointments_today,
  COUNT(DISTINCT CASE WHEN cs.status = 'In-Progress' THEN cs.id END) AS active_consultations,
  COUNT(DISTINCT CASE WHEN ts.status = 'In Progress' THEN ts.id END) AS active_therapies,
  COUNT(DISTINCT p.id) AS total_assigned_patients
FROM `therapists_doctors` d
LEFT JOIN `clinics` c ON d.clinic_id = c.id
LEFT JOIN `consultation_schedules` cs ON d.id = cs.doctor_id AND cs.appointment_date = CURDATE()
LEFT JOIN `therapy_sessions` ts ON d.id = ts.doctor_id AND ts.scheduled_date = CURDATE()
LEFT JOIN `patients` p ON d.id = p.assigned_doctor_id
GROUP BY d.id, d.doctor_code, d.full_name, d.specialization, c.clinic_name;

-- VIEW: Patient Dashboard Overview
CREATE OR REPLACE VIEW `view_patient_dashboard` AS
SELECT 
  p.id AS patient_id,
  p.patient_code,
  p.full_name AS patient_name,
  p.age,
  p.gender,
  p.prakriti_dosha,
  p.vata_percentage,
  p.pitta_percentage,
  p.kapha_percentage,
  p.nadi_pulse_type,
  p.primary_symptoms,
  p.current_phase,
  p.admission_status,
  p.room_suite,
  d.full_name AS primary_vaidya,
  c.clinic_name,
  c.city AS clinic_city,
  ts.therapy_name AS ongoing_therapy,
  ts.day_number AS therapy_day,
  ts.total_days AS therapy_total_days,
  ts.status AS therapy_status,
  ts.oil_temp_celsius,
  pr.herbal_formulations,
  pr.pathya_diet
FROM `patients` p
LEFT JOIN `therapists_doctors` d ON p.assigned_doctor_id = d.id
LEFT JOIN `clinics` c ON p.assigned_clinic_id = c.id
LEFT JOIN `therapy_sessions` ts ON p.id = ts.patient_id AND ts.status IN ('In Progress', 'Scheduled')
LEFT JOIN `prescriptions` pr ON p.id = pr.patient_id
ORDER BY p.id ASC;


-- ======================================================================
-- 8. DUMMY DATA INSERTIONS
-- ======================================================================

-- 1) Insert Clinics & Locations
INSERT INTO `clinics` (`id`, `branch_code`, `clinic_name`, `address_line1`, `address_line2`, `landmark`, `city`, `state`, `postal_code`, `contact_phone`, `email`, `operating_hours`, `total_suites`, `status`) VALUES
(1, 'CLN-JPR-01', 'AyurSutra Central Sanctorum', '12/A, Vidyadhar Nagar Central', 'Near Ayurvedic Research Institute', 'Opp. Central Herb Garden', 'Jaipur', 'Rajasthan', '302039', '+91 141 2345678', 'jaipur.sanctorum@ayursutra.com', '06:30 AM - 08:30 PM', 8, 'Active'),
(2, 'CLN-KCH-02', 'AyurSutra Coastal Panchakarma Retreat', '45/8, Fort Kochi Heritage Boulevard', 'Old Dutch Quarter', 'Near Mattancherry Palace', 'Kochi', 'Kerala', '682001', '+91 484 2789123', 'kerala.retreat@ayursutra.com', '06:00 AM - 09:00 PM', 12, 'Active'),
(3, 'CLN-RSK-03', 'AyurSutra Himalayan Healing Sanctuary', '77, Tapovan Heights, Laxman Jhula Road', 'Upper Ganga Valley', 'Above Yoga Veda Ashram', 'Rishikesh', 'Uttarakhand', '249192', '+91 135 2439876', 'rishikesh@ayursutra.com', '06:00 AM - 07:30 PM', 6, 'Active'),
(4, 'CLN-BLR-04', 'AyurSutra Urban Chikitsalaya', 'Plot 108, 4th Cross, Indiranagar 100ft Road', 'HAL 2nd Stage', 'Near Defence Colony', 'Bengaluru', 'Karnataka', '560038', '+91 80 41235678', 'bangalore@ayursutra.com', '07:00 AM - 08:00 PM', 6, 'Active'),
(5, 'CLN-PUN-05', 'AyurSutra Western Ghats Wellness Centre', 'B-14, Koregaon Park North Avenue', 'Lane 5', 'Opp. Osho Nature Grove', 'Pune', 'Maharashtra', '411001', '+91 20 26123456', 'pune@ayursutra.com', '07:00 AM - 08:00 PM', 6, 'Active');

-- 2) Insert Therapists, Vaidyas & Doctors
INSERT INTO `therapists_doctors` (`id`, `doctor_code`, `clinic_id`, `full_name`, `designation`, `qualification`, `specialization`, `experience_years`, `contact_phone`, `email`, `consultation_fee`, `rating`, `total_patients_treated`, `bio`, `status`) VALUES
(1, 'DOC-001', 1, 'Dr. Ramesh Vaidya', 'Chief Acharya & Head Vaidya', 'BAMS, MD (Ayurveda - Panchakarma), PhD', 'Panchakarma & Neurological Disorders', 24, '+91 98290 11223', 'dr.ramesh@ayursutra.com', 1200.00, 4.95, 4820, 'Renowned authority in classical Shodhana chikitsa and chronic musculoskeletal restoration with over two decades of clinical experience.', 'Active'),
(2, 'DOC-002', 1, 'Vaidya Sneha Nair', 'Senior Panchakarma Specialist', 'BAMS, MD (Panchakarma, Kerala)', 'Shirodhara, Takradhara & Stress Management', 14, '+91 98470 33445', 'sneha.nair@ayursutra.com', 950.00, 4.90, 2650, 'Mastery in authentic Ashtavaidya Kerala traditions, specializes in psychosomatic therapies, insomnia, and Panchakarma detox.', 'Active'),
(3, 'DOC-003', 1, 'Vaidya Harish Chandra', 'Senior Nadi Pariksha Consultant', 'BAMS, MS (Ayurveda - Shalya Tantra)', 'Nadi Pulse Diagnosis & Spine Rehabilitation', 18, '+91 94140 55667', 'harish.chandra@ayursutra.com', 1000.00, 4.88, 3400, 'Expert pulse diagnostician capable of identifying deep-seated dhatu imbalances and structural spine misalignments.', 'Active'),
(4, 'DOC-004', 2, 'Dr. Meenakshi Menon', 'Lead Ayurvedic Gynecologist & Rasayana Expert', 'BAMS, MD (Prasuti Tantra)', 'Women Hormonal Health & Rasayana Therapy', 16, '+91 97440 77889', 'meenakshi.m@ayursutra.com', 1100.00, 4.92, 3100, 'Pioneer in integrating herbal Rasayana protocols with hormonal recalibration and post-natal panchakarma recovery.', 'Active'),
(5, 'DOC-005', 3, 'Vaidya Ananda Mohan', 'Himalayan Herbal Formulator & Vaidya', 'BAMS, Fellowship in Yoga Chikitsa', 'Metabolic Disorders, Agni & Diabetes Krama', 12, '+91 98970 99001', 'ananda.mohan@ayursutra.com', 850.00, 4.82, 1950, 'Specializes in Deepana-Pachana protocols and herbal lifestyle corrections in high altitude sanctuaries.', 'Active');

-- 3) Insert Patients (Demographics, Symptoms, Doshas)
INSERT INTO `patients` (`id`, `patient_code`, `assigned_doctor_id`, `assigned_clinic_id`, `full_name`, `age`, `gender`, `blood_group`, `contact_phone`, `email`, `address`, `emergency_contact`, `prakriti_dosha`, `vata_percentage`, `pitta_percentage`, `kapha_percentage`, `nadi_pulse_type`, `primary_symptoms`, `medical_history`, `current_phase`, `admission_status`, `room_suite`) VALUES
(1, 'AY-2026-001', 1, 1, 'Ananya Sharma', 34, 'Female', 'O+', '+91 98765 43210', 'ananya.sharma@gmail.com', 'Flat 402, Royal Palms, C-Scheme, Jaipur', '+91 98765 43211 (Husband)', 'Vata-Pitta', 55, 35, 10, 'Vata-Pitta (Chapa & Sarpa Gati)', 'Chronic migraine, severe sleep disruption, anxiety spikes, cervical neck stiffness.', 'Past history of cervical spondylosis and chronic work-related burnout since 2023.', 'Pradhana Karma', 'Inpatient', 'Chikitsa Suite 2'),
(2, 'AY-2026-002', 2, 1, 'Rajesh Verma', 48, 'Male', 'B+', '+91 91234 56789', 'r.verma48@yahoo.com', 'H-18, Malviya Nagar, Jaipur', '+91 91234 56780 (Son)', 'Kapha Predominant', 15, 25, 60, 'Kapha (Mando Gati / Hamsa)', 'Sluggish metabolism, heaviness in chest, chronic sinus congestion, joint lethargy, excess mucus.', 'Diagnosed with metabolic syndrome and fatty liver grade 1 in 2024.', 'Purva Karma', 'Inpatient', 'Karma Hall A'),
(3, 'AY-2026-003', 1, 1, 'Sunita Joshi', 52, 'Female', 'A+', '+91 99887 76655', 'sunita.joshi@outlook.com', '24, Civil Lines, Jaipur', '+91 99887 76600 (Daughter)', 'Pitta-Vata', 40, 50, 10, 'Pitta (Manduka Gati)', 'Bilateral knee joint inflammation (Sandhigata Vata), burning sensation in soles, hyperacidity.', 'Osteoarthritis grade 2 in right knee, chronic acid reflux for 5 years.', 'Pradhana Karma', 'Inpatient', 'Recovery Room 1'),
(4, 'AY-2026-004', 3, 1, 'Vikramaditya Rao', 41, 'Male', 'AB+', '+91 94455 66778', 'vikram.rao@techcorp.in', 'Villa 9, Mansarovar Extension, Jaipur', '+91 94455 66700 (Wife)', 'Tridoshic (V-P-K)', 35, 35, 30, 'Tridosha Samata', 'Chronic maxillary sinusitis, recurrent headaches, dry nasal passages, ocular fatigue.', 'Allergic rhinitis history since childhood, frequent antibiotic exposure.', 'Pradhana Karma', 'Inpatient', 'Chikitsa Suite 1'),
(5, 'AY-2026-005', 2, 1, 'Meera Nambiar', 29, 'Female', 'O-', '+91 97711 22334', 'meera.nambiar@heritage.org', '78, Raja Park, Jaipur', '+91 97711 22300 (Father)', 'Vata Predominant', 65, 20, 15, 'Vata pacified (Samana Vayu)', 'Post-stress fatigue, low immunity, gut irregularity, dry skin and weight loss.', 'History of IBS (Irritable Bowel Syndrome) triggered by high-stress job.', 'Paschat Karma', 'Inpatient', 'Recovery Suite 3'),
(6, 'AY-2026-006', 1, 1, 'Arjun Singhania', 56, 'Male', 'B+', '+91 98822 33445', 'arjun.singhania@indianoil.co', 'Plot 55, Vaishali Nagar, Jaipur', '+91 98822 33400 (Wife)', 'Pitta-Kapha', 15, 50, 35, 'Pitta-Tikshna', 'Skin eruptions (Kushtha lakshanas), liver heat, hypertension, gout flare-up.', 'History of hyperuricemia and mild essential hypertension.', 'Pradhana Karma', 'Inpatient', 'Chikitsa Suite 3'),
(7, 'AY-2026-007', 4, 2, 'Kavita Krishnan', 38, 'Female', 'A+', '+91 96541 23098', 'kavita.k@keralaarts.in', '33/2, Marine Drive, Kochi', '+91 96541 23000 (Sister)', 'Vata-Pitta', 45, 45, 10, 'Vata-Pitta Gati', 'Hormonal imbalance, PCOS symptoms, hair thinning, irregular sleep cycle.', 'PCOS diagnosed 4 years ago, seeking complete natural rejuvenation.', 'Purva Karma', 'Inpatient', 'Kochi Suite 4'),
(8, 'AY-2026-008', 5, 3, 'Devendra Pant', 62, 'Male', 'O+', '+91 94112 34567', 'devendra.pant@uttarakhand.gov', '14, Ganga View Enclave, Rishikesh', '+91 94112 34500 (Son)', 'Vata-Kapha', 50, 15, 35, 'Vata-Mando Gati', 'Sciatica pain radiating down left leg (Gridhrasi), morning lumbar stiffness, cold extremities.', 'Lumbar disc bulge L4-L5 documented via MRI in 2025.', 'Purva Karma', 'Inpatient', 'Tapovan Suite 2');

-- 4) Insert Consultation Schedules
INSERT INTO `consultation_schedules` (`id`, `appointment_code`, `doctor_id`, `patient_id`, `clinic_id`, `appointment_date`, `start_time`, `end_time`, `token_number`, `consultation_type`, `chief_complaint`, `status`) VALUES
(1, 'APT-2026-101', 1, 1, 1, CURDATE(), '08:30:00', '09:00:00', 1, 'In-Person Chikitsa', 'Evaluate Shirodhara Day 4 response & migraine reduction', 'Completed'),
(2, 'APT-2026-102', 2, 2, 1, CURDATE(), '09:15:00', '09:45:00', 2, 'In-Person Chikitsa', 'Assess Snehapana ghee digestion & Agni bala for Vamana prep', 'Completed'),
(3, 'APT-2026-103', 3, 4, 1, CURDATE(), '10:00:00', '10:30:00', 3, 'Nadi Pariksha Initial', 'Deep pulse assessment post Nasya 8-drop administration', 'In-Progress'),
(4, 'APT-2026-104', 1, 3, 1, CURDATE(), '11:00:00', '11:30:00', 4, 'Follow-up Review', 'Check retention time of Kashaya Basti & knee joint flexion', 'Scheduled'),
(5, 'APT-2026-105', 2, 5, 1, CURDATE(), '04:30:00', '05:00:00', 5, 'Follow-up Review', 'Final Samsarjana Krama diet chart & discharge counseling', 'Scheduled'),
(6, 'APT-2026-106', 1, 6, 1, CURDATE(), '05:15:00', '05:45:00', 6, 'In-Person Chikitsa', 'Post-Virechana vega count verification & pulse stability', 'Scheduled'),
(7, 'APT-2026-107', 4, 7, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00:00', '09:30:00', 1, 'In-Person Chikitsa', 'Initial Prakriti profiling and hormonal protocol planning', 'Scheduled'),
(8, 'APT-2026-108', 5, 8, 3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:30:00', '11:00:00', 2, 'Nadi Pariksha Initial', 'Sciatica severity grading and Kati Basti warm herbal scheduling', 'Scheduled');

-- 5) Insert Panchakarma Therapy Sessions
INSERT INTO `therapy_sessions` (`id`, `session_code`, `patient_id`, `doctor_id`, `clinic_id`, `therapy_name`, `karma_phase`, `scheduled_date`, `scheduled_time`, `duration_minutes`, `room_suite`, `medicated_oil_used`, `oil_temp_celsius`, `day_number`, `total_days`, `status`, `vaidya_notes`) VALUES
(1, 'SES-2026-001', 1, 2, 1, 'Sarvanga Abhyanga & Bashpa Swedan', 'Purva Karma', CURDATE(), '08:00:00', 60, 'Chikitsa Suite 2', 'Mahanarayana Taila & Dhanwantharam', 39.0, 4, 7, 'Completed', 'Smooth full-body oleation followed by light herbal steam. Heart rate stable.'),
(2, 'SES-2026-002', 1, 2, 1, 'Takradhara & Shirodhara Protocol', 'Pradhana Karma', CURDATE(), '09:30:00', 45, 'Chikitsa Suite 2', 'Medicated Takram & Brahmi Taila', 38.5, 4, 7, 'In Progress', 'Oscillating flow rate 1Hz. Patient exhibiting profound parasympathetic calming response.'),
(3, 'SES-2026-003', 4, 3, 1, 'Pratimarsa Nasya Karma & Facial Swedana', 'Pradhana Karma', CURDATE(), '10:45:00', 40, 'Chikitsa Suite 1', 'Anu Taila & Karpasastyadi Tailam', 38.2, 3, 7, 'In Progress', 'Administered 8 drops per nostril. Clear evacuation of accumulated Kapha mucus.'),
(4, 'SES-2026-004', 2, 1, 1, 'Snehapana (Internal Oleation Ghee)', 'Purva Karma', CURDATE(), '11:30:00', 30, 'Karma Hall A', 'Sukumara Ghrita (60ml warm)', 40.0, 2, 5, 'Scheduled', 'Dose increased to 60ml. Warm water given. Observe digestion every 3 hours.'),
(5, 'SES-2026-005', 3, 1, 1, 'Kashaya & Niruha Basti Therapy', 'Pradhana Karma', CURDATE(), '14:00:00', 50, 'Recovery Room 1', 'Dashamula Kashaya with Saindhava & Tailam', 38.0, 6, 8, 'Scheduled', 'Decoction enema prepared in copper vat. Retention time goal minimum 45 mins.'),
(6, 'SES-2026-006', 5, 2, 1, 'Rasayana Regenerative Abhyanga', 'Paschat Karma', CURDATE(), '16:00:00', 45, 'Recovery Suite 3', 'Ksheerabala 101 Avarthi Tailam', 38.5, 7, 7, 'Scheduled', 'Final concluding session before home convalescence regimen.');

-- 6) Insert Prescriptions (Ayurvedic Formulations, Pathya & Apathya)
INSERT INTO `prescriptions` (`id`, `prescription_code`, `patient_id`, `doctor_id`, `consultation_id`, `ayurvedic_diagnosis`, `herbal_formulations`, `pathya_diet`, `apathya_restrictions`, `followup_date`) VALUES
(1, 'RX-2026-01', 1, 1, 1, 'Ardhavabhedaka (Vata-Pitta Migraine) with Nidranasha', 
'1. Brahmi Ghrita - 1 tsp early morning empty stomach with warm water.\n2. Ksheerabala 101 Drops - 2 drops in each nostril at bedtime.\n3. Saraswatarishta - 15ml with equal warm water post lunch & dinner.\n4. Shankhpushpi Churna - 3g with warm milk at night.',
'Light boiled moong dal soup (Mudga Yusha), red rice, cooked gourd, warm cows milk with cardamom and saffron.',
'Fermented foods, curd at night, dry packaged snacks, excessive screen time after 9 PM, cold refrigerated water.',
DATE_ADD(CURDATE(), INTERVAL 7 DAY)),

(2, 'RX-2026-02', 2, 2, 2, 'Kaphaja Pratisyaya & Medoroga with Mandagni', 
'1. Sukumara Ghrita - Graduated Snehapana dose (Day 2: 60ml).\n2. Triphala Kashayam - 30ml warm empty stomach.\n3. Trikatu Churna - 2g with raw honey before meals.\n4. Kanchanar Guggulu - 2 tabs twice daily after food.',
'Warm barley water (Yava Peya), boiled vegetables with roasted cumin & ginger, hot water sips throughout the day.',
'Heavy oily fried food, cold dairy, sweets, day sleep (Diva Swapna), cold breeze exposure.',
DATE_ADD(CURDATE(), INTERVAL 5 DAY)),

(3, 'RX-2026-03', 3, 1, 4, 'Sandhigata Vata & Amlapitta (Joint Degeneration with Pitta Inflam)', 
'1. Yogaraja Guggulu - 2 tabs twice daily with warm water.\n2. Sahacharadi Kashayam - 20ml with 40ml boiled water before meals.\n3. Dhanwantharam Tailam - External gentle application on knees twice daily.\n4. Avipattikar Churna - 3g with lukewarm water at bedtime.',
'Well-cooked basmati rice with cow ghee, sweet pomegranate, boiled pumpkin, ash gourd juice morning.',
'Excess red chili, tamarind, tomato, curd, heavy lifting, squatting, cold baths.',
DATE_ADD(CURDATE(), INTERVAL 8 DAY)),

(4, 'RX-2026-04', 4, 3, 3, 'Dustha Pratishyaya & Shiroroga (Chronic Sinus Blockage)', 
'1. Anu Taila - Daily morning Nasya (4 drops each nostril post steam).\n2. Haridra Khanda - 1 tsp with warm milk twice daily.\n3. Dashamularishta - 20ml post meals with warm water.\n4. Sitopaladi Churna - 3g mixed with honey and ghee.',
'Warm light soups, roasted jeera water, black pepper infused lentils, steamed greens.',
'Ice cream, cold beverages, exposure to air conditioning below 24C, direct fan breeze on head.',
DATE_ADD(CURDATE(), INTERVAL 10 DAY));

-- ======================================================================
-- 7. TABLE: pricing_catalog (Standard Tariffs & Schedule of Charges)
-- ======================================================================
CREATE TABLE `pricing_catalog` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `item_code` VARCHAR(30) NOT NULL UNIQUE,
  `category` ENUM('Therapy', 'Consultation', 'Pharmacy', 'Room', 'Package') NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `standard_price` DECIMAL(10,2) NOT NULL,
  `gst_rate_pct` DECIMAL(4,2) DEFAULT 5.00,
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- 8. TABLE: invoices (GST-Compliant Hospital Tax Invoices & Billing)
-- ======================================================================
CREATE TABLE `invoices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoice_code` VARCHAR(30) NOT NULL UNIQUE,
  `patient_id` INT NOT NULL,
  `doctor_id` INT NOT NULL,
  `clinic_id` INT NOT NULL DEFAULT 1,
  `package_title` VARCHAR(200) NOT NULL,
  `invoice_date` DATE NOT NULL,
  `due_date` DATE NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  `gst_rate_pct` DECIMAL(4,2) DEFAULT 5.00,
  `gst_amount` DECIMAL(10,2) NOT NULL,
  `discount_amount` DECIMAL(10,2) DEFAULT 0.00,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `amount_paid` DECIMAL(10,2) DEFAULT 0.00,
  `balance_due` DECIMAL(10,2) DEFAULT 0.00,
  `status` ENUM('Paid', 'Pending', 'Partially Paid', 'Cancelled', 'Refunded') DEFAULT 'Pending',
  `payment_method` VARCHAR(100) DEFAULT 'Pending Payment',
  `transaction_id` VARCHAR(100) DEFAULT NULL,
  `paid_at` VARCHAR(50) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`doctor_id`) REFERENCES `therapists_doctors`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- 9. TABLE: invoice_items (Line Items for Each Invoice)
-- ======================================================================
CREATE TABLE `invoice_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoice_id` INT NOT NULL,
  `item_type` ENUM('Therapy', 'Consultation', 'Pharmacy', 'Room', 'Package', 'Other') DEFAULT 'Therapy',
  `item_code` VARCHAR(30) DEFAULT NULL,
  `description` VARCHAR(255) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `unit_rate` DECIMAL(10,2) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- 10. TABLE: payments (Payment Gateway Transactions & POS Ledger)
-- ======================================================================
CREATE TABLE `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `payment_code` VARCHAR(30) NOT NULL UNIQUE,
  `invoice_id` INT NOT NULL,
  `patient_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `payment_method` ENUM('UPI', 'Card', 'NetBanking', 'Insurance_TPA', 'Cash', 'POS_Swipe') NOT NULL,
  `gateway_provider` VARCHAR(100) DEFAULT 'AyurPay National Healthcare Gateway',
  `transaction_reference` VARCHAR(100) NOT NULL,
  `payer_identifier` VARCHAR(120) DEFAULT NULL,
  `payment_status` ENUM('Success', 'Pending', 'Failed', 'Refunded') DEFAULT 'Success',
  `paid_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- INSERT DUMMY DATA FOR PRICING, INVOICES & PAYMENTS
-- ======================================================================

-- 1) Insert Standard Pricing Catalog
INSERT INTO `pricing_catalog` (`id`, `item_code`, `category`, `name`, `description`, `standard_price`, `gst_rate_pct`) VALUES
(1, 'TH-01', 'Therapy', 'Shirodhara Medicated Therapy', 'Continuous rhythmic herbal oil stream on forehead (Ajna Chakra)', 3500.00, 5.00),
(2, 'TH-02', 'Therapy', 'Sarvanga Abhyanga Medicated Massage', 'Full body synchronized warm herbal oil oleation', 2200.00, 5.00),
(3, 'TH-03', 'Therapy', 'Vamana Karma Full Procedure', 'Classical therapeutic emesis for Kapha elimination', 8500.00, 5.00),
(4, 'TH-04', 'Therapy', 'Virechana Karma Shodhana', 'Therapeutic purgation for Pitta purification', 7500.00, 5.00),
(5, 'TH-05', 'Therapy', 'Kashaya & Sneha Basti Protocol', 'Herbal decoction and medicated oil enema administration', 3200.00, 5.00),
(6, 'TH-06', 'Therapy', 'Nasya & Shirovasti Karma', 'Nasal eradication of toxins with head oil retention', 2800.00, 5.00),
(7, 'TH-07', 'Therapy', 'Takradhara Medicated Buttermilk', 'Cooling buttermilk stream for stress & psoriasis', 3200.00, 5.00),
(8, 'CS-01', 'Consultation', 'Senior Acharya Nadi Pariksha Consult', 'Comprehensive pulse diagnosis & Tridosha profiling', 1500.00, 0.00),
(9, 'CS-02', 'Consultation', 'Follow-up Clinical Review', 'Weekly progress and diet modification consult', 800.00, 0.00),
(10, 'MED-01', 'Pharmacy', 'Ksheerabala 101 Drops (50ml)', '101 times fortified Bala formulation', 1850.00, 5.00),
(11, 'MED-02', 'Pharmacy', 'Mahanarayana Tailam (500ml)', '54 herb classical oil for neuromuscular health', 1200.00, 5.00),
(12, 'RM-01', 'Room', 'Chikitsa Private Suite (Per Day)', 'Air-conditioned Ayurvedic private suite with attached bath', 3000.00, 5.00);

-- 2) Insert Invoices
INSERT INTO `invoices` (`id`, `invoice_code`, `patient_id`, `doctor_id`, `clinic_id`, `package_title`, `invoice_date`, `due_date`, `subtotal`, `gst_rate_pct`, `gst_amount`, `discount_amount`, `total_amount`, `amount_paid`, `balance_due`, `status`, `payment_method`, `transaction_id`, `paid_at`, `notes`) VALUES
(1, 'INV-2026-101', 1, 1, 1, '7-Day Shirodhara & Abhyanga Intensive Package', '2026-08-16', '2026-08-20', 57100.00, 5.00, 2855.00, 2000.00, 57955.00, 57955.00, 0.00, 'Paid', 'UPI (GPay / PhonePe)', 'TXN-AYUR-882194', '2026-08-16 10:45 AM', 'Paid in full via GPay QR.'),
(2, 'INV-2026-102', 2, 2, 1, '5-Day Purva Karma & Vamana Shodhana Protocol', '2026-08-17', '2026-08-22', 28000.00, 5.00, 1400.00, 1000.00, 28400.00, 0.00, 28400.00, 'Pending', 'Pending Payment', 'N/A', 'Unpaid', 'Pending payment authorization at billing counter.'),
(3, 'INV-2026-103', 3, 1, 1, '8-Day Kashaya & Sneha Basti Protocol', '2026-08-15', '2026-08-19', 42400.00, 5.00, 2120.00, 1500.00, 43020.00, 43020.00, 0.00, 'Paid', 'HDFC Credit Card (•••• 4092)', 'TXN-AYUR-773821', '2026-08-15 03:20 PM', 'Settled via POS Card Terminal.'),
(4, 'INV-2026-104', 4, 3, 1, '7-Day Nasya & Shirovasti Neurological Care', '2026-08-17', '2026-08-21', 37000.00, 5.00, 1850.00, 0.00, 38850.00, 0.00, 38850.00, 'Pending', 'Ayush TPA Insurance Claim (Star Health)', 'TPA-CLAIM-44812', 'Processing Claim', 'Cashless pre-auth claim approved; awaiting insurer direct settlement.'),
(5, 'INV-2026-105', 5, 2, 1, 'Complete 7-Day Rasayana Rejuvenation Cycle', '2026-08-14', '2026-08-18', 57800.00, 5.00, 2890.00, 3000.00, 57690.00, 57690.00, 0.00, 'Paid', 'Net Banking (SBI Bank)', 'TXN-AYUR-661902', '2026-08-14 11:10 AM', 'Realized through online direct debit.'),
(6, 'INV-2026-106', 6, 1, 1, '6-Day Classical Virechana Shodhana Karma', '2026-08-17', '2026-08-23', 34500.00, 5.00, 1725.00, 1500.00, 34725.00, 34725.00, 0.00, 'Paid', 'UPI (Paytm / BHIM)', 'TXN-AYUR-994012', '2026-08-17 09:15 AM', 'Settled via Paytm scan.');

-- 3) Insert Invoice Line Items
INSERT INTO `invoice_items` (`id`, `invoice_id`, `item_type`, `item_code`, `description`, `quantity`, `unit_rate`, `amount`) VALUES
(1, 1, 'Therapy', 'TH-01', 'Shirodhara Medicated Therapy (7 Sessions)', 7, 3500.00, 24500.00),
(2, 1, 'Therapy', 'TH-02', 'Sarvanga Abhyanga Medicated Massage (7 Sessions)', 7, 2200.00, 15400.00),
(3, 1, 'Pharmacy', 'MED-01', 'Ksheerabala 101 & Mahanarayana Tailam', 2, 1850.00, 3700.00),
(4, 1, 'Consultation', 'CS-01', 'Senior Acharya Initial Consult & Nadi Pariksha', 1, 1500.00, 1500.00),
(5, 1, 'Room', 'RM-01', 'Chikitsa Suite 2 Room Facility (4 Days Inpatient)', 4, 3000.00, 12000.00),

(6, 2, 'Therapy', 'TH-02', 'Snehapana Internal Oleation with Sukumara Ghrita', 5, 2400.00, 12000.00),
(7, 2, 'Therapy', 'TH-06', 'Swedana Herbal Steam Chamber Facility', 3, 1800.00, 5400.00),
(8, 2, 'Therapy', 'TH-03', 'Vamana Karma Classical Shodhana Session', 1, 8500.00, 8500.00),
(9, 2, 'Pharmacy', 'MED-02', 'Classical Triphala & Pippali Formulations', 1, 2100.00, 2100.00),

(10, 3, 'Therapy', 'TH-05', 'Kashaya Basti Decoction Administration (4 Sessions)', 4, 3200.00, 12800.00),
(11, 3, 'Therapy', 'TH-05', 'Anuvasana Sneha Basti (4 Sessions)', 4, 2800.00, 11200.00),
(12, 3, 'Pharmacy', 'MED-01', 'Dhanwantharam 101 & Sahacharadi Formulations', 1, 3400.00, 3400.00),
(13, 3, 'Room', 'RM-01', 'Recovery Room Inpatient Stay (6 Days)', 6, 2500.00, 15000.00);

-- 4) Insert Payments Ledger
INSERT INTO `payments` (`id`, `payment_code`, `invoice_id`, `patient_id`, `amount`, `payment_method`, `gateway_provider`, `transaction_reference`, `payer_identifier`, `payment_status`) VALUES
(1, 'PAY-2026-001', 1, 1, 57955.00, 'UPI', 'AyurPay National POS (ICICI)', 'TXN-AYUR-882194', 'ananya@okhdfcbank', 'Success'),
(2, 'PAY-2026-002', 3, 3, 43020.00, 'Card', 'HDFC POS Terminal', 'TXN-AYUR-773821', 'Card Ending in 4092', 'Success'),
(3, 'PAY-2026-003', 5, 5, 57690.00, 'NetBanking', 'SBI Net Banking Gateway', 'TXN-AYUR-661902', 'SBI-INB-77401', 'Success'),
(4, 'PAY-2026-004', 6, 6, 34725.00, 'UPI', 'Paytm QR Payment Gateway', 'TXN-AYUR-994012', 'arjun@paytm', 'Success');

-- ======================================================================
-- 11. VIEW: view_financial_dashboard (Live Billing & Revenue Telemetry)
-- ======================================================================
CREATE OR REPLACE VIEW `view_financial_dashboard` AS
SELECT 
  i.id AS `invoice_id`,
  i.invoice_code,
  i.invoice_date,
  p.patient_code AS `patient_uhid`,
  p.full_name AS `patient_name`,
  p.contact_phone,
  d.full_name AS `supervising_doctor`,
  i.package_title,
  i.subtotal,
  i.gst_amount,
  i.discount_amount,
  i.total_amount,
  i.amount_paid,
  i.balance_due,
  i.status AS `invoice_status`,
  i.payment_method,
  i.transaction_id,
  i.paid_at
FROM `invoices` i
JOIN `patients` p ON i.patient_id = p.id
JOIN `therapists_doctors` d ON i.doctor_id = d.id;

-- ======================================================================
-- END OF SCRIPT: ayursutra_db
-- Status: 100% Ready for XAMPP (phpMyAdmin / MySQL Backend Integration)
-- ======================================================================
