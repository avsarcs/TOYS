package models.data.tours;

import enums.status.TOUR_STATUS;
import enums.types.TOUR_TYPE;
import models.data.guides.GuideModel;

import java.time.ZonedDateTime;
import java.util.List;

public class TourModel {
    private String id; // this is an internal identifier, to be used for data manipulation
    private TOUR_TYPE type;
    private TOUR_STATUS status;
    private int visitor_count;
    private ZonedDateTime accepted_date;
    private String assigned_location;
    private String notes;

    private List<GuideModel> guides;
    private TourApplicationModel application;
}
