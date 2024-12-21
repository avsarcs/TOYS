import {
  ApplicantRole,
  Department,
  EventType,
  TourStatus,
  TourType,
  UserRole,
  DayOfTheWeek,
  TimeSlotStatus,
  City,
  FairStatus
} from "./enum.ts";

export interface LoginData {
  bilkentID: string,
  password: string
}

export interface TraineeGuideApplicationData {
  id: string,
  fullname: string,
  highschool: HighschoolData,
  email: string,
  phone: string,
  major: string,
  current_semester: number,
  next_semester_exchange: boolean,
  how_did_you_hear: string,
  why_apply: string
}

export interface ApplicantData {
  fullname: string,
  role: ApplicantRole,
  email: string,
  phone: string,
  notes: string
}

export interface HighschoolData {
  id: string,
  name: string,
  location: City,
  priority: number,
  ranking: number
}

export interface TourData {
  tour_id: string,
  type: TourType,
  highschool: HighschoolData,
  guides: { id: string; full_name: string, highschool: HighschoolData }[],
  requested_majors: Department[],
  trainee_guides: { id: string; full_name: string, highschool: HighschoolData }[],
  requested_times: string[],
  accepted_time: string,
  visitor_count: number,
  status: TourStatus,
  notes: string,
  applicant: ApplicantData,
  actual_start_time: string,
  actual_end_time: string,
  classroom: string,
}

export interface ProfileData{
  experience: string,
  id: string,
  email: string,
  created_at: string,
  updated_at: string,
  fullname: string,
  phone: string,
  highschool: HighschoolDataForProfile,
  schedule: ScheduleStub,
  iban: string,
  bank: string,
  major: string,
  reviews: {
    average: number,
    count: number
  },
  role: UserRole
  responsible_days: DayOfTheWeek[]
  profile_picture: string,
  previous_tour_count: number,
  profile_description: string,
  advisor_offer: boolean
}
export interface HighschoolDataForProfile {
  id: string,
  name: string
}
export interface ScheduleStub {
  schedule: ScheduleData
}
export interface ScheduleData {
  MONDAY: DailyPlan,
  TUESDAY: DailyPlan,
  WEDNESDAY: DailyPlan,
  THURSDAY: DailyPlan,
  FRIDAY: DailyPlan,
  SATURDAY: DailyPlan,
  SUNDAY: DailyPlan
}

export interface DailyPlan {
  _830_930: TimeSlotStatus,
  _930_1030: TimeSlotStatus,
  _1030_1130: TimeSlotStatus,
  _1130_1230: TimeSlotStatus,
  _1230_1330: TimeSlotStatus,
  _1330_1430: TimeSlotStatus,
  _1430_1530: TimeSlotStatus,
  _1530_1630: TimeSlotStatus,
  _1630_1730: TimeSlotStatus,
  _1730_1830: TimeSlotStatus
}

export interface SimpleEventData {
  event_type: EventType,
  event_subtype: TourType | "FAIR",
  event_id: string,
  event_status: TourStatus | FairStatus, 
  highschool: HighschoolData,
  visitor_count?: number,
  accepted_time: string,
  requested_times: string[],
}

export interface SimpleGuideData {
  id: string,
  name: string,
  role: string,
  major: string,
  experience: string,
}
interface Recipient {
  id: string;
  name: string;
}

export type OfferStatus = 'ACCEPTED' | 'REJECTED' | 'PENDING';

export interface AdvisorOffer {
  recipient: Recipient;
  status: OfferStatus;
  offer_date: string;  // ISO 8601 datetime string
  response_date: string;
  rejection_reason: string;
}

export interface TourToReview {
  tour_id: string;
  tour_date: string;  // ISO 8601 format
  guides: {
    id: string,
    name: string
  }[];
}

export interface Review {
  id: string;
  for: "TOUR" | "GUIDE";
  tour_id: string;
  tour_date: string;
  guide?: {
    id: string;
    name: string;
  };
  score: number;
  body?: string;
}