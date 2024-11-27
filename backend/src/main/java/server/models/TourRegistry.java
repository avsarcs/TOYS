package server.models;

import server.enums.ApplicationStatus;
import server.enums.ApplicationType;
import server.enums.TourType;
import server.enums.status.TOUR_STATUS;
import server.models.DTO.DTO_GroupTour;
import server.models.DTO.DTO_IndividualTour;
import server.models.DTO.DTO_SimpleGuide;
import server.models.DTO.GroupTourStatus;
import server.models.time.ZTime;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class TourRegistry extends TourApplication{
    public TourRegistry() {
        super();
        tour_id = "tour_" + System.currentTimeMillis();
    }

    public TourRegistry(TourApplication application) {
        super(application);
        tour_id = "tour_" + System.currentTimeMillis();
    }

    protected TourRegistry(Map<String,Object> map) {
        super(map);
        this.accepted_time = new ZTime(ZonedDateTime.parse((String) map.get("accepted_time")));
        this.guides = (List<String>) map.get("guides");
        this.tour_status = TOUR_STATUS.valueOf((String) map.get("status"));
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

    public static TourRegistry fromDTO(DTO_GroupTour dto) {
        TourRegistry tour = new TourRegistry();
        tour.setApplicant(Applicant.fromDTO(dto.getApplicant(), dto.getHighschool().getName()));
        tour.setRequested_hours(dto.getRequested_times());
        tour.setExpected_souls(dto.getVisitor_count());
        tour.setNotes(dto.getNotes());
        tour.setTour_type(TourType.Group);
        tour.setInterested_in(new ArrayList<>());
        if (dto.getStatus() == GroupTourStatus.REJECTED) {
            tour.setStatus(ApplicationStatus.REJECTED);
        } else if (dto.getStatus() == GroupTourStatus.AWAITING_CONFIRMATION){
            tour.setStatus(ApplicationStatus.RECIEVED);
        } else {
            tour.setStatus(ApplicationStatus.APPROVED);
        }

        try {
            tour.setTour_status(TOUR_STATUS.valueOf(dto.getStatus().name()));
        } catch (Exception e) {
            System.out.println("Error in setting tour status, defaulting to CONFIRMED");
            tour.setTour_status(TOUR_STATUS.CONFIRMED);
        }

        tour.setClassroom(dto.getClassroom());
        tour.setEnded_at(dto.getActual_end_time());
        tour.setStarted_at(dto.getActual_start_time());
        tour.setType(ApplicationType.TOUR);

        List<DTO_SimpleGuide> guides = dto.getGuides();
        guides.addAll(dto.getTrainee_guides());
        tour.setGuides(guides.stream().map(DTO_SimpleGuide::getId).toList());
        return tour;
    }

    public static TourRegistry fromDTO(DTO_IndividualTour dto) {
        TourRegistry tour = new TourRegistry();
        tour.setApplicant(Applicant.fromDTO(dto.getApplicant(), dto.getHighschool().getName()));
        tour.setRequested_hours(dto.getRequested_times());
        tour.setExpected_souls(dto.getVisitor_count());
        tour.setNotes(dto.getNotes());
        tour.setTour_type(TourType.Group);
        tour.setInterested_in(dto.getRequested_majors());
        if (dto.getStatus() == GroupTourStatus.REJECTED) {
            tour.setStatus(ApplicationStatus.REJECTED);
        } else if (dto.getStatus() == GroupTourStatus.AWAITING_CONFIRMATION){
            tour.setStatus(ApplicationStatus.RECIEVED);
        } else {
            tour.setStatus(ApplicationStatus.APPROVED);
        }

        try {
            tour.setTour_status(TOUR_STATUS.valueOf(dto.getStatus().name()));
        } catch (Exception e) {
            System.out.println("Error in setting tour status, defaulting to CONFIRMED");
            tour.setTour_status(TOUR_STATUS.CONFIRMED);
        }

        tour.setClassroom(dto.getClassroom());
        tour.setEnded_at(dto.getActual_end_time());
        tour.setStarted_at(dto.getActual_start_time());
        tour.setType(ApplicationType.TOUR);

        return tour;
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


    public TOUR_STATUS getTourStatus() {
        return tour_status;
    }

    @Override
    public String getNotes() {
        return notes;
    }

    public List<String> getReviews() {
        return reviews;
    }



    public TourRegistry setTour_status(TOUR_STATUS tour_status) {
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



    private String tour_id;
    private ZTime accepted_time;
    private List<String> guides;
    private TOUR_STATUS tour_status;
    private String notes;
    private List<String> reviews;
    private ZTime started_at;
    private ZTime ended_at;
    private String classroom;
}