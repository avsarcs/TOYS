package server.models.review;

import java.util.Map;

public class DTO_GuideReview extends DTO_ReviewCreate{
    private String guide_id;
    private String guide_name;

    protected DTO_GuideReview(Map<String, Object> map) {
        super(map);
        this.guide_id = (String) map.get("guide_id");
        this.guide_name = (String) map.get("guide_name");
    }

    public static DTO_GuideReview fromMap(Map<String, Object> map) {
        return new DTO_GuideReview(map);
    }

    public String getGuide_id() {
        return guide_id;
    }

    public DTO_GuideReview setGuide_id(String guide_id) {
        this.guide_id = guide_id;
        return this;
    }

    public String getGuide_name() {
        return guide_name;
    }

    public DTO_GuideReview setGuide_name(String guide_name) {
        this.guide_name = guide_name;
        return this;
    }
}
