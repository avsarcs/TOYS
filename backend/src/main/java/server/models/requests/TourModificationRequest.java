package server.models.requests;

import server.models.events.TourApplication;

import java.util.Map;

public class TourModificationRequest extends Request {
    private String tour_id;
    private TourApplication modifications;

    protected TourModificationRequest(Map<String, Object> map) {
        super(map);
        this.tour_id = (String) map.get("tour_id");
        this.modifications = TourApplication.fromMap((Map<String, Object>) map.get("modifications"));
    }

    static public TourModificationRequest fromMap(Map<String, Object> map) {
        return new TourModificationRequest(map);
    }

    public TourModificationRequest() {
        super();
    }

    public String getTour_id() {
        return tour_id;
    }

    public TourModificationRequest setTour_id(String tour_id) {
        this.tour_id = tour_id;
        return this;
    }

    public TourApplication getModifications() {
        return modifications;
    }

    public TourModificationRequest setModifications(TourApplication modifications) {
        this.modifications = modifications;
        return this;
    }
}
