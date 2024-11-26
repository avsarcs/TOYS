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
                new GuideAssignmentRequest()
                        .setRequest_id("-1")
                        .setRequested_by(ContactInfo.getDefault())
                        .setType(RequestType.ASSIGNMENT)
                        .setNotes("test notes")
                        .setRequested_at(new ZTime(ZonedDateTime.now()))
                        .setStatus(RequestStatus.PENDING)
                        .setRequested_by(ContactInfo.getDefault())
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
        userRequestsController.respondToRequest(JWTService.testToken, "-1", RequestStatus.APPROVED.name());
        List<Request> requestList = userRequestsController.requestService.getRequests(JWTService.testToken);
        assert requestList != null;
        assert requestList.size() > 0;
        for (Request request : requestList) {
            if (request.getRequest_id().equals("-1")) {
                assertEquals(request.getStatus(), RequestStatus.APPROVED);
                break;
            }
        }
    }
}