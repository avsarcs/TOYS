package server.models.schools;

public class HighschoolEntrenceDetails {
    private String duration;
    private String language;
    private String puan;
    private String percentile;
    private String quota;


    public static HighschoolEntrenceDetails getDefault() {
        HighschoolEntrenceDetails details = new HighschoolEntrenceDetails();
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

    public HighschoolEntrenceDetails setDuration(String duration) {
        this.duration = duration;
        return this;
    }

    public String getLanguage() {
        return language;
    }

    public HighschoolEntrenceDetails setLanguage(String language) {
        this.language = language;
        return this;
    }

    public String getPuan() {
        return puan;
    }

    public HighschoolEntrenceDetails setPuan(String puan) {
        this.puan = puan;
        return this;
    }

    public String getPercentile() {
        return percentile;
    }

    public HighschoolEntrenceDetails setPercentile(String percentile) {
        this.percentile = percentile;
        return this;
    }

    public String getQuota() {
        return quota;
    }

    public HighschoolEntrenceDetails setQuota(String quota) {
        this.quota = quota;
        return this;
    }
}
