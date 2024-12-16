package server.models.events;

import com.fasterxml.jackson.annotation.JsonIgnore;
import server.enums.status.ApplicationStatus;
import server.enums.types.ApplicationType;
import server.enums.Department;
import server.enums.types.TourType;
import server.models.Application;
import server.models.DTO.DTO_GroupTourApplication;
import server.models.DTO.DTO_IndividualTourApplication;
import server.models.time.ZTime;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class TourApplication extends Application {

    private TourType tour_type;
    private List<ZTime> requested_hours;
    private List<Department> interested_in;
    private long expected_souls;
    private String notes;
    private Applicant applicant;

    public TourApplication() {
        super();
    }

    protected TourApplication(Map<String,Object> map) {
        super(map);
        this.tour_type = TourType.valueOf((String) map.get("tour_type"));
        this.setType(ApplicationType.valueOf((String) map.get("type")));
        this.requested_hours = ((List<String>) map.get("requested_hours")).stream().map(s -> new ZTime(s)).toList();
        this.interested_in = (List<Department>) map.get("interested_in");
        this.expected_souls = (long) map.get("expected_souls");
        this.notes = (String) map.get("notes");
        this.applicant = Applicant.fromMap((Map<String, Object>) map.get("applicant"));
    }

    public static TourApplication fromMap(Map<String, Object> map) {
        return new TourApplication(map);
    }

    protected TourApplication(TourApplication application) {
        super(application);
        this.tour_type = application.getTour_type();
        this.requested_hours = application.getRequested_hours();
        this.interested_in = application.getInterested_in();
        this.expected_souls = application.getExpected_souls();
        this.notes = application.getNotes();
        this.applicant = application.getApplicant();
    }
    public static TourApplication fromDTO(DTO_GroupTourApplication dto) {
        TourApplication application = new TourApplication();

        application.setType(ApplicationType.TOUR);
        application.setTour_type(TourType.GROUP);
        application.setNotes(dto.getNotes());
        application.setExpected_souls(dto.getVisitor_count());
        application.setApplicant(Applicant.fromDTO(dto.getApplicant(), dto.getHighschool().getId()));
        application.setStatus(ApplicationStatus.RECIEVED);
        application.setInterested_in(new ArrayList<>());
        application.setRequested_hours(dto.getRequested_times());
        return application;
    }

    public static TourApplication fromDTO(DTO_IndividualTourApplication dto) {
        TourApplication application = new TourApplication();

        application.setType(ApplicationType.TOUR);
        application.setTour_type(TourType.INDIVIDUAL);
        application.setExpected_souls(dto.getVisitor_count());
        application.setApplicant(Applicant.fromDTO(dto.getApplicant(), dto.getHighschool().getId()));
        application.setStatus(ApplicationStatus.RECIEVED);
        application.setInterested_in(dto.getMajors());
        application.setNotes("No notes are provided for these applications.");
        application.setRequested_hours(dto.getRequested_times());
        return application;
    }

    @JsonIgnore
    public boolean isValid() {
        boolean valid = super.isValid();
        try {
            valid = valid && tour_type != null;
            valid = valid && requested_hours != null && !requested_hours.isEmpty();
            if (tour_type == TourType.INDIVIDUAL) {
                valid = valid && interested_in != null && !interested_in.isEmpty();
            }
            valid = valid && expected_souls > 0;
            valid = valid && applicant != null && applicant.isValid();

            if (expected_souls > 10) {
                valid = valid && tour_type == TourType.GROUP;
            } else {
                valid = valid && tour_type == TourType.INDIVIDUAL;
            }
        } catch (Exception e) {
            valid = false;
            System.out.println("TourApplication: Resulted in error in IsValid!");
        }
        return valid;
    }



    public TourType getTour_type() {
        return tour_type;
    }


    public List<Department> getInterested_in() {
        return interested_in;
    }

    public long getExpected_souls() {
        return expected_souls;
    }

    public String getNotes() {
        return notes;
    }

    public Applicant getApplicant() {
        return applicant;
    }

    public TourApplication setTour_type(TourType tour_type) {
        this.tour_type = tour_type;
        return this;
    }

    public List<ZTime> getRequested_hours() {
        return requested_hours;
    }

    public TourApplication setRequested_hours(List<ZTime> requested_hours) {
        this.requested_hours = requested_hours;
        return this;
    }

    public TourApplication setInterested_in(List<Department> interested_in) {
        this.interested_in = interested_in;
        return this;
    }

    public TourApplication setExpected_souls(long expected_souls) {
        this.expected_souls = expected_souls;
        return this;
    }

    public TourApplication setNotes(String notes) {
        this.notes = notes;
        return this;
    }

    public TourApplication setApplicant(Applicant applicant) {
        this.applicant = applicant;
        return this;
    }


}
