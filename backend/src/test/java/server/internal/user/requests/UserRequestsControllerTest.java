package server.internal.user.requests;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import server.auth.JWTService;
import server.enums.RequestStatus;
import server.enums.RequestType;
import server.models.GuideAssignmentRequest;
import server.models.Request;
import server.models.people.details.ContactInfo;
import server.models.time.ZTime;

import java.time.ZonedDateTime;
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