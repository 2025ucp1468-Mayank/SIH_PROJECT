-- ======================================================================
-- Database: ayursutra_db (Patient Portal Extension)
-- Description: Patient Intake Uploads, OCR Extractions, SOAP Clinical Notes
-- Compatibility: MySQL 5.7+ / MariaDB 10.2+ (XAMPP phpMyAdmin)
-- ======================================================================

USE `ayursutra_db`;

-- 1. TABLE: patient_portal_uploads (Stores OCR Medical Reports & Upload Logs)
CREATE TABLE IF NOT EXISTS `patient_portal_uploads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `upload_code` VARCHAR(30) NOT NULL UNIQUE,
  `patient_name` VARCHAR(120) NOT NULL,
  `age` INT NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `blood_group` VARCHAR(10) DEFAULT 'O+',
  `contact_phone` VARCHAR(30) NOT NULL,
  `report_file_name` VARCHAR(255) DEFAULT 'medical_report_scanned.png',
  `raw_ocr_text` LONGTEXT NOT NULL,
  `extracted_dosha_vata` INT DEFAULT 33,
  `extracted_dosha_pitta` INT DEFAULT 33,
  `extracted_dosha_kapha` INT DEFAULT 34,
  `ocr_confidence_score` DECIMAL(5,2) DEFAULT 94.50,
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABLE: soap_notes (Structured Ayurvedic Clinical Intake SOAP Notes)
CREATE TABLE IF NOT EXISTS `soap_notes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `soap_code` VARCHAR(30) NOT NULL UNIQUE,
  `patient_id` INT DEFAULT NULL,
  `upload_id` INT DEFAULT NULL,
  `patient_name` VARCHAR(120) NOT NULL,
  `subjective_notes` TEXT NOT NULL COMMENT 'Patient chief complaints, onset, symptoms, lifestyle triggers',
  `objective_notes` TEXT NOT NULL COMMENT 'OCR extracted lab values, vitals, Nadi pulse, physical findings',
  `assessment_notes` TEXT NOT NULL COMMENT 'Ayurvedic Dosha diagnosis, Agni evaluation, Dhatu status',
  `plan_notes` TEXT NOT NULL COMMENT 'Panchakarma protocol, herbal formulations, Pathya & Apathya regimen',
  `created_by_vaidya` VARCHAR(120) DEFAULT 'Dr. Ramesh Vaidya (Chief Acharya)',
  `status` ENUM('Draft', 'Verified', 'Active Protocol', 'Archived') DEFAULT 'Verified',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`upload_id`) REFERENCES `patient_portal_uploads`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. SEED DUMMY DATA FOR PATIENT PORTAL
INSERT INTO `patient_portal_uploads` (`id`, `upload_code`, `patient_name`, `age`, `gender`, `blood_group`, `contact_phone`, `report_file_name`, `raw_ocr_text`, `extracted_dosha_vata`, `extracted_dosha_pitta`, `extracted_dosha_kapha`, `ocr_confidence_score`) VALUES
(1, 'UPL-2026-001', 'Ananya Sharma', 34, 'Female', 'O+', '+91 98765 43210', 'migraine_mri_report.png', 'AYURVEDIC DIAGNOSTIC REPORT: Patient Ananya Sharma (34/F). Severe Vata-Pitta headache, insomnia, cervical neck stiffness. Vata 55%, Pitta 35%, Kapha 10%. Pulse: Vata-Pitta Gati.', 55, 35, 10, 96.80);

INSERT INTO `soap_notes` (`id`, `soap_code`, `patient_id`, `upload_id`, `patient_name`, `subjective_notes`, `objective_notes`, `assessment_notes`, `plan_notes`) VALUES
(1, 'SOAP-2026-001', 1, 1, 'Ananya Sharma', 
'Subjective: Patient complains of throbbing left migraine (Ardhavabhedaka) recurring 3 times weekly. Severe sleep disruption and neck stiffness.',
'Objective: OCR report scans Vata 55%, Pitta 35%, Kapha 10%. Nadi pulse displays Chapa-Sarpa Gati. Vishama Agni noted.',
'Assessment: Ardhavabhedaka (Vata-Pitta Pradhana Migraine) exacerbated by work burnout and disturbed sleep.',
'Plan: 7-Day Shirodhara with Takradhara. Brahmi Ghrita 1 tsp morning. Pathya: Moong dal yusha with ghee.');
