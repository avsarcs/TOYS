package server.internal.management.people;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import server.auth.JWTService;
import server.enums.ApplicationStatus;
import server.models.Application;
import server.models.GuideApplication;
import server.models.people.Guide;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ManagementPeopleControllerTest {

    @Autowired
    ManagementPeopleController managementPeopleController;

    private void addAPerson() {
        managementPeopleController.internalManagementPeopleService.databaseEngine.people.addUser(Guide.getDefault());
    }

    private void applyToBeGuide() {
        managementPeopleController.internalManagementPeopleService.databaseEngine.applications.addApplication(
                GuideApplication.getDefault()
        );
    }

    @Test
    void getPeople() {
        addAPerson();
        assert managementPeopleController.getPeople(JWTService.testToken) != null;
        assert !managementPeopleController.getPeople(JWTService.testToken).isEmpty();
    }

    @Test
    void getApplications() {
        applyToBeGuide();
        assert managementPeopleController.getApplications(JWTService.testToken) != null;
        assert !managementPeopleController.getApplications(JWTService.testToken).isEmpty();
    }

    @Test
    void respondToApplication() {
        applyToBeGuide();
        Map<String, Application> applications = managementPeopleController.getApplications(JWTService.testToken);
        List<Long> appplicationIDs = applications.keySet().stream().map(e -> e.split("_")[1]).map(e -> Long.parseLong(e)).sorted().toList();
        String applicationId = "GUIDE_" + appplicationIDs.get(appplicationIDs.size() - 1);
        managementPeopleController.respondToApplication(JWTService.testToken, applicationId, "ACCEPTED");
        assert managementPeopleController.getApplications(JWTService.testToken).get(applicationId).getStatus().equals(ApplicationStatus.APPROVED);
    }

    @Test
    void inviteUser() {
    }

    @Test
    void fireUser() {
    }
}