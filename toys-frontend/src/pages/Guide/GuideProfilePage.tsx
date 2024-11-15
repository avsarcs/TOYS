import React from "react";
import "./ProfilePage.css";
import ProfileInfo from "../../components/Guide/ProfileInfo.tsx";
import WeeklySchedule from "../../components/Guide/WeeklySchedule.tsx";

const ProfilePage = () => (
    <div className="profile-page">
        <div className="content">
            <h1>Profile</h1>
            <ProfileInfo />
            <WeeklySchedule />
        </div>
    </div>
);

export default ProfilePage;
