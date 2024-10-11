package models.data.tours;

import enums.types.TOUR_TYPE;
import models.request.tours.dto.TourChangeRequestDTO;

import java.time.ZonedDateTime;
import java.util.List;

public class TourApplicationModel extends TourChangeRequestDTO {
    private ZonedDateTime requested_at;
}
