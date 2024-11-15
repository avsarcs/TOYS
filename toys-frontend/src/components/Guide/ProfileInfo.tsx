import React from "react";

const ProfileInfo = () => (
    <div className="profile-info">
        <h2>User Details</h2>
        <div className="personal-info">
            <p><strong>Name:</strong> Scarlett Johansson</p>
            <p><strong>E-Mail:</strong> ege.celik@ug.bilkent.edu.tr</p>
            <p><strong>ID:</strong> 2202321</p>
            <p><strong>High School:</strong> ODTÜ GVO Lisesi</p>
            <p><strong>Department:</strong> CS</p>
        </div>
        <div className="toys-info">
            <p><strong>Current Role:</strong> Advisor</p>
            <p><strong>Tours Guided:</strong> 45</p>
            <p><strong>Total Experience:</strong> 2 years</p>
        </div>
        <button>Edit Personal Information</button>
        <button>Apply to Be an Advisor</button>
    </div>
);

export default ProfileInfo;
