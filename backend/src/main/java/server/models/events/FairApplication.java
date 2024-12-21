package server.models.events;

import server.models.Application;
import server.models.time.ZTime;

import java.util.Map;

public class FairApplication extends Application {
    public FairApplication() {
        super();
    }

    protected FairApplication(FairApplication application) {
        super(application);
        this.starts_at = application.starts_at;
        this.ends_at = application.ends_at;
        this.notes = application.notes;
        this.fair_name = application.fair_name;
        this.applicant = application.applicant;
    }

    protected FairApplication(Map<String,Object> map) {
        super(map);
        this.starts_at = ZTime.fromMap((Map<String, Object>) map.get("starts_at"));
        this.ends_at = ZTime.fromMap((Map<String, Object>) map.get("end_at"));
        this.notes = (String) map.get("notes");
        this.fair_name = (String) map.get("fair_name");
        this.applicant = Applicant.fromMap((Map<String, Object>) map.get("applicant"));
    }

    public static FairApplication fromMap(Map<String, Object> map) {
        return new FairApplication(map);
    }

    private ZTime starts_at;
    private ZTime ends_at;
    private String notes;

    private String fair_name;

    private Applicant applicant;


    public ZTime getStarts_at() {
        return starts_at;
    }

    public ZTime getEnds_at() {
        return ends_at;
    }

    public String getNotes() {
        return notes;
    }

    public String getFair_name() {
        return fair_name;
    }

    public Applicant getApplicant() {
        return applicant;
    }
}
