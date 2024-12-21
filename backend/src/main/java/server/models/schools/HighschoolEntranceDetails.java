package server.models.schools;

import java.util.Map;

public class HighschoolEntranceDetails {
    private String duration;
    private String language;
    private String puan;
    private String percentile;
    private String quota;

    public HighschoolEntranceDetails(HighschoolEntranceDetails other) {
        this.duration = other.duration;
        this.language = other.language;
        this.puan = other.puan;
        this.percentile = other.percentile;
        this.quota = other.quota;
    }

    protected HighschoolEntranceDetails(Map<String, Object> map) {
        duration = (String) map.get("duration");
        language = (String) map.get("language");
        puan = (String) map.get("puan");
        percentile = (String) map.get("percentile");
        quota = (String) map.get("quota");
    }

    public static HighschoolEntranceDetails fromMap(Map<String, Object> map) {
        return new HighschoolEntranceDetails(map);
    }

    public HighschoolEntranceDetails() {};

    public static HighschoolEntranceDetails getDefault() {
        HighschoolEntranceDetails details = new HighschoolEntranceDetails();
        details.setDuration("Default Duration");
        details.setLanguage("Default Language");
        details.setPuan("Default Puan");
        details.setPercentile("Default Percentile");
        details.setQuota("Default Quota");
        return details;
    }

    public String getDuration() {
        return duration;
    }

    public HighschoolEntranceDetails setDuration(String duration) {
        this.duration = duration;
        return this;
    }

    public String getLanguage() {
        return language;
    }

    public HighschoolEntranceDetails setLanguage(String language) {
        this.language = language;
        return this;
    }

    public String getPuan() {
        return puan;
    }

    public HighschoolEntranceDetails setPuan(String puan) {
        this.puan = puan;
        return this;
    }

    public String getPercentile() {
        return percentile;
    }

    public HighschoolEntranceDetails setPercentile(String percentile) {
        this.percentile = percentile;
        return this;
    }

    public String getQuota() {
        return quota;
    }

    public HighschoolEntranceDetails setQuota(String quota) {
        this.quota = quota;
        return this;
    }
}
