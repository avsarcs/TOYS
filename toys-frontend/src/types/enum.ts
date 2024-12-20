export enum FetchingStatus {
  NONE = -1,
  FETCHING,
  DONE,
  FAILED
}

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

export enum UserRoleText {
  NONE = "HATALI",
  TRAINEE = "Amatör Rehber",
  GUIDE = "Rehber",
  ADVISOR = "Danışman",
  COORDINATOR = "Koordinatör",
  DIRECTOR = "Direktör"
}

export enum Department {
  ARCHITECTURE = "Mimarlık",
  COMMUNICATION_AND_DESIGN = "İletişim ve Tasarım",
  FINE_ARTS = "Güzel Sanatlar",
  GRAPHIC_DESIGN = "Grafik Tasarım",
  INTERIOR_ARCHITECTURE_AND_ENVIRONMENTAL_DESIGN = "İç Mimarlık ve Çevre Tasarımı",
  URBAN_DESIGN_AND_LANDSCAPE_ARCHITECTURE = "Kentsel Tasarım ve Peyzaj Mimarisi",
  MANAGEMENT = "İşletme",
  ECONOMICS = "Ekonomi",
  INTERNATIONAL_RELATIONS = "Uluslararası İlişkiler",
  POLITICAL_SCIENCE_AND_PUBLIC_ADMINISTRATION = "Siyaset Bilimi ve Kamu Yönetimi",
  PSYCHOLOGY = "Psikoloji",
  COMPUTER_ENGINEERING = "Bilgisayar Mühendisliği",
  ELECTRICAL_AND_ELECTRONICS_ENGINEERING = "Elektrik ve Elektronik Mühendisliği",
  INDUSTRIAL_ENGINEERING = "Endüstri Mühendisliği",
  MECHANICAL_ENGINEERING = "Makine Mühendisliği",
  AMERICAN_CULTURE_AND_LITERATURE = "Amerikan Kültürü ve Edebiyatı",
  ARCHAEOLOGY = "Arkeoloji",
  ENGLISH_LANGUAGE_AND_LITERATURE = "İngiliz Dili ve Edebiyatı",
  PHILOSOPHY = "Felsefe",
  CHEMISTRY = "Kimya",
  MATHEMATICS = "Matematik",
  MOLECULAR_BIOLOGY_AND_GENETICS = "Moleküler Biyoloji ve Genetik",
  PHYSICS = "Fizik",
  MUSIC = "Müzik",
  INFORMATION_SYSTEMS_AND_TECHNOLOGIES = "Bilişim Sistemleri ve Teknolojileri",
  TOURISM_AND_HOTEL_MANAGEMENT = "Turizm ve Otel İşletmeciliği",
  HISTORY = "Tarih",
  TRANSLATION_AND_INTERPRETATION = "Mütercim-Tercümanlık",
  TURKISH_LITERATURE = "Türk Edebiyatı"
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
}

export enum DashboardCategoryText {
  NONE = "Boş :(",
  OWN_EVENT = "Rehberlik Edeceğiniz Etkinlikler",
  EVENT_INVITATION = "Rehberlik Etme Davetiyeleri",
  PENDING_APPLICATION = "Etkinlik Başvuruları",
  GUIDE_ASSIGNED = "Rehber Atanmış Etkinlikler",
  GUIDELESS = "Rehber Atanmamış Etkinlikler",
  PENDING_MODIFICATION = "Değişim Bekleyen Turlar",
}

export enum ApplicantRole {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}

export enum TourType {
  GROUP = "group",
  INDIVIDUAL = "individual",
}

export enum TourTypeText {
  GROUP = "Grup Turu",
  INDIVIDUAL = "Kişisel Tur",
}

export enum TourStatus {
  RECEIVED = "RECEIVED",
  TOYS_WANTS_CHANGE = "TOYS_WANTS_CHANGE",
  APPLICANT_WANTS_CHANGE = "APPLICANT_WANTS_CHANGE",
  CONFIRMED = "CONFIRMED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  ONGOING = "ONGOING",
  FINISHED = "FINISHED"
}

export enum TourStatusText {
  RECEIVED = "Onay Bekliyor",
  TOYS_WANTS_CHANGE = "Değişiklik Talebi Gönderildi",
  APPLICANT_WANTS_CHANGE = "Başvuran Değişiklik Yaptı",
  CONFIRMED = "Kabul Edildi",
  REJECTED = "Reddedildi",
  CANCELLED = "İptal Edildi",
  ONGOING = "Devam Ediyor",
  FINISHED = "Tamamlandı"
}

export enum FairStatus {
  RECEIVED = "RECEIVED",
  CONFIRMED = "CONFIRMED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  ONGOING = "ONGOING",
  FINISHED = "FINISHED"
}

export enum DayOfTheWeek {
  MONDAY = "Monday",
  TUESDAY = "Tuesday",
  WEDNESDAY = "Wednesday",
  THURSDAY = "Thursday",
  FRIDAY = "Friday",
  SATURDAY = "Saturday",
  SUNDAY = "Sunday"
}

export enum TimeSlotStatus {
  FREE = "FREE",
  BUSY = "BUSY"
}