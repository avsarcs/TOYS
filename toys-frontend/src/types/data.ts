import { ApplicantRole, Department, EventType, TourStatus, TourType } from "./enum.ts";

export interface LoginData {
  bilkentId: number,
  password: string
}

export interface GuideApplicationData extends LoginData {
  fullName: string,
  email: string,
  phoneNumber: string,
  department: string,
  semester: number,
  hasExchange: boolean,
  howDidYouHear: string,
  whyApply: string
}

export interface ApplicantData {
  full_name: string,
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
  highschool_name: string,
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