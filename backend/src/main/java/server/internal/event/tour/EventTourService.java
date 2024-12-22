package server.internal.event.tour;

import info.debatty.java.stringsimilarity.SorensenDice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.AuthService;
import server.auth.JWTService;
import server.auth.Permission;
import server.dbm.Database;
import server.enums.ExperienceLevel;
import server.enums.roles.UserRole;
import server.enums.status.RequestStatus;
import server.enums.status.TourStatus;
import server.enums.types.ApplicationType;
import server.enums.types.TourType;
import server.mailService.MailServiceGateway;
import server.mailService.mailTypes.About;
import server.mailService.mailTypes.Concerning;
import server.mailService.mailTypes.Status;
import server.models.DTO.DTOFactory;
import server.models.events.TourApplication;
import server.models.events.TourRegistry;
import server.models.payment.HourlyRate;
import server.models.people.Guide;
import server.models.review.ReviewRecord;
import server.models.review.ReviewResponse;
import server.models.time.ZTime;

import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class EventTourService {
    @Autowired
    DTOFactory dto;

    @Autowired
    JWTService jwtService;

    @Autowired
    Database database;

    @Autowired
    AuthService authService;

    @Autowired
    MailServiceGateway mail;

    public Object getTour(String auth, String tid) {
        if (!authService.checkWithPasskey(auth, tid, Permission.VIEW_TOUR_INFO)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to view tour info!");
        }

        TourRegistry tour = database.tours.fetchTour(tid);

        if (tour == null) {
            try {
                TourApplication application = (TourApplication) database.applications.getAppicationsOfType(ApplicationType.TOUR).get(tid);
                tour = new TourRegistry(application);

                tour.setTour_id(tid);
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tour not found!");
            }
        }

        if (tour.getTour_type() == TourType.GROUP) {
            return dto.groupTour(tour);
        } else if (tour.getTour_type() == TourType.INDIVIDUAL) {
            return dto.individualTour(tour);
        }
        return null;
    }

    public Map<String, Object> getSimpleTour(String auth, String tid) {
        if (tid.isEmpty()) {
            tid = database.auth.getPasskeys().entrySet().stream().filter(e -> e.getValue().getKey().equals(auth)).findFirst().orElseThrow(
                    () -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Passkey not found!")
            ).getKey();
        }

        if (!authService.checkWithPasskey(auth, tid, Permission.VIEW_TOUR_INFO)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to view tour info!");
        }

        TourRegistry tour = database.tours.fetchTour(tid);

        if (tour == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tour not found, but it should have been because passkey is correct.");
        }

        return dto.simpleEvent(tour);
    }

    public void startTour(String auth, String tourID, String startTime) {
        if (!authService.check(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        TourRegistry tour = database.tours.fetchTour(tourID);
        if (tour == null) {
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "Tour not found!");
        }

        boolean isAdvisor = !JWTService.getSimpleton().getUserRole(auth).equals(UserRole.GUIDE);

        if (List.of(TourStatus.ONGOING, TourStatus.FINISHED).contains(tour.getTourStatus()) && !isAdvisor) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have the permission to do this!");
        } else if (!tour.getTourStatus().equals(TourStatus.CONFIRMED) && !isAdvisor) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tour is not confirmed!");
        }

        if (tour.getTourStatus().equals(TourStatus.CONFIRMED)) {
            tour.setTour_status(TourStatus.ONGOING);
        }
        if (startTime.isEmpty()) {
            tour.setStarted_at(new ZTime(ZonedDateTime.now()));
        } else {
            if (!authService.check(auth, Permission.EDIT_TOUR_SS_TIME)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to edit tour start time!");
            }
            tour.setStarted_at(new ZTime(startTime));
        }

        database.tours.updateTour(tour, tourID);
    }

    public void endTour(String auth, String tourID, String endTime) {
        if (!authService.check(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token");
        }

        TourRegistry tour = database.tours.fetchTour(tourID);
        if (tour == null) {
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "Tour not found!");
        }

        boolean isAdvisor = !JWTService.getSimpleton().getUserRole(auth).equals(UserRole.GUIDE);

        if (!tour.getTourStatus().equals(TourStatus.ONGOING) && !isAdvisor) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tour has not started, you cannot end it !");
        }

        tour.setTour_status(TourStatus.FINISHED);
        if (endTime.isEmpty()) {
            tour.setEnded_at(new ZTime(ZonedDateTime.now()));
        } else {
            if (!authService.check(auth, Permission.EDIT_TOUR_SS_TIME)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have permission to edit tour start time!");
            }
            tour.setEnded_at(new ZTime(endTime));
        }

        tour.getGuides().forEach(guideID -> {
            try {
                Guide guide = database.people.fetchGuides(guideID).get(0);
                List<String> previousEvents = new ArrayList<>();
                previousEvents.addAll(guide.getExperience().getPrevious_events());
                previousEvents.add(tourID);
                guide.getExperience().setPrevious_events(previousEvents);

                double previouslyOwed = guide.getFiscalState().getOwed();

                List<HourlyRate> rates = database.payments.getRates();
                double rate = 0;
                rate = rates.stream().filter( r -> r.contains(tour.getStarted_at().getDate())).findFirst().orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "No rate found for this tour!")
                ).getRate();

                double hoursWorked = Duration.between(tour.getStarted_at().getDate(), tour.getEnded_at().getDate()).toMinutes() / 60.0;
                guide.getFiscalState().setOwed(previouslyOwed + rate * hoursWorked);

                System.out.println("Guide " + guideID + " has worked for " + hoursWorked + " hours and is owed " + rate * hoursWorked + " TL more");

                database.people.updateUser(guide);
            } catch (Exception E) {
                System.out.println("One of the assigned guides for this tour could not be found! : " + guideID);
            }
        });

        database.tours.updateTour(tour, tourID);

        // Create review thingy
        Map<String, ReviewRecord> records = database.reviews.getReviewRecords();
        String key = UUID.randomUUID().toString();
        while (records.containsKey(key)) {
            key = UUID.randomUUID().toString();
        }

        records.put(key, new ReviewRecord().setReview_id("").setStatus(ReviewResponse.PENDING).setReview_id("").setEvent_id(tourID));

        System.out.println("Passkey is: "+ key);

        mail.sendMail(
                tour.getApplicant().getContact_info().getEmail(),
                Concerning.EVENT_APPLICANT,
                About.REVIEW,
                Status.PENDING,
                Map.of("passkey", key, "tour_id", tourID)
        );

        database.reviews.updateReviewRecords(records);
    }

    public List<Map<String, Object>> searchTours(
            String auth,
            String school_name,
            List<String> status,
            String from_date,
            String to_Date,
            boolean filter_guide_missing,
            boolean filter_trainee_missing,
            boolean am_enrolled,
            boolean am_invited
    ) {
        if (!authService.check(auth, Permission.VIEW_TOUR_INFO)){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not authorized to perform this action.!");
        }
        // extract user id from token
        String userId = JWTService.getSimpleton().decodeUserID(auth);


        UserRole userRole = JWTService.getSimpleton().getUserRole(auth);

        SorensenDice alg = new SorensenDice();

        List<Map<String, Object>> tours = database.tours
                .fetchTours()
                .values()
                .stream()
                .filter(
                        tour -> tour.getGuides().contains(userId) || !userRole.equals(UserRole.GUIDE)
                ).filter(
                        tour -> {
                            if (!school_name.isEmpty()) {
                                try {
                                    return alg.similarity(school_name.toLowerCase(), database.schools.getHighschoolByID(tour.getApplicant().getSchool()).getTitle().toLowerCase()) > 0.8;
                                } catch (Exception e) {
                                    return false;
                                }
                            } else {
                                return true;
                            }
                        }
                ).filter(
                        tour -> {

                            if (!status.isEmpty()) {
                                try {
                                    return status.stream().anyMatch(s -> s.equals(dto.simpleEvent(tour).get("event_status")));
                                } catch (Exception E) {
                                    // internal/tours status filtering
                                    return false;
                                }
                            }
                            return true;
                        }
                ).filter(
                        tour -> {
                            if (!from_date.isEmpty()) {
                                try {
                                    return tour.getAccepted_time().getDate().isAfter(ZonedDateTime.parse(from_date));
                                } catch (Exception e) {
                                    System.out.println("Error in from_date filter in /internal/tours");
                                    return false;
                                }
                            } else {
                                return true;
                            }
                        }
                ).filter(
                        tour -> {
                            if (!to_Date.isEmpty()) {
                                try {
                                    return tour.getAccepted_time().getDate().isBefore(ZonedDateTime.parse(to_Date));
                                } catch (Exception e) {
                                    System.out.println("Error in to_date filter in /internal/tours");
                                    return false;
                                }
                            } else {
                                return true;
                            }
                        }
                ).filter(
                        tour -> {
                            if (filter_guide_missing) {
                                return tour.getGuides().isEmpty();
                            } else {
                                return true;
                            }
                        }
                ).filter(
                        tour -> {
                            if (filter_trainee_missing) {
                                boolean resp = false;
                                try {
                                    for (String guid : tour.getGuides()) {
                                        resp = resp || database.people.fetchGuides(guid).get(0).getExperience().getExperienceLevel_level().equals(ExperienceLevel.TRAINEE);
                                    }
                                    return !resp;
                                } catch (Exception e) {
                                    System.out.println("Error in filter_trainee_missing filter in /internal/tours");
                                    return false;
                                }
                            } else {
                                return true;
                            }
                        }
                ).filter(
                        tour -> {
                            if (am_enrolled) {
                                return tour.getGuides().contains(userId);
                            } else {
                                return true;
                            }
                        }
                ).filter(
                        tour -> {
                            if (am_invited) {
                                return database.requests.getGuideAssignmentRequests().stream().anyMatch(
                                        req -> req.getGuide_id().equals(userId) && req.getEvent_id().equals(tour.getTour_id()) && req.getStatus().equals(RequestStatus.PENDING)
                                );
                            } else {
                                return true;
                            }
                        }
                )
                .sorted(
                        (t1, t2) -> {
                            if (t1.getTourStatus().equals(t2.getTourStatus())) {
                                return 0;
                            } else if (t1.getTourStatus().equals(TourStatus.ONGOING)) {
                                return -1;
                            } else if (t1.getTourStatus().equals(TourStatus.CONFIRMED)) {
                                if (t2.getTourStatus().equals(TourStatus.ONGOING)) {
                                    return 1;
                                } else {
                                    return -1;
                                }
                            } else if (
                                    t1.getTourStatus().equals(TourStatus.PENDING_MODIFICATION)) {
                                if (t2.getTourStatus().equals(TourStatus.ONGOING) || t2.getTourStatus().equals(TourStatus.CONFIRMED)) {
                                    return 1;
                                }
                                return -1;
                            } else {
                                return 0;
                            }
                        })
                .collect(ArrayList::new,
                        (list, tour) -> list.add(dto.simpleEvent(tour)),
                        ArrayList::addAll);

        // return tours
        return tours;
    }

}
