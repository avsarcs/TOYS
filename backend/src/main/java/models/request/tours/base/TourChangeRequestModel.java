package models.request.tours.base;

import enums.status.TOUR_CHANGE_REQUEST_STATUS;
import models.request.tours.dto.TourChangeRequestDTO;

import java.time.ZonedDateTime;

public class TourChangeRequestModel extends TourChangeRequestDTO {
    private ZonedDateTime requested_at;
    private TOUR_CHANGE_REQUEST_STATUS status;
}