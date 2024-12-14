export enum TourApplicantRole {
  STUDENT = "Student",
  COUNSELOR = "Counselor",
  ADMINISTRATOR = "Administrator",
  TEACHER = "Teacher",
  OTHER = "Other"
}

export enum UserRole {
  NONE = "NONE",
  TRAINEE = "TRAINEE",
  GUIDE = "GUIDE",
  ADVISOR = "ADVISOR",
  COORDINATOR = "COORDINATOR",
  DIRECTOR = "DIRECTOR"
}

export enum Department {
  COMPUTER_ENGINEERING = "Computer Engineering",
  ELECTRICAL_ENGINEERING = "Electrical Engineering",
  MECHANICAL_ENGINEERING = "Mechanical Engineering",
  CIVIL_ENGINEERING = "Civil Engineering",
  CHEMICAL_ENGINEERING = "Chemical Engineering",
  PETROLEUM_ENGINEERING = "Petro Engineering",
  ARCHITECTURE = "Architecture",
  BUSINESS = "Business",
  LAW = "Law",
  MEDICINE = "Medicine",
  PHARMACY = "Pharmacy",
  DENTISTRY = "Dentistry",
  NURSING = "Nursing",
  ARTS = "Arts",
  EDUCATION = "Education",
}

export enum EventType {
  TOUR = "TOUR",
  FAIR = "FAIR"
}

export enum EventTypeText {
  TOUR = "Tur",
  FAIR = "Fuar"
}

export enum DashboardCategory {
  NONE = "NONE",
  OWN_EVENT = "OWN_EVENT",
  EVENT_INVITATION = "EVENT_INVITATION",
  PENDING_APPLICATION = "PENDING_APPLICATION",
  GUIDE_ASSIGNED = "GUIDE_ASSIGNED",
  GUIDELESS = "GUIDELESS",
  PENDING_MODIFICATION = "PENDING_MODIFICATION",
  GUIDE_APPLICATIONS = "GUIDE_APPLICATIONS",
  ADVISOR_APPLICATIONS = "ADVISOR_APPLICATIONS"
}

export enum DashboardCategoryText {
  NONE = "Boş :(",
  OWN_EVENT = "Atanmış Etkinlikler",
  EVENT_INVITATION = "Rehberlik Etme Davetiyeleri",
  PENDING_APPLICATION = "Etkinlik Başvuruları",
  GUIDE_ASSIGNED = "Rehber Atanmış Etkinlikler",
  GUIDELESS = "Rehber Atanmamış Etkinlikler",
  PENDING_MODIFICATION = "Değişim Bekleyen Turlar",
  GUIDE_APPLICATIONS = "Rehber Başvuruları",
}

export enum ApplicantRole {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}

export enum TourType {
  GROUP = "GROUP",
  INDIVIDUAL = "INDIVIDUAL",
}

export enum TourTypeText {
  GROUP = "Grup Turu",
  INDIVIDUAL = "Kişisel Tur",
}

export enum TourStatus {
  AWAITING_CONFIRMATION = "AWAITING_CONFIRMATION",
  APPLICANT_WANTS_CHANGE = "APPLICANT_WANTS_CHANGE",
  TOYS_WANTS_CHANGE = "TOYS_WANTS_CHANGE",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export enum TourStatusText {
  AWAITING_CONFIRMATION = "Kabul Bekliyor",
  APPLICANT_WANTS_CHANGE = "Başvuran Değişiklik İstiyor",
  TOYS_WANTS_CHANGE = "Tanıtım Ofisi Değişiklik İstiyor",
  APPROVED = "Kabul Edildi",
  REJECTED = "Reddedildi"
}

export enum FairStatus {
  AWAITING_CONFIRMATION = "AWAITING_CONFIRMATION",
  APPLICANT_WANTS_CHANGE = "APPLICANT_WANTS_CHANGE",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}