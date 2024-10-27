package models.data.fairs;

import models.data.tours.TourApplicantModel;

import java.time.ZonedDateTime;

public class FairInvitationModel {
    private String highschool_id;
    private TourApplicantModel applicant;
    private String fair_name;
    private ZonedDateTime start_time;
    private ZonedDateTime end_time;
    private String notes;
}
