The Tour object is defined as follows:

[
    {
        "highschool_id": "TheIDOfTheHighSchool1",
        "guides": [
            {
                "id": "TheIDOfTheTourGuide1",
                "status": "advisor_sent_request", // or "accepted" or "rejected"
            }
        ],
        "type": "individual", // or "group"
        "requested_times": ["2024-09-30T09:00:00Z", "2024-09-30T11:00:00Z"],
        "accepted_time": "2024-09-30T09:00:00Z",
        "visitor_count": 66,
        "status": "awaiting_confirmation", // or "confirmed" or "rejected" or "awaiting_changes"
        "notes": "The notes for the tour added by the tour guide and the advisor.",
        "applicant": {
            "name": "TheNameOfTheApplicant1",
            "role": "student", // or "teacher"
            "email": "TheEmailOfTheApplicant1",
            "phone": "ThePhoneOfTheApplicant1",
            "notes": "Notes added by the applicant."
        }
        "classroom": "Mithat Çoruh"
    }
]