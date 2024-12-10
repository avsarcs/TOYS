package server.models.events;

import server.enums.types.TourModificationType;
import server.models.Request;

import java.util.Map;

public class TourModificationRequest extends Request {

    public TourModificationRequest() {
        super();
    }

    protected TourModificationRequest(Map<String, Object> map) {
        super(map);
        this.tour_id = (String) map.get("tour_id");
        this.modification_type = TourModificationType.valueOf((String) map.get("modification_type"));
        this.requested_tour = TourApplication.fromMap((Map<String, Object>) map.get("requested_tour"));
    }

    private String tour_id;
    private TourModificationType modification_type;
    private TourApplication requested_tour;

    public String getTour_id() {
        return tour_id;
    }

    public TourModificationRequest setTour_id(String tour_id) {
        this.tour_id = tour_id;
        return this;
    }

    public TourModificationType getModification_type() {
        return modification_type;
    }

    public TourModificationRequest setModification_type(TourModificationType modification_type) {
        this.modification_type = modification_type;
        return this;
    }

    public TourApplication getRequested_tour() {
        return requested_tour;
    }

    public TourModificationRequest setRequested_tour(TourApplication requested_tour) {
        this.requested_tour = requested_tour;
        return this;
    }
}
