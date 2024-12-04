package server.internal.user.tours;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import server.auth.JWTService;
import server.enums.RequestStatus;
import server.enums.RequestType;
import server.enums.status.TOUR_STATUS;
import server.models.GuideAssignmentRequest;
import server.models.Request;
import server.models.TourRegistry;
import server.models.people.Guide;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserToursControllerTest {

    private static String tourID = TourRegistry.getDefault().getTour_id();

    @Autowired
    UserToursController userToursController;

    private void updateTour() {
        userToursController.tourService.databaseEngine.tours.updateTour(TourRegistry.getDefault(), tourID);
    }
    private void enrollGuide() {
        userToursController.tourService.enrollGuideInTour(Guide.getDefault().getBilkent_id(), tourID);
    }

    @Test
    void getTours() {
        enrollGuide();
        assert userToursController.getTours(JWTService.testToken) != null;
        assert userToursController.getTours(JWTService.testToken).size() > 0;
    }

    @Test
    void updateTourStatus() {
        updateTour();
        enrollGuide();
        userToursController.updateTourStatus(tourID, TOUR_STATUS.ONGOING.name(), JWTService.testToken);
        List<TourRegistry> tours = userToursController.getTours(JWTService.testToken);
        assert tours != null;
        assert tours.size() > 0;
        assert tours.get(0).getTourStatus().equals(TOUR_STATUS.ONGOING);
    }

    @Test
    void enrollInTour() {
        userToursController.enrollInTour(tourID, JWTService.testToken);
        List<TourRegistry> tours = userToursController.getTours(JWTService.testToken);
        assert tours != null;
        assert tours.size() > 0;
        assert tours.stream().map(e -> e.getTour_id()).toList().contains(tourID);
    }

    @Test
    void withdrawFromTour() {
        enrollGuide();
        userToursController.withdrawFromTour(tourID, JWTService.testToken);
        List<TourRegistry> tours = userToursController.getTours(JWTService.testToken).stream().filter(t -> t.getGuides().contains(Guide.getDefault().getBilkent_id())).toList();
        assert tours != null;
        assert !tours.stream().map(e -> e.getTour_id()).toList().contains(tourID);
    }

    @Test
    void inviteToTour() {
        updateTour();
        userToursController.inviteToTour(tourID, Guide.getDefault().getBilkent_id(), JWTService.testToken);
        boolean contains = false;
        List<GuideAssignmentRequest> requests = userToursController.
                tourService
                .databaseEngine
                .requests
                .getRequestsOfType(
                        RequestType.ASSIGNMENT,
                        null)
                .stream()
                .filter(
                        r -> r instanceof GuideAssignmentRequest
                ).map(
                        r -> (GuideAssignmentRequest) r
                ).toList();
        for (GuideAssignmentRequest request : requests) {
            try {
                if (request.getEvent_id().equals(tourID) && request.getRequested_guide_id().equals(Guide.getDefault().getBilkent_id())) {
                    contains = true;
                    break;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        assert contains;
    }

    @Test
    void respondToTourInvite() {
        inviteToTour();
        List<GuideAssignmentRequest> requests = userToursController.tourService.databaseEngine.requests.getRequestsOfType(RequestType.ASSIGNMENT, null).stream().filter(r -> r instanceof GuideAssignmentRequest).map(r -> (GuideAssignmentRequest) r).toList();
        String request_id = null;
        for (GuideAssignmentRequest request : requests) {
            try {
                if (request.getEvent_id().equals(tourID) && request.getRequested_guide_id().equals(Guide.getDefault().getBilkent_id())) {
                    request_id = request.getRequest_id();
                    break;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        System.out.println("Request ID is: " + request_id);
        assert request_id != null;
        userToursController.respondToTourInvite(request_id, RequestStatus.APPROVED.name(), JWTService.testToken);
    }
}