import { Dispatch, SetStateAction } from "react";
import {
  DashboardCategory,
  DashboardCategoryText,
  UserRole
} from "./enum.ts";
import { HighschoolData, ProfileData, SimpleEventData, TourData, FairData } from "./data.ts";
import {OnlyChildrenProps} from "./generic.ts";

export interface User {
  id: string,
  role: UserRole,
  profile: ProfileData
}

export interface NavbarProps {
  mode: string;
}

export interface IndividualApplication {
  highschool: HighschoolData,
  requested_times: string[],
  requested_majors: string[],
  visitor_count: number,
  applicant: {
    fullname: string,
    role: string,
    email: string,
    phone: string,
    notes: string
  }
}

export interface GroupApplication {
  highschool: HighschoolData,
  requested_times: string[],
  visitor_count: number,
  applicant: {
    fullname: string,
    role: string,
    email: string,
    phone: string,
    notes: string
  }
}

export interface FairApplicationModel {
  applicant: {
		fullname: string;
		email: string;
    role: string;
		phone: string;
		school: HighschoolData;
    notes: string;
	};
	start_time: string;
  end_time: string;
  fair_name: string;
}

export interface GroupApplicationStageProps {
  applicationInfo: GroupApplication;
  setApplicationInfo: Dispatch<SetStateAction<GroupApplication>>;
  warnings: Record<any, any>;
}

export interface FairApplicationProps {
  applicationInfo: FairApplicationModel;
  setApplicationInfo: Dispatch<SetStateAction<FairApplicationModel>>;
  warnings: Record<any, any>;
}



export interface IndividualApplicationStageProps {
  applicationInfo: IndividualApplication,
  setApplicationInfo: Dispatch<SetStateAction<IndividualApplication>>,
  warnings: Record<any, any>
}

export interface SimpleToysApplication {
  id: string;
  fullname: string;
  experience: string;
}

export interface TraineeApplication {
  fullname: string;
  id: string;
  high_school: string;
  email: string;
  phone: string;
  major: string;
  current_semester: number;
  next_semester_exchange: boolean;
  how_did_you_hear: string;
  why_apply: string;
}

export interface AdvisorApplication {
  id: string,
  high_school: string,
  fullname: string,
  phone: string,
  major: string,
  application_explanation : string,
  experience: string
}

export interface LoginFormProps {
  setRegistering: Dispatch<SetStateAction<boolean>>
}

export interface RegisterFormProps {
  setRegistering: Dispatch<SetStateAction<boolean>>
}

export interface DashboardCategoryControlProps {
  categories: { value: DashboardCategory, label: DashboardCategoryText }[],
  setCategory: Dispatch<SetStateAction<DashboardCategory>>,
}

export interface DashboardItemProps {
  item: SimpleEventData,
  setItem: Dispatch<SetStateAction<SimpleEventData | null>>
}

export interface DashboardItemListProps {
  loading: boolean,
  categories: { value: DashboardCategory, label: DashboardCategoryText }[],
  category: DashboardCategory,
  setCategory: Dispatch<SetStateAction<DashboardCategory>>
  items: SimpleEventData[]
  setItem: Dispatch<SetStateAction<SimpleEventData | null>>
}

export interface DashboardInfoBoxProps {
  category: DashboardCategory,
  item: SimpleEventData,
  updateDashboard: () => void,
}

export interface DashboardInfoBoxButtonProps {
  item: SimpleEventData,
  updateDashboard: () => void
}

export interface EventInvitationRespondButtonProps extends DashboardInfoBoxButtonProps, OnlyChildrenProps{
  response: boolean
}

export interface TourSectionProps {
  tour: TourData,
  refreshTour: () => void
}

export interface FairSectionProps {
  fair: FairData,
  refreshFair: () => void
}

export interface TourButtonProps {
  tour: TourData,
  refreshTour: () => void
}

export interface ManageGuidesWindowProps {
  opened: boolean; // Controls modal visibility
  onClose: () => void; // Closes the modal
  tour: TourData; // ISO 8601 time
  totalGuidesNeeded: number; // Total number of guides needed for the tour
}
export interface TourListItemProps {
  tour: SimpleEventData
}
export interface FairListItemProps {
  fair: SimpleEventData
}

export interface ProfileComponentProps {
  profile: ProfileData
}

export interface MoneyForGuide {
  guide: {
      id: number;
      name: string;
      iban: string;
      bank: string;
  };
  unpaid_hours: number;
  debt: number;
  money_paid: number;
}

export interface MoneyForEvent {
  event_id: number;
  event_date: string;
  hourly_rate: number;
  event_highschool: HighschoolData;
  hours_worked: number;
  money_debted: number;
  money_paid: number;
  guide_name: string;
  event_type: string;
}

export interface SimpleGuide {
  id: number;
  name: string;
  major: string;
  experience: string;
}

export interface ProfileComponentProps{
  profile: ProfileData
}