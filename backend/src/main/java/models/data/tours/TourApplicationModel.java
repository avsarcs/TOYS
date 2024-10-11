package models.data.tours;

import enums.types.TOUR_TYPE;

import java.time.ZonedDateTime;
import java.util.List;

public class TourApplicationModel {
    private ZonedDateTime requested_at;
    private int visitor_count;
    private TOUR_TYPE type;
    private String highschool_id;
    private String notes;
    private List<ZonedDateTime> requested_dates;
    private TourApplicantModel applicant;
}
