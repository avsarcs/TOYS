package apply;

import apply.guide.GuideApplicationModel;
import dbm.dbe;
import models.data.guides.GuideModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
            // the application is not valid
            return;
        }
        // if the application is valid,
        // Convert the application to a guideModel
        GuideModel guideModel = GuideModel.fromApplication(guideApplication);
        // save the guideModel to the database as a guide that is not approved yet (guide experience level)
        db.addUser(guideModel);

    }
}
