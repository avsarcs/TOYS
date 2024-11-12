package apply;

import apply.fair.FairApplicationModel;
import apply.guide.GuideApplicationModel;
import apply.tour.TourApplicationModel;
import dbm.dbe;
import enums.status.TOUR_STATUS;
import mailService.MailServiceGateway;
import mailService.MailType;
import models.data.fairs.FairModel;
import models.data.guides.GuideModel;
import models.data.tours.TourModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ApplicationService {
    @Autowired
    private dbe db;

    @Autowired
    private MailServiceGateway mailServiceGateway;

    public void ApplytoBeGuide(GuideApplicationModel guideApplication) {
        // get application #
        // check if there is a user with the same id in the system
        if (db.fetchUser(guideApplication.getBilkent_id()) != null) {
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
        // if the application is valid,
        // Convert the application to a guideModel
        GuideModel guideModel = GuideModel.fromApplication(guideApplication);
        // save the guideModel to the database as a guide that is not approved yet (guide experience level)
        db.addUser(guideModel);

        mailServiceGateway.sendMail(guideApplication.getEmail(), MailType.GUIDE_APPLICATION_CONFIRMATION, Map.of("name", guideApplication.getFull_name()));

    }

    public HttpStatus ApplyForATour(TourApplicationModel tourApplication) {
        // TODO: complete the http status codes here, it is not significant currently
        // get application
        // check application validity
        if (tourApplication.isValid()) {
            // if valid, send email to the applicant notifying them of the application has been received
            // TODO: notify the applicant
        } else {
            // if invalid, send email to the applicant notifying them of invalidity
            // the application is not valid
            // TODO: notify the applicant
            return HttpStatus.OK; // WE do OK here because the response has been recieved properly
        }

        // check if there is a time - collision with another tour
        List<TourModel> tours = db.fetchTours().values().stream().toList();
        List<ZonedDateTime> requestedDates = new ArrayList<>(tourApplication.getRequested_dates());
        if (tours != null) {
            for (TourModel tour : tours) {
                if (tour.getAccepted_date() != null) {
                    for (ZonedDateTime requestedDate : requestedDates) {
                        if (requestedDate.isEqual(tour.getAccepted_date())) {
                            // this time does not work, remove it from the list
                            requestedDates.remove(requestedDate);
                            break;
                        }
                    }
                }
            }
        }

        TourModel tourModel = TourModel.fromApplication(tourApplication);

        if (requestedDates.isEmpty()) {
            // if there is a time collision, set tour status type to "CONFLICT"
            // all requested dates are already taken
            // set status to CONFLICT
            tourModel.setStatus(TOUR_STATUS.CONFLICT);
        } else {
            // if there is no conflict, set tour status type to "Awaiting confirmation"
            // set status to AWAITING_CONFIRMATION
            tourModel.setStatus(TOUR_STATUS.AWAITING_CONFIRMATION);
        }

        // save the application to the database
        db.addTour(tourModel);
        mailServiceGateway.sendMail(tourApplication.getApplicant().getEmail(), MailType.TOUR_APPLICATION_CONFIRMATION, Map.of("name", tourApplication.getApplicant().getName()));
        return HttpStatus.OK;
    }

    public HttpStatus applyForAFair(FairApplicationModel application) {
        // check if the application is valid
        if (!application.isValid()) {
            // the application is not valid
            return HttpStatus.BAD_REQUEST;
        }
        {
            // check if a copy of the fair exists within the system
            Map<String, FairModel> fairs = db.fetchFairs();
            if (fairs != null) {
                for (FairModel fair : fairs.values()) {
                    if (fair.getInvitation().getStart_time().isEqual(application.getStart_time())) {
                        if (fair.getInvitation().getHighschool_id().equals(application.getHighschool_id())) {
                            // if the fair exists, reject application
                            // the fair already exists
                            return HttpStatus.CONFLICT;
                        }
                    }
                }
            }
        }
        // if the fair does not exist, add the fair to the system
        if (db.addFair(FairModel.fromInvitation(application))) {
            mailServiceGateway.sendMail(application.getApplicant().getEmail(), MailType.FAIR_APPLICATION_CONFIRMATION, Map.of("name", application.getApplicant().getName()));
            return HttpStatus.OK;
        }
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
}
