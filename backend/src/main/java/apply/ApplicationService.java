package apply;

import apply.guide.GuideApplicationModel;
import apply.tour.TourApplicationModel;
import dbm.dbe;
import enums.status.TOUR_STATUS;
import models.data.guides.GuideModel;
import models.data.tours.TourModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;

@Service
public class ApplicationService {
    @Autowired
    private dbe db;

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

    }

    public void ApplyForATour(TourApplicationModel tourApplication) {
        // get application
        // check application validity
        if (tourApplication.isValid()) {
            // if valid, send email to the applicant notifying them of the application has been received
            // TODO: notify the applicant
        } else {
            // if invalid, send email to the applicant notifying them of invalidity
            // the application is not valid
            // TODO: notify the applicant
            return;
        }

        // check if there is a time - collision with another tour
        List<TourModel> tours = db.fetchTours();
        List<ZonedDateTime> requestedDates = tourApplication.getRequested_dates();
        if (tours != null) {
            for (TourModel tour : tours) {
                if (tour.getAccepted_date() != null) {
                    if (requestedDates.removeIf(requestedDate -> requestedDate.isEqual(tour.getAccepted_date()))) {
                        // this time does not work, remove it from the list
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
    }
}
