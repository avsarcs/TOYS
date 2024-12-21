package server.models.DTO;

import com.google.common.util.concurrent.AtomicDouble;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import server.dbm.Database;
import server.enums.Department;
import server.enums.ExperienceLevel;
import server.enums.roles.ApplicantRole;
import server.enums.status.ApplicationStatus;
import server.enums.status.RequestStatus;
import server.enums.types.ApplicationType;
import server.enums.types.TourType;
import server.models.events.*;
import server.models.payment.FiscalState;
import server.models.payment.HourlyRate;
import server.models.people.Guide;
import server.models.people.GuideApplication;
import server.models.people.User;
import server.models.people.details.ContactInfo;
import server.models.people.details.PaymentInfo;
import server.models.people.details.Profile;
import server.models.people.details.Schedule;
import server.models.requests.AdvisorPromotionRequest;
import server.models.requests.GuideAssignmentRequest;
import server.models.requests.TourModificationRequest;
import server.models.review.EventReview;
import server.models.review.Review;
import server.models.review.ReviewRecord;
import server.models.schools.*;
import server.models.time.ZTime;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DTOFactory {

    @Autowired
    Database database;

    public Map<String, Object> highschool(Highschool highschool) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("id", highschool.getId());
        dto.put("name", highschool.getName());
        dto.put("location", highschool.getLocation());
        dto.put("priority", highschool.getPriority());

        return dto;
    }

    public Map<String, Object> highschool(HighschoolRecord highschool) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("id", highschool.getId());
        dto.put("name", highschool.getTitle());
        dto.put("city", highschool.getLocation());
        dto.put("priority", highschool.getPriority());
        dto.put("ranking", highschool.getRanking());

        return dto;
    }

    public Map<String, Object> highschoolNoLocation(HighschoolRecord highschool) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("id", highschool.getId());
        String title = highschool.getTitle();
        title = title.substring(0, title.indexOf("("));
        dto.put("name", title);
        dto.put("city", highschool.getLocation());
        dto.put("priority", highschool.getPriority());
        dto.put("ranking", highschool.getRanking());

        return dto;
    }
    public Highschool highschool(Map<String, Object> map) {
        Highschool highschool = new Highschool();

        highschool.setId((String) map.get("id"));
        highschool.setName((String) map.get("name"));
        highschool.setLocation((String) map.get("location"));
        highschool.setPriority((int) map.get("priority"));

        return highschool;
    }

    public Map<String, Object> highschool(String highschool_id) {
        HighschoolRecord highschool = database.schools.getHighschoolByID(highschool_id);
        if (highschool == null) {
            System.out.println("Highschool with id [" + highschool_id+ "] not found!");
            return Map.of();
        } else {
            return highschool(highschool);
        }
    }

    public Map<String, Object> university(University university) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("name", university.getName());
        dto.put("city", university.getCity());
        dto.put("is_rival", university.getIs_rival());
        dto.put("id", university.getId());

        return dto;
    }
     
    public Map<String, Object> simpleUniversity(University university) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("name", university.getName());
        dto.put("id", university.getId());

        return dto;
    }

    public String department(UniversityDepartment department) {
        String dto = department.getName();
        return dto;
    }

    public Map<String, Object> tourGuide(String guideID) {
        try {
            Guide guide = database.people.fetchGuides(guideID).get(0);
            return tourGuide(guide);
        } catch (Exception e) {
            System.out.println("Guide with id [" + guideID + "] not found!");
            return Map.of();
        }
    }

    public Map<String, Object> tourGuide(Guide guide) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("id", guide.getBilkent_id());
        dto.put("full_name", guide.getProfile().getName());
        dto.put("highschool", highschool(guide.getHigh_school()));

        return dto;
    }

    public Map<String, Object> tourApplicant(Applicant applicant) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("fullname", applicant.getName());
        dto.put("role", applicant.getRole().name());
        dto.put("email", applicant.getContact_info().getEmail());
        dto.put("phone", applicant.getContact_info().getPhone());
        dto.put("notes", applicant.getNotes());
        dto.put("highschool", highschool(applicant.getSchool()));

        return dto;
    }

    public Map<String, Object> eventInvitation(GuideAssignmentRequest request) {
        Map<String, Object> dto = new HashMap<>();

        String inviterName = database.people.fetchUser(request.getRequested_by().getBilkent_id()).getProfile().getName();

        dto.put("inviter", Map.of(
                "id", request.getRequested_by().getBilkent_id(),
                "name", inviterName
        ));

        String inviteeName = database.people.fetchUser(request.getGuide_id()).getProfile().getName();

        dto.put("invited", Map.of(
                "id", request.getGuide_id(),
                "name", inviteeName
        ));

        dto.put("event_id", request.getEvent_id());
        switch (request.getStatus()) {
            case APPROVED -> dto.put("status", "ACCEPTED");
            case REJECTED -> dto.put("status", "REJECTED");
            case PENDING -> dto.put("status", "WAITING_RESPONSE");
        }

        return dto;
    }

    public Applicant tourApplicant(Map<String, Object> map) {
        Applicant applicant = new Applicant();

        applicant.setName((String) map.get("fullname"));
        applicant.setRole(ApplicantRole.valueOf((String) map.get("role")));
        ContactInfo contactInfo = new ContactInfo();
        contactInfo.setEmail((String) map.get("email"));
        contactInfo.setPhone((String) map.get("phone"));
        contactInfo.setAddress("-");
        applicant.setContact_info(contactInfo);
        applicant.setNotes((String) map.get("notes"));

        // TODO
        // This is extremely important, as we use this value to fetch the highschool object in serialization
        applicant.setSchool((String) ((Map<String, Object>) map.get("highschool")).get("id"));
        return applicant;
    }

    public Map<String, Object> groupTour(TourRegistry tour) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("highschool", highschool(tour.getApplicant().getSchool()));
        List<Guide> guides = database.people.fetchGuides(null);

        dto.put("trainee_guides", guides.stream().filter(
                guide -> guide.getExperience().getExperienceLevel_level().equals(ExperienceLevel.TRAINEE)
        ).map(this::tourGuide).toList());

        dto.put("guides", guides.stream().filter(
                guide -> !guide.getExperience().getExperienceLevel_level().equals(ExperienceLevel.TRAINEE)
        ).filter( gid -> tour.getGuides().contains(gid.getBilkent_id()))
                .map(this::tourGuide).toList());

        dto.put("type", tour.getTour_type().name().toLowerCase());

        dto.put("requested_times", tour.getRequested_hours());
        dto.put("accepted_time", tour.getAccepted_time());
        dto.put("visitor_count", tour.getExpected_souls());
        dto.put("status", tour.getTourStatus().name());
        dto.put("notes", tour.getNotes());
        dto.put("applicant", tourApplicant(tour.getApplicant()));
        dto.put("actual_start_time", tour.getStarted_at());
        dto.put("actual_end_time", tour.getEnded_at());
        dto.put("classroom", tour.getClassroom());
        dto.put("tour_id", tour.getTour_id());

        return dto;
    }

    public Map<String, Object> groupTourApplication(TourApplication application) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("highschool", highschool(application.getApplicant().getSchool()));
        dto.put("requested_times", application.getRequested_hours());
        dto.put("visitor_count", application.getExpected_souls());
        dto.put("applicant", tourApplicant(application.getApplicant()));

        return dto;
    }

    public TourApplication groupTourApplication(Map<String, Object> map) {
        TourApplication application = new TourApplication();

        application.setApplicant(tourApplicant((Map<String, Object>) map.get("applicant")));
        application.setRequested_hours(((List<String>) map.get("requested_times")).stream().map(
                ZTime::new
        ).toList());
        application.setExpected_souls((int) map.get("visitor_count"));
        application.getApplicant().setSchool((String) ((Map<String, Object>) map.get("highschool")).get("id"));
        application.setType(ApplicationType.TOUR);
        application.setTour_type(TourType.GROUP);
        application.setNotes("-");
        application.setInterested_in(new ArrayList<>());
        application.setStatus(null);

        return application;
    }

    public TourApplication individualTourApplication(Map<String, Object> map) {
        TourApplication application = new TourApplication();

        application.setApplicant(tourApplicant((Map<String, Object>) map.get("applicant")));
        application.setRequested_hours(((List<String>) map.get("requested_times")).stream().map(
                ZTime::new
        ).toList());
        application.setExpected_souls((int) map.get("visitor_count"));
        application.getApplicant().setSchool((String) ((Map<String, Object>) map.get("highschool")).get("id"));
        application.setType(ApplicationType.TOUR);
        application.setTour_type(TourType.INDIVIDUAL);
        application.setNotes("-");
        application.setInterested_in(((List<String>) map.get("requested_majors")).stream().map(Department::valueOf).toList());
        application.setStatus(null);

        return application;
    }


    public Map<String, Object> individualTourApplication(TourApplication application) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("highschool", highschool(application.getApplicant().getSchool()));
        dto.put("requested_times", application.getRequested_hours());
        dto.put("requested_majors", application.getInterested_in());
        dto.put("visitor_count", application.getExpected_souls());
        dto.put("applicant", tourApplicant(application.getApplicant()));

        return dto;
    }

    public Map<String, Object> individualTour(TourRegistry tour) {
        Map<String, Object> dto = new HashMap<>();

        dto.putAll(groupTour(tour));
        dto.put("requested_majors", tour.getInterested_in());
        dto.remove("classroom");

        return dto;

    }

    public Map<String, Object> simpleEvent(TourRegistry tour) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("event_type", "TOUR");
        dto.put("event_id", tour.getTour_id());
        dto.put("highschool", highschool(tour.getApplicant().getSchool()));
        dto.put("accepted_time", tour.getAccepted_time());
        dto.put("requested_times", tour.getRequested_hours());
        dto.put("visitor_count", tour.getExpected_souls());
        dto.put("guides", tour.getGuides().stream().map(guideID -> tourGuide(guideID)).toList());
        dto.put("event_status", tour.getTourStatus().name());
        dto.put("event_subtype", tour.getTour_type().name());

        return dto;
    }

    public Map<String,Object> simpleEvent(TourApplication application, String id) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("event_type", "TOUR");
        dto.put("event_id", id);
        dto.put("highschool", highschool(application.getApplicant().getSchool()));
        dto.put("accepted_time", "");
        dto.put("requested_times", application.getRequested_hours());
        dto.put("visitor_count", application.getExpected_souls());
        dto.put("guides", List.of());
        dto.put("event_status", application.getStatus().name());
        dto.put("event_subtype", application.getTour_type());

        return dto;
    }

    public HourlyRate hourlyRate(Map<String, Object> dto) {
        HourlyRate rate = new HourlyRate();

        rate.setRate((double) dto.get("rate"));
        rate.setApplied_from(new ZTime((String) dto.get("applied_from")));
        rate.setApplied_until(new ZTime((String) dto.get("applied_until")));

        return rate;
    }

    public Map<String, Object> hourlyRate(HourlyRate rate) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("rate", rate.getRate());
        dto.put("applied_from", rate.getApplied_from());
        dto.put("applied_until", rate.getApplied_until());

        return dto;
    }

    public Map<String,Object> simpleEvent(TourModificationRequest request, String id) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("event_type", "TOUR");
        dto.put("event_id", id);
        dto.put("highschool", highschool(request.getModifications().getApplicant().getSchool()));
        dto.put("accepted_time", "");
        dto.put("requested_times", request.getModifications().getRequested_hours());
        dto.put("visitor_count", request.getModifications().getExpected_souls());
        dto.put("guides", List.of());
        dto.put("event_status", request.getModifications().getStatus().name());
        dto.put("event_subtype", request.getModifications().getTour_type());

        return dto;
    }

    public Map<String,Object> simpleEvent(FairApplication application, String id) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("event_type", "TOUR");
        dto.put("event_id", id);
        dto.put("highschool", highschool(application.getApplicant().getSchool()));
        dto.put("accepted_time", "");
        dto.put("requested_times", application.getStarts_at());
        dto.put("visitor_count", 0);
        dto.put("guides", List.of());
        dto.put("event_status", application.getStatus().name());
        dto.put("event_subtype", "FAIR");

        return dto;
    }


    public Map<String, Object> simpleEvent(FairRegistry tour) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("event_type", "FAIR");
        dto.put("event_id", tour.getFair_id());
        dto.put("highschool", highschool(tour.getApplicant().getSchool()));
        dto.put("accepted_time", tour.getStarts_at());
        dto.put("requested_times", List.of(tour.getStarts_at()));
        dto.put("visitor_count", 0);
        dto.put("guides", tour.getGuides().stream().map(guideID -> tourGuide(guideID)).toList());
        dto.put("event_status", tour.getFair_status().name());

        dto.put("event_subtype", "");

        return dto;
    }

    public GuideApplication traineeGuideApplication(Map<String, Object> map) {
        GuideApplication application = new GuideApplication();

        application.setApplicationReason((String) map.get("why_apply"));
        application.setStatus(null);
        application.setType(ApplicationType.GUIDE);
        application.setBilkent_id((String) map.get("id"));

        Profile profile = new Profile();
        profile.setName((String) map.get("fullname"));
        profile.setProfile_picture("");
        profile.setProfile_description(application.getApplicationReason());
        ContactInfo contactInfo = new ContactInfo();
        contactInfo.setEmail((String) map.get("email"));
        contactInfo.setPhone((String) map.get("phone"));
        contactInfo.setAddress("-");
        profile.setContact_info(contactInfo);

        profile.setSchedule(Schedule.getDefault());

        profile.setHighschool_id(highschool((Map<String, Object>) map.get("highschool")).getId());
        profile.setSemester((int) map.get("current_semester"));
        profile.setMajor(Department.valueOf((String) map.get("major")));
        profile.setPayment_info(new PaymentInfo().setIban(""));

        application.setProfile(profile);

        application.setFutureExchange((boolean) map.get("next_semester_exchange"));
        application.setHeardFrom((String) map.get("how_did_you_hear"));

        return application;
    }

    public Map<String, Object> simpleToysApplication(GuideApplication application) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("id",application.getBilkent_id());
        dto.put("fullname", application.getProfile().getName());
        Guide guide = null;
        try {
            guide = database.people.fetchGuides(application.getBilkent_id()).get(0);
        } catch (Exception e) {
            System.out.println("Guide with id" + application.getBilkent_id() + " not found");
        }
        dto.put("experience", guide.getExperience().getPrevious_events().size() + " events");

        return dto;
    }

    public Map<String, Object> advisorOffer(AdvisorPromotionRequest offer, String guideName) {
        Map<String, Object> dto = new HashMap<>();
        dto.put(
                "recipient",
                Map.of(
                        "id", offer.getGuide_id(),
                        "name", guideName
                )
        );

        dto.put("rejection_reason", offer.getRejection_reason());
        dto.put("status", offer.getStatus().name());
        dto.put("offer_date", offer.getRequested_at());
        dto.put("response_date", offer.getResponded_at());

        return dto;
    }

    public Map<String, Object> guide(Guide guide) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("experience", guide.getExperience().getPrevious_events().size() + " events");
        dto.put("id", guide.getBilkent_id());
        dto.put("fullname", guide.getProfile().getName());
        dto.put("phone", guide.getProfile().getContact_info().getPhone());
        dto.put("highschool", highschool(guide.getProfile().getHighschool_id()));
        dto.put("schedule", guide.getProfile().getSchedule());
        dto.put("iban", guide.getProfile().getPayment_info().getIban());
        dto.put("major", guide.getDepartment());
        dto.put("email", guide.getProfile().getContact_info().getEmail());

        Map<String, ReviewRecord> records = database.reviews.getReviewRecords();
        Map<String, Object> reviews = new HashMap<>();
        reviews.put("average", Double.valueOf("0"));
        reviews.put("count", 0);

        long count = 0;

        for (Map.Entry<String, ReviewRecord> record : records.entrySet()) {

            if (guide.getExperience().getPrevious_events().contains(record.getValue().getEvent_id())) {
                EventReview review = null;
                try {
                    review = database.reviews.getReview(record.getValue().getReview_id());
                } catch (Exception e) {
                    System.out.println("Review with id " + record.getValue().getReview_id() + " not found");
                }

                if (review != null) {
                    if (review.getGuide_reviews().containsKey(guide.getBilkent_id())) {
                        double score = review.getGuide_reviews().get(guide.getBilkent_id()).getScore();
                        reviews.put("average", (((double) reviews.get("average")) * count + score) / (count + 1));
                        count += 1;
                        reviews.put("count", count);
                    }
                }
            }

        }

        dto.put("reviews", reviews);
        dto.put("role", guide.getRole().name());
        dto.put("responsible_days", List.of());
        dto.put("profile_picture", guide.getProfile().getProfile_picture());
        dto.put("profile_description", guide.getProfile().getProfile_description());



        // TODO: this value is missing!
        dto.put("advisor_offer", false);
        dto.put("bank", "-");
        dto.put("created_at", null);
        dto.put("updated_at", null);

        return dto;
    }


    public Map<String, Object> simpleGuide(Guide guide) {
        Map<String,Object> dto = new HashMap<>();

        dto.put("id", guide.getBilkent_id());
        dto.put("name", guide.getProfile().getName());
        dto.put("major", guide.getDepartment());
        dto.put("experience", guide.getExperience().getPrevious_events().size() + " events");

        return dto;
    }

    public Map<String, Object> simpleGuide(String guide_id) {
        Guide guide = null;
        try {
            guide = database.people.fetchGuides(guide_id).get(0);
            return simpleGuide(guide);
        } catch (Exception e) {
            System.out.println("Guide with id "+ guide_id + " not found");
            return Map.of();
        }

    }

    public Map<String, Object> fair(FairRegistry fair) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("fair_id", fair.getFair_id());
        dto.put("applicant", tourApplicant(fair.getApplicant()));
        dto.put("start_time", fair.getStarts_at());
        dto.put("end_time", fair.getEnds_at());
        dto.put("fair_name", fair.getFair_name());
        dto.put("status", fair.getFair_status().name());

        return dto;
    }

    public Map<String, Object> fairApplication(FairApplication application) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("applicant", tourApplicant(application.getApplicant()));
        dto.put("start_time", application.getStarts_at());
        dto.put("end_time", application.getEnds_at());
        dto.put("fair_name", application.getFair_name());

        return dto;
    }


    public FairApplication fairApplication(Map<String, Object> dto) {
        FairApplication application = new FairApplication();

        application.setStatus(ApplicationStatus.RECEIVED);
        application.setType(ApplicationType.FAIR);
        application.setApplicant(tourApplicant((Map<String, Object>) dto.get("applicant")));
        application.setStarts_at(new ZTime((String) dto.get("start_time")));
        application.setEnds_at(new ZTime((String) dto.get("end_time")));
        application.setFair_name((String) dto.get("fair_name"));

        application.setNotes("-");

        return application;
    }

    public Map<String, Object> review(Review review) {
        Map<String, Object> dto = new HashMap<>();

        //dto.put("for", review.getType());
        // TODO : come back to this

        return dto;
    }

    public Map<String, Object> moneyForGuide(User user) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("guide", Map.of(
                "id", user.getBilkent_id(),
                "name", user.getProfile().getName(),
                "iban", user.getProfile().getPayment_info().getIban(),
                "bank", "N/A"

        ));
        dto.put("debt", user.getFiscalState().getOwed() - user.getFiscalState().getPaid());
        dto.put("money_paid", user.getFiscalState().getPaid());
        dto.put("unpaid_hours", "");

        return dto;
    }

    public Map<String, Object> moneyForEvent(FairRegistry fair, FiscalState fiscalState) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("event_type", "FAIR");

        dto.put("event_id", fair.getFair_id());
        dto.put("event_date", fair.getStarts_at());
        double rate = 0;
        try {
            rate = database.payments.getRates().stream()
                    .filter(hr -> hr.contains(fair.getStarts_at().getDate()))
                    .findFirst().get().getRate();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("There was an error when parsing the rate for a MoneyForTour DTO");
        }
        dto.put("hourly_rate", rate);
        double hoursWorked = 8;
        dto.put("hours_worked", hoursWorked);
        dto.put("money_debted", hoursWorked * rate);

        HighschoolRecord highschool_obj = new Highschool();

        try {
            highschool_obj = database.schools.getHighschoolByID(fair.getApplicant().getSchool());
        } catch (Exception E) {
            System.out.println("There was an error when parsing MoneyForEventModel when getting highschool");
        }
        dto.put("event_highschool", highschool(highschool_obj));

        AtomicDouble moneyPaid = new AtomicDouble(0);

        fiscalState.getPayments().stream().filter(
                payment -> payment.getEvent_id().equals(fair.getFair_id())
        ).forEach(
                payment -> moneyPaid.addAndGet(payment.getAmount())
        );

        dto.put("money_paid", moneyPaid.doubleValue());
        return dto;
    }

    public Map<String, Object> moneyForEvent(TourRegistry tour, FiscalState fiscalState) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("event_type", "TOUR");

        dto.put("event_id", tour.getTour_id());
        dto.put("event_date", tour.getStarted_at());
        double rate = 0;
        try {
            rate = database.payments.getRates().stream()
                            .filter(hr -> hr.contains(tour.getStarted_at().getDate()))
                            .findFirst().get().getRate();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("There was an error when parsing the rate for a MoneyForTour DTO");
        }
        dto.put("hourly_rate", rate);
        Duration difference = Duration.between(tour.getStarted_at().getDate(), tour.getEnded_at().getDate());
        double hoursWorked = difference.toMinutes()/60.0;
        dto.put("hours_worked", hoursWorked);
        dto.put("money_debted", hoursWorked * rate);

        AtomicDouble moneyPaid = new AtomicDouble(0);

        fiscalState.getPayments().stream().filter(
                payment -> payment.getEvent_id().equals(tour.getTour_id())
        ).forEach(
                payment -> moneyPaid.addAndGet(payment.getAmount())
        );

        HighschoolRecord highschool_obj = new Highschool();

        try {
            highschool_obj = database.schools.getHighschoolByID(tour.getApplicant().getSchool());
        } catch (Exception E) {
            System.out.println("There was an error when parsing MoneyForEventModel when getting highschool");
        }

        dto.put("event_highschool", highschool(highschool_obj));
        dto.put("money_paid", moneyPaid.doubleValue());
        return dto;
    }

    public Map<String, Object> tourToReview(TourRegistry tour, List<Guide> guides) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("tour_id", tour.getTour_id());
        dto.put("tour_date", tour.getAccepted_time());

        dto.put("guides", guides.stream().map(this::simpleGuide).toList());

        return dto;
    }

    public Map<String, Object> reviewOfTour(TourRegistry tour, EventReview review) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("for", "TOUR");
        dto.put("tour_id", tour.getTour_id());
        dto.put("tour_date", tour.getAccepted_time());
        dto.put("guides", tour.getGuides().stream().map(this::simpleGuide).toList());
        dto.put("score", review.getEvent_review().getScore());
        dto.put("body", review.getEvent_review().getBody());
        return dto;
    }

    public Map<String, Object> reviewOfGuide(Guide guide, TourRegistry tour, EventReview review) {
        Map<String, Object> dto = reviewOfTour(tour, review);
        dto.put("for", "GUIDE");
        dto.put("guide_id", guide.getBilkent_id());
        dto.put("guide_name", guide.getProfile().getName());

        dto.put("score", review.getGuide_reviews().get(guide.getBilkent_id()).getScore());
        dto.put("body", review.getGuide_reviews().get(guide.getBilkent_id()).getBody());
        return dto;
    }

    public EventReview reviewCreateModel(List<Map<String, Object>> reviews) {
        EventReview review = new EventReview();

        Map<String, Review> guide_reviews = new HashMap<>();
        for (Map<String, Object> r : reviews) {
            if (r.get("for").equals("GUIDE")) {
                guide_reviews.put((String) r.get("guide_id"), new Review().setScore((int) r.get("score")).setBody((String) r.get("body")));
            } else {
                review.setEvent_id((String) r.get("tour_id"));
                review.setEvent_review(new Review().setScore(((Number) r.get("score")).longValue()).setBody((String) r.get("body")));
            }
        }

        return review;
    }

}