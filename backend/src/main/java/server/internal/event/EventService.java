package server.internal.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.*;
import server.dbm.Database;
import server.enums.roles.UserRole;
import server.enums.status.TourStatus;
import server.enums.types.ApplicationType;
import server.enums.types.TourType;
import server.mailService.MailServiceGateway;
import server.mailService.mailTypes.About;
import server.mailService.mailTypes.Concerning;
import server.mailService.mailTypes.Status;
import server.models.DTO.DTOFactory;
import server.models.DTO.DTO_IndividualTour;
import server.models.events.TourApplication;
import server.models.events.TourRegistry;
import server.models.payment.HourlyRate;
import server.models.people.Guide;
import server.models.people.User;
import server.models.review.ReviewRecord;
import server.models.review.ReviewResponse;
import server.models.time.ZTime;

import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.*;

@Service
public class EventService {


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
}
