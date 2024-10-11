package models.request.base;

import enums.status.TOUR_CHANGE_REQUEST_STATUS;
import enums.types.TOUR_CHANGE_REQUEST_TYPE;

import java.time.ZonedDateTime;

public class TourChangeRequestModel {
    private TOUR_CHANGE_REQUEST_TYPE type;
    private TOUR_CHANGE_REQUEST_ORIGIN request_origin;
    private ZonedDateTime requested_at;
    private TourChangeRequestDataModel data;
    private TOUR_CHANGE_REQUEST_STATUS status;
}