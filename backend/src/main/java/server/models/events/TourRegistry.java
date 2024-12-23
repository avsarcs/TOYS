package server.models.events;

import server.enums.status.ApplicationStatus;
import server.enums.types.ApplicationType;
import server.enums.types.TourType;
import server.enums.status.TourStatus;
import server.models.DTO.DTO_IndividualTour;
import server.models.DTO.DTO_SimpleGuide;
import server.models.DTO.GroupTourStatus;
import server.models.time.ZTime;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class TourRegistry extends TourApplication {
    public TourRegistry() {
        super();
        tour_id = "tour_" + System.currentTimeMillis();
    }

    public TourRegistry(TourApplication application, String id) {
        super(application);

        this.tour_id = id;

        this.accepted_time = new ZTime("1970-01-01T00:00:00Z");
        this.guides = new ArrayList<>();
        this.tour_status = TourStatus.RECEIVED;
        this.notes = "";
        this.reviews = new ArrayList<>();
        this.started_at = new ZTime("1970-01-01T00:00:00Z");
        this.ended_at = new ZTime("1970-01-01T00:00:00Z");
        this.classroom = "";
    }

    public TourRegistry(TourApplication application) {
        super(application);

        tour_id = "tour_" + System.currentTimeMillis();

        this.accepted_time = new ZTime("1970-01-01T00:00:00Z");
        this.guides = new ArrayList<>();
        this.tour_status = TourStatus.RECEIVED;
        this.notes = "";
        this.reviews = new ArrayList<>();
        this.started_at = new ZTime("1970-01-01T00:00:00Z");
        this.ended_at = new ZTime("1970-01-01T00:00:00Z");
        this.classroom = "";
    }

    public static TourRegistry getDefault() {
        TourRegistry tour = new TourRegistry();
        tour.setTour_id("tour_-1");
        tour.setTour_status(TourStatus.CONFIRMED);
        tour.setAccepted_time(new ZTime(ZonedDateTime.now()));
        tour.setEnded_at(new ZTime(ZonedDateTime.ofInstant(Instant.EPOCH, ZoneId.of("UTC"))));
        tour.setStarted_at(tour.getEnded_at());
        tour.setInterested_in(new ArrayList<>());
        tour.setNotes("Default Notes");
        tour.setClassroom("Default Classroom");
        tour.setRequested_hours(new ArrayList<>());
        tour.setGuides(new ArrayList<>());
        tour.setApplicant(Applicant.getDefault());
        tour.setStatus(ApplicationStatus.APPROVED);
        tour.setType(ApplicationType.TOUR);
        tour.setTour_type(TourType.GROUP);
        tour.setReviews(new ArrayList<>());
        return tour;
    }

    protected TourRegistry(Map<String,Object> map) {
        super(map);
        this.accepted_time = new ZTime(ZonedDateTime.parse((String) map.get("accepted_time")));
        this.guides = (List<String>) map.get("guides");
        this.tour_status = TourStatus.valueOf((String) map.get("tourStatus"));
        this.notes = (String) map.get("notes");
        this.reviews = (List<String>) map.get("reviews");
        this.started_at = new ZTime(ZonedDateTime.parse((String) map.get("started_at")));
        this.ended_at = new ZTime(ZonedDateTime.parse((String) map.get("ended_at")));
        this.tour_id = (String) map.get("tour_id");
        this.classroom = (String) map.get("classroom");
    }

    public ZTime getAccepted_time() {
        return accepted_time;
    }

    public ZTime getStarted_at() {
        return started_at;
    }

    public ZTime getEnded_at() {
        return ended_at;
    }

    public TourRegistry modify(TourApplication application) {
        this.setApplicant(application.getApplicant());
        this.setInterested_in(application.getInterested_in());
        this.setExpected_souls(application.getExpected_souls());
        this.getApplicant().setNotes(application.getApplicant().getNotes());
        this.setRequested_hours(application.getRequested_hours());
        this.setStatus(application.getStatus());
        this.setTour_type(application.getTour_type());
        this.setType(application.getType());
        return this;
    }

    public static TourRegistry fromMap(Map<String, Object> map) {
        return new TourRegistry(map);
    }

    public String getTour_id() {
        return tour_id;
    }


    public List<String> getGuides() {
        return guides;
    }


    public TourStatus getTourStatus() {
        return tour_status;
    }

    @Override
    public String getNotes() {
        return notes;
    }

    public List<String> getReviews() {
        return reviews;
    }



    public TourRegistry setTour_status(TourStatus tour_status) {
        this.tour_status = tour_status;
        return this;
    }

    public TourRegistry setAccepted_time(ZTime accepted_time) {
        this.accepted_time = accepted_time;
        return this;
    }

    public TourRegistry setEnded_at(ZTime ended_at) {
        this.ended_at = ended_at;
        return this;
    }

    public TourRegistry setStarted_at(ZTime started_at) {
        this.started_at = started_at;
        return this;
    }

    public String getClassroom() {
        return classroom;
    }

    public TourRegistry setClassroom(String classroom) {
        this.classroom = classroom;
        return this;
    }

    public TourRegistry setGuides(List<String> guides) {
        this.guides = guides;
        return this;
    }


    public TourRegistry setTour_id(String tour_id) {
        this.tour_id = tour_id;
        return this;
    }

    @Override
    public TourRegistry setNotes(String notes) {
        this.notes = notes;
        return this;
    }

    public TourRegistry setReviews(List<String> reviews) {
        this.reviews = reviews;
        return this;
    }

    private String tour_id;
    private ZTime accepted_time;
    private List<String> guides;
    private TourStatus tour_status;
    private String notes;
    private List<String> reviews;
    private ZTime started_at;
    private ZTime ended_at;
    private String classroom;
}
