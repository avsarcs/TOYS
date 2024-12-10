package server.apply;

import server.auth.JWTService;
import server.dbm.Database;
import server.enums.status.ApplicationStatus;
import server.mailService.MailServiceGateway;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.mailService.mailTypes.About;
import server.mailService.mailTypes.Concerning;
import server.mailService.mailTypes.Status;
import server.models.events.FairApplication;
import server.models.events.FairRegistry;
import server.models.events.TourApplication;
import server.models.events.TourRegistry;
import server.models.people.GuideApplication;
import server.models.time.ZTime;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ApplicationService {
    @Autowired
    private Database db;

    @Autowired
    private MailServiceGateway mailServiceGateway;

    @Autowired
    private JWTService jwtService;

    public String getTourType(String tour_id) {
        TourRegistry tour = null;
        try {
            tour = db.tours.fetchTour(tour_id);
            return tour.getTour_type().name();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tour not found!");
        }
    }

    public boolean isFree(String starts, String ends) {
        ZTime start = new ZTime(starts);
        ZTime end = new ZTime(ends);

        List<TourRegistry> tours =  db.tours.fetchTours().values().stream().toList();
        return tours.stream().anyMatch(
                t -> ZTime.overlap(start, t.getAccepted_time(), end, t.getAccepted_time())
        );
    }

    public void applyToBeGuide(GuideApplication guideApplication) {
        // get application #
        // check if there is a user with the same id in the system
        if (db.people.fetchUser(guideApplication.getBilkent_id()) != null) {
            // A user exists with the same id
            return;
        }
        // if there is no user, continue
        // check if the application is valid
        if (!guideApplication.isValid()) {
            System.out.println("Invalid application");
            // the application is not valid
            return;
        }
        // save the guideModel to the database as a guide that is not approved yet (guide experience level)
        db.applications.addApplication(guideApplication);

        mailServiceGateway.sendMail(guideApplication.getProfile().getContact_info().getEmail(), Concerning.GUIDE, About.GUIDE_APPLICATION, Status.RECIEVED, Map.of("name", guideApplication.getProfile().getName()));

    }

    public HttpStatus applyForATour(TourApplication tourApplication) {
        // get application
        // check application validity
        if (tourApplication.isValid()) {
            // if valid, send email to the applicant notifying them of the application has been received
            // TODO: notify the applicant
        } else {
            // if invalid, send email to the applicant notifying them of invalidity
            // the application is not valid
            System.out.println("Invalid tour application!");
            mailServiceGateway.sendMail(tourApplication.getApplicant().getContact_info().getEmail(), Concerning.EVENT_APPLICANT, About.TOUR_APPLICATION, Status.ERROR, Map.of("name", tourApplication.getApplicant().getName()));
            return HttpStatus.OK; // WE do OK here because the response has been recieved properly, its just not valid
        }

        // check if there is a time - collision with another tour

        List<TourRegistry> tours = db.tours.fetchTours().values().stream().toList();
        System.out.println("Checking from " + tours.size() + " tours.");
        List<ZTime> requestedDates = new ArrayList<>(tourApplication.getRequested_hours());
        if (tours != null) {
            for (TourRegistry tour : tours) {
                if (tour.getAccepted_time() != null) {
                    for (ZTime requestedDate : requestedDates) {
                        if (requestedDate.equals(tour.getAccepted_time())) {
                            // this time does not work, remove it from the list
                            requestedDates.remove(requestedDate);
                            break;
                        }
                    }
                }
            }
        }


        if (requestedDates.isEmpty()) {
            // if there is a time collision, set tour status type to "CONFLICT"
            // all requested dates are already taken
            // set status to CONFLICT
            tourApplication.setStatus(ApplicationStatus.CONFILCT);
        } else {
            // if there is no conflict, set tour status type to "Recieved"
            tourApplication.setStatus(ApplicationStatus.RECIEVED);
        }

        // save the application to the database
        db.applications.addApplication(tourApplication);
        mailServiceGateway.sendMail(tourApplication.getApplicant().getContact_info().getEmail(), Concerning.EVENT_APPLICANT, About.TOUR_APPLICATION, Status.RECIEVED, Map.of("name", tourApplication.getApplicant().getName()));
        return HttpStatus.OK;
    }

    public void applyForAFair(FairApplication application) {
        // check if the application is valid
        if (!application.isValid()) {
            // the application is not valid
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid application");
        }
        {
            // check if a copy of the fair exists within the system
            Map<String, FairRegistry> fairs = db.fairs.fetchFairs();

            if (fairs != null) {
                for (FairRegistry fair : fairs.values()) {
                    boolean overlaps = ZTime.overlap(
                            application.getStarts_at(), application.getEnds_at(),
                            fair.getStarts_at(), fair.getEnds_at()
                    );
                    if (overlaps) {
                        if (fair.getApplicant().getSchool().equals(application.getApplicant().getSchool())) {
                            // if the fair exists, reject application
                            // the fair already exists, http OK is enough
                            return;
                        }
                    }
                }
            } else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not fetch fairs from the system");
            }
        }

        // if the fair does not exist, add the fair to the system
        if (db.applications.addApplication(application)) {
            mailServiceGateway.sendMail(
                    application.getApplicant().getContact_info().getEmail(),
                    Concerning.EVENT_APPLICANT,
                    About.FAIR_APPLICATION,
                    Status.RECIEVED,
                    Map.of("name", application.getApplicant().getName())
            );
            return;
        }
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not add fair to the system");
    }
}
