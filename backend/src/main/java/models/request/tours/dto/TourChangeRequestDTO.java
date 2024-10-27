package models.request.tours.dto;

import enums.types.TOUR_CHANGE_REQUEST_TYPE;
import models.request.Request;
import models.request.tours.base.TOUR_CHANGE_REQUEST_ORIGIN;
import models.request.tours.dataModels.TourChangeRequestDataModel;

public class TourChangeRequestDTO extends Request {
    private TOUR_CHANGE_REQUEST_TYPE type;
    private TOUR_CHANGE_REQUEST_ORIGIN request_origin;
    private TourChangeRequestDataModel data;
}