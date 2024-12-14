import { ApplicantRole, Department, EventType, TourStatus, TourType } from "./enum.ts";

export interface LoginData {
  bilkentID: string,
  password: string
}

export interface TraineeGuideApplicationData {
  fullname: string,
  id: string,
  highschool: HighschoolData
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
  location: string,
  priority: number,
}

export interface TourData {
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

export interface SimpleEventData {
  event_type: EventType,
  event_id: string,
  highschool: HighschoolData,
  visitor_count: number,
  accepted_time: string,
  requested_times: string[],
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