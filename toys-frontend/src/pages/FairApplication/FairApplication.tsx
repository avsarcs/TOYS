import React, { useState } from 'react';
import { Button, Alert } from '@mantine/core';
import { IconChevronRight, IconChevronLeft, IconAlertCircle } from "@tabler/icons-react"
import { Stepper } from '@mantine/core';
import "./FairApplication.css";
import { FairApplicationModel } from '../../types/designed';
import isEmail from 'validator/lib/isEmail'
import isMobilePhone from 'validator/lib/isMobilePhone';
import isEmpty from 'validator/lib/isEmpty';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

import { useNavigate } from 'react-router-dom';

import TeacherInfoStage from '../../components/TourApplication/TeacherInfoStage';
import TimeSlotStage from '../../components/TourApplication/TimeSlotStage';
import NotesStage from '../../components/TourApplication/NotesStage';
const TOUR_APPLICATION_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/apply/tour")


export const FairApplication: React.FC = () => {
  return (
	<div>
	  {/* Add your component content here */}
	</div>
  );
};
export default FairApplication;
