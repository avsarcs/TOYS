package server.models.DTO;

import server.dbm.Database;
import server.enums.Department;
import server.enums.ExperienceLevel;
import server.models.events.TourRegistry;
import server.models.people.Guide;
import server.models.time.ZTime;

import java.util.ArrayList;
import java.util.List;

public class DTO_IndividualTour {

    private DTO_Highschool highschool;
    private List<DTO_SimpleGuide> guides;
    private List<DTO_SimpleGuide> trainee_guides;
    private String type;
    private List<ZTime> requested_times;
    private List<Department> requested_majors;
    private ZTime accepted_time;
    private long visitor_count;
    private GroupTourStatus status;
    private String notes;
    private DTO_Applicant applicant;
    private ZTime actual_start_time;
    private ZTime actual_end_time;
    private String classroom;


    public static DTO_IndividualTour fromTourRegistry(TourRegistry tourRegistry) {
        DTO_IndividualTour dto = new DTO_IndividualTour();
        dto.setHighschool(new DTO_Highschool(tourRegistry.getApplicant().getSchool()));

        { //done in order to trick the garbage collector to get rid of the unneccessary objects
            List<DTO_SimpleGuide> trainee_guides = new ArrayList<>();
            for(String guide : tourRegistry.getGuides()) {
                try {
                    Guide g = Database.getInstance().people.fetchGuides(guide).get(0);
                    if(g.getExperience().getExperienceLevel_level() == ExperienceLevel.TRAINEE) {
                        trainee_guides.add(DTO_SimpleGuide.fromGuide(g));
                    }
                } catch (Exception e) {
                    System.out.println("Error in fetching guides") ;
                }
            }
            dto.setTrainee_guides(trainee_guides);
        }

        List<String> guideIDS = tourRegistry.getGuides();
        List<DTO_SimpleGuide> guides = new ArrayList<>();
        for (String guideID : guideIDS) {
            try {
                guides.add(DTO_SimpleGuide.fromGuide(Database.getInstance().people.fetchGuides(guideID).get(0)));
            } catch (Exception e) {
                System.out.println("Error in fetching guides") ;
            }
        }
        dto.setGuides(guides);
        dto.setType(tourRegistry.getType().name().toLowerCase());
        dto.setRequested_times(tourRegistry.getRequested_hours());
        dto.setAccepted_time(tourRegistry.getAccepted_time());
        dto.setVisitor_count(tourRegistry.getExpected_souls());

        dto.setStatus(GroupTourStatus.fromTourStatus(tourRegistry.getTourStatus()));
        dto.setNotes(tourRegistry.getNotes());
        dto.setApplicant(DTO_Applicant.fromApplicant(tourRegistry.getApplicant()));

        dto.setActual_start_time(tourRegistry.getStarted_at());
        dto.setActual_end_time(tourRegistry.getEnded_at());
        dto.setClassroom(tourRegistry.getClassroom());

        dto.setRequested_majors(tourRegistry.getInterested_in());

        return dto;
    }
    public DTO_Highschool getHighschool() {
        return highschool;
    }

    public DTO_IndividualTour setHighschool(DTO_Highschool highschool) {
        this.highschool = highschool;
        return this;
    }

    public List<DTO_SimpleGuide> getGuides() {
        return guides;
    }

    public DTO_IndividualTour setGuides(List<DTO_SimpleGuide> guides) {
        this.guides = guides;
        return this;
    }

    public List<DTO_SimpleGuide> getTrainee_guides() {
        return trainee_guides;
    }

    public DTO_IndividualTour setTrainee_guides(List<DTO_SimpleGuide> trainee_guides) {
        this.trainee_guides = trainee_guides;
        return this;
    }

    public String getType() {
        return type;
    }

    public DTO_IndividualTour setType(String type) {
        this.type = type;
        return this;
    }


    public List<Department> getRequested_majors() {
        return requested_majors;
    }

    public DTO_IndividualTour setRequested_majors(List<Department> requested_majors) {
        this.requested_majors = requested_majors;
        return this;
    }

    public ZTime getAccepted_time() {
        return accepted_time;
    }

    public DTO_IndividualTour setAccepted_time(ZTime accepted_time) {
        this.accepted_time = accepted_time;
        return this;
    }

    public long getVisitor_count() {
        return visitor_count;
    }

    public DTO_IndividualTour setVisitor_count(long visitor_count) {
        this.visitor_count = visitor_count;
        return this;
    }

    public GroupTourStatus getStatus() {
        return status;
    }

    public DTO_IndividualTour setStatus(GroupTourStatus status) {
        this.status = status;
        return this;
    }

    public String getNotes() {
        return notes;
    }

    public DTO_IndividualTour setNotes(String notes) {
        this.notes = notes;
        return this;
    }

    public DTO_Applicant getApplicant() {
        return applicant;
    }

    public DTO_IndividualTour setApplicant(DTO_Applicant applicant) {
        this.applicant = applicant;
        return this;
    }

    public List<ZTime> getRequested_times() {
        return requested_times;
    }

    public DTO_IndividualTour setRequested_times(List<ZTime> requested_times) {
        this.requested_times = requested_times;
        return this;
    }

    public ZTime getActual_start_time() {
        return actual_start_time;
    }

    public DTO_IndividualTour setActual_start_time(ZTime actual_start_time) {
        this.actual_start_time = actual_start_time;
        return this;
    }

    public ZTime getActual_end_time() {
        return actual_end_time;
    }

    public DTO_IndividualTour setActual_end_time(ZTime actual_end_time) {
        this.actual_end_time = actual_end_time;
        return this;
    }

    public String getClassroom() {
        return classroom;
    }

    public DTO_IndividualTour setClassroom(String classroom) {
        this.classroom = classroom;
        return this;
    }
}
