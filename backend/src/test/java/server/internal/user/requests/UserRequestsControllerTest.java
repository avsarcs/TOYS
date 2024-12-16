package server.internal.user.requests;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import server.auth.JWTService;
import server.enums.status.RequestStatus;
import server.models.people.GuideAssignmentRequest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserRequestsControllerTest {

    @Autowired
    UserRequestsController userRequestsController;

    private void addRequest() {
        userRequestsController.requestService.addRequest(
                GuideAssignmentRequest.getDefault()
        );
    }

    @Test
    void internalUserRequests() {
        addRequest();
        assert userRequestsController.internalUserRequests(JWTService.testToken) != null;
        assert userRequestsController.internalUserRequests(JWTService.testToken).size() > 0;
    }

    @Test
    void respondToRequest() {
        addRequest();
        userRequestsController.respondToRequest(JWTService.testToken, GuideAssignmentRequest.getDefault().getRequest_id(), RequestStatus.APPROVED.name());
        List<GuideAssignmentRequest> requestList = userRequestsController.requestService.getRequests(JWTService.testToken).stream().filter(r -> r instanceof GuideAssignmentRequest).map(r -> (GuideAssignmentRequest) r).toList();
        assert requestList != null;
        assert requestList.size() > 0;
        for (GuideAssignmentRequest request : requestList) {
            if (request.getRequest_id().equals("-1")) {
                assertEquals(request.getStatus(), RequestStatus.APPROVED);
                break;
            }
        }
    }
}