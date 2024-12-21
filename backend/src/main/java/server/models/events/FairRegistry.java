package server.models.events;

import server.enums.status.FairStatus;

import java.util.List;
import java.util.Map;

public class FairRegistry extends FairApplication {
    private List<String> guides;
    private FairStatus fair_status;
    private String notes;
    private List<String> reviews;
    private String fair_id;

    public FairRegistry() {
        super();
        fair_id = "fair_" + System.currentTimeMillis();
    }

    public FairRegistry(FairApplication application) {
        super(application);
        fair_id = "fair_" + System.currentTimeMillis();
    }
    protected FairRegistry(Map<String,Object> map) {
        super(map);
        this.guides = (List<String>) map.get("guides");
        this.fair_status = FairStatus.valueOf((String) map.get("status"));
        this.notes = (String) map.get("notes");
        this.reviews = (List<String>) map.get("reviews");
        this.fair_id = (String) map.get("fair_id");
    }
    public static FairRegistry fromMap(Map<String, Object> map) {
        return new FairRegistry(map);
    }

    public List<String> getGuides() {
        return guides;
    }

    public FairStatus getFair_status() {
        return fair_status;
    }

    public String getNotes() {
        return notes;
    }

    public List<String> getReviews() {
        return reviews;
    }

    public String getFair_id() {
        return fair_id;
    }
}
