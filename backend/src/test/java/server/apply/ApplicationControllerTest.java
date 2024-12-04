package server.apply;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import server.dbm.Database;
import server.enums.ApplicationType;
import server.models.Application;
import server.models.DTO.DTO_GroupTourApplication;
import server.models.DTO.DTO_GuideApplication;
import server.models.DTO.DTO_IndividualTourApplication;
import server.models.GuideApplication;
import server.models.TourApplication;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@SpringBootTest
class ApplicationControllerTest {

    @Autowired
    ApplicationController applicationController;

    @Autowired
    Database databaseEngine;

    @Test
    void applyGuide() {
        applicationController.applyGuide(DTO_GuideApplication.getDefault());

        List<String> appliedIDs = databaseEngine.applications.getAppicationsOfType(ApplicationType.GUIDE).entrySet().stream().map(e -> DTO_GuideApplication.fromApplication((GuideApplication) e.getValue()).getId()).toList();

        assert (appliedIDs.contains(DTO_GuideApplication.getDefault().getId()));
    }

    @Test
    void applyTour() {
        applicationController.applyTour(DTO_GroupTourApplication.getDefault());
        Map<String, Application> applications = databaseEngine.applications.getAppicationsOfType(ApplicationType.TOUR);

        List<DTO_GroupTourApplication> dtoapplications = new ArrayList<>();

        for (Map.Entry<String, Application> entry : applications.entrySet()) {
            try {
                dtoapplications.add(DTO_GroupTourApplication.fromApplication((TourApplication) entry.getValue()));
            } catch (Exception e) {
                // TODO
                e.printStackTrace();
            }
        }

        boolean contains = false;
        for (DTO_GroupTourApplication application : dtoapplications) {
            if (!contains) {
                contains = application.isEqual(DTO_GroupTourApplication.getDefault());
            }
        }
        assert contains;
    }

    @Test
    void applyTourIndividual() {
        applicationController.applyTourIndividual(DTO_IndividualTourApplication.getDefault());
        List<DTO_IndividualTourApplication> applications = databaseEngine.applications.getAppicationsOfType(ApplicationType.TOUR).entrySet().stream().map(e -> DTO_IndividualTourApplication.fromApplication((TourApplication) e.getValue())).toList();
        boolean contains = false;
        for (DTO_IndividualTourApplication application : applications) {
            if (!contains) {
                contains = application.equals(DTO_IndividualTourApplication.getDefault());
            }
        }
        assert contains;
    }

    @Test
    void applyFair() {
    }

    @Test
    void requestChanges() {
    }
}