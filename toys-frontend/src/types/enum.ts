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
  DIRECTOR = "DIRECTOR",
  ADMIN = "ADMIN"
}

export enum UserRoleText {
  NONE = "HATALI",
  TRAINEE = "Amatör Rehber",
  GUIDE = "Rehber",
  ADVISOR = "Danışman",
  COORDINATOR = "Koordinatör",
  DIRECTOR = "Direktör",
  ADMIN = "Yönetici",
}
export enum BackendDepartment{
  ARCHITECTURE = "ARCHITECTURE",
  COMMUNICATION_AND_DESIGN = "COMMUNICATION_AND_DESIGN",
  FINE_ARTS = "FINE_ARTS",
  GRAPHIC_DESIGN = "GRAPHIC_DESIGN",
  INTERIOR_ARCHITECTURE_AND_ENVIRONMENTAL_DESIGN = "INTERIOR_ARCHITECTURE_AND_ENVIRONMENTAL_DESIGN",
  URBAN_DESIGN_AND_LANDSCAPE_ARCHITECTURE = "URBAN_DESIGN_AND_LANDSCAPE_ARCHITECTURE",
  MANAGEMENT = "MANAGEMENT",
  ECONOMICS = "ECONOMICS",
  INTERNATIONAL_RELATIONS = "INTERNATIONAL_RELATIONS",
  POLITICAL_SCIENCE_AND_PUBLIC_ADMINISTRATION = "POLITICAL_SCIENCE_AND_PUBLIC_ADMINISTRATION",
  PSYCHOLOGY = "PSYCHOLOGY",
  COMPUTER_ENGINEERING = "COMPUTER_ENGINEERING",
  ELECTRICAL_AND_ELECTRONICS_ENGINEERING = "ELECTRICAL_AND_ELECTRONICS_ENGINEERING",
  INDUSTRIAL_ENGINEERING = "INDUSTRIAL_ENGINEERING",
  MECHANICAL_ENGINEERING = "MECHANICAL_ENGINEERING",
  AMERICAN_CULTURE_AND_LITERATURE = "AMERICAN_CULTURE_AND_LITERATURE",
  ARCHAEOLOGY = "ARCHAEOLOGY",
  ENGLISH_LANGUAGE_AND_LITERATURE = "ENGLISH_LANGUAGE_AND_LITERATURE",
  PHILOSOPHY = "PHILOSOPHY",
  CHEMISTRY = "CHEMISTRY",
  MATHEMATICS = "MATHEMATICS",
  MOLECULAR_BIOLOGY_AND_GENETICS = "MOLECULAR_BIOLOGY_AND_GENETICS",
  PHYSICS = "PHYSICS",
  MUSIC = "MUSIC",
  INFORMATION_SYSTEMS_AND_TECHNOLOGIES = "INFORMATION_SYSTEMS_AND_TECHNOLOGIES",
  TOURISM_AND_HOTEL_MANAGEMENT = "TOURISM_AND_HOTEL_MANAGEMENT",
  HISTORY = "HISTORY",
  TRANSLATION_AND_INTERPRETATION = "TRANSLATION_AND_INTERPRETATION",
  TURKISH_LITERATURE = "TURKISH_LITERATURE"  
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
  GROUP = "GROUP",
  INDIVIDUAL = "INDIVIDUAL",
}

export enum TourTypeText {
  GROUP = "Grup Turu",
  INDIVIDUAL = "Kişisel Tur",
  FAIR = "",
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

export enum FairStatusText {
  RECEIVED = "Onay Bekliyor",
  CONFIRMED = "Onaylandı",
  REJECTED = "Reddedildi",
  CANCELLED = "İptal Edildi",
  ONGOING = "Devam Ediyor",
  FINISHED = "Tamamlandı"
}
export enum DayOfTheWeek {
  MONDAY = "Pazartesi",
  TUESDAY = "Salı",
  WEDNESDAY = "Çarşamba",
  THURSDAY = "Perşembe",
  FRIDAY = "Cuma",
  SATURDAY = "Cumartesi",
  SUNDAY = "Pazar"
}

export enum TimeSlotStatus {
  FREE = "FREE",
  BUSY = "BUSY"
}

export enum City {
  ADANA = "Adana",
  ADIYAMAN = "Adıyaman",
  AFYONKARAHISAR = "Afyonkarahisar",
  AGRI = "Ağrı",
  AKSARAY = "Aksaray",
  AMASYA = "Amasya",
  ANKARA = "Ankara",
  ANTALYA = "Antalya",
  ARDAHAN = "Ardahan",
  ARTVIN = "Artvin",
  AYDIN = "Aydın",
  BALIKESIR = "Balıkesir",
  BARTIN = "Bartın",
  BATMAN = "Batman",
  BAYBURT = "Bayburt",
  BILECIK = "Bilecik",
  BINGOL = "Bingöl",
  BITLIS = "Bitlis",
  BOLU = "Bolu",
  BURDUR = "Burdur",
  BURSA = "Bursa",
  CANAKKALE = "Çanakkale",
  CANKIRI = "Çankırı",
  CORUM = "Çorum",
  DENIZLI = "Denizli",
  DIYARBAKIR = "Diyarbakır",
  DUZCE = "Düzce",
  EDIRNE = "Edirne",
  ELAZIG = "Elazığ",
  ERZINCAN = "Erzincan",
  ERZURUM = "Erzurum",
  ESKISEHIR = "Eskişehir",
  GAZIANTEP = "Gaziantep",
  GIRESUN = "Giresun",
  GUMUSHANE = "Gümüşhane",
  HAKKARI = "Hakkâri",
  HATAY = "Hatay",
  IGDIR = "Iğdır",
  ISPARTA = "Isparta",
  ISTANBUL = "İstanbul",
  IZMIR = "İzmir",
  KAHRAMANMARAS = "Kahramanmaraş",
  KARABUK = "Karabük",
  KARAMAN = "Karaman",
  KARS = "Kars",
  KASTAMONU = "Kastamonu",
  KAYSERI = "Kayseri",
  KIRIKKALE = "Kırıkkale",
  KIRKLARELI = "Kırklareli",
  KIRSEHIR = "Kırşehir",
  KILIS = "Kilis",
  KOCAELI = "Kocaeli",
  KONYA = "Konya",
  KUTAHYA = "Kütahya",
  MALATYA = "Malatya",
  MANISA = "Manisa",
  MARDIN = "Mardin",
  MERSIN = "Mersin",
  MUGLA = "Muğla",
  MUS = "Muş",
  NEVSEHIR = "Nevşehir",
  NIGDE = "Niğde",
  ORDU = "Ordu",
  OSMANIYE = "Osmaniye",
  RIZE = "Rize",
  SAKARYA = "Sakarya",
  SAMSUN = "Samsun",
  SIIRT = "Siirt",
  SINOP = "Sinop",
  SIVAS = "Sivas",
  SANLIURFA = "Şanlıurfa",
  SIRNAK = "Şırnak",
  TEKIRDAG = "Tekirdağ",
  TOKAT = "Tokat",
  TRABZON = "Trabzon",
  TUNCELI = "Tunceli",
  USAK = "Uşak",
  VAN = "Van",
  YALOVA = "Yalova",
  YOZGAT = "Yozgat",
  ZONGULDAK = "Zonguldak",
}