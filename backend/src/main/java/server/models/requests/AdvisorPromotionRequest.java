package server.models.requests;

import server.models.time.ZTime;

import java.util.Map;

public class AdvisorPromotionRequest extends Request{
    private String guide_id;
    private String rejection_reason;
    private ZTime responded_at;

    public AdvisorPromotionRequest() {
        super();
    }

    protected AdvisorPromotionRequest(Map<String, Object> map) {
        super(map);
        this.guide_id = (String) map.get("guide_id");
        this.rejection_reason = (String) map.get("rejection_reason");
        this.responded_at = new ZTime((String) map.get("responded_at"));
    }

    static public AdvisorPromotionRequest fromMap(Map<String, Object> map) {
        return new AdvisorPromotionRequest(map);
    }


    public ZTime getResponded_at() {
        return responded_at;
    }

    public AdvisorPromotionRequest setResponded_at(ZTime responded_at) {
        this.responded_at = responded_at;
        return this;
    }

    public String getGuide_id() {
        return guide_id;
    }

    public String getRejection_reason() {
        return rejection_reason;
    }

    public AdvisorPromotionRequest setRejection_reason(String rejection_reason) {
        this.rejection_reason = rejection_reason;
        return this;
    }

    public AdvisorPromotionRequest setGuide_id(String guide_id) {
        this.guide_id = guide_id;
        return this;
    }
}
