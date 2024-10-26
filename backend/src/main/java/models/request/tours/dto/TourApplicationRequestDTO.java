package models.request.tours.dto;

import enums.types.TOUR_TYPE;
import models.data.highschool.HighSchoolModel;
import models.data.tours.TourApplicantModel;

import java.time.ZonedDateTime;
import java.util.List;

public class TourApplicationRequestDTO {
    private HighSchoolModel highSchool;
    private List<ZonedDateTime> requested_dates;

    private TourApplicantModel applicant;

    private int visitor_count;
    private TOUR_TYPE type;

    private String notes;
}
