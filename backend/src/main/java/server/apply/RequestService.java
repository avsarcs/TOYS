package server.apply;

import server.auth.Permission;
import server.auth.PermissionMap;
import server.auth.JWTService;
import server.dbm.Database;
import server.enums.RequestStatus;
import server.enums.RequestType;
import server.mailService.MailServiceGateway;
import server.models.GuideAssignmentRequest;
import server.models.Request;
import server.models.TourModificationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class RequestService {

    @Autowired
    Database db;

    @Autowired
    MailServiceGateway mailServiceGateway;

    public void addRequest(Request request) {
        // Check if a request exists already
        db.requests.getRequestsOfType(request.getType(), null).forEach(existingRequest -> {
            if (existingRequest instanceof TourModificationRequest) {
                TourModificationRequest existingModificationRequest = (TourModificationRequest) existingRequest;
                TourModificationRequest newModificationRequest = (TourModificationRequest) request;
                if (existingModificationRequest.getTour_id().equals(newModificationRequest.getTour_id())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "There is an existing request, regardless of who sent it, there is one!");
                }
            } else if (existingRequest instanceof GuideAssignmentRequest) {
               GuideAssignmentRequest existingAssignmentRequest = (GuideAssignmentRequest) existingRequest;
               GuideAssignmentRequest newAssignmentRequest = (GuideAssignmentRequest) request;
               boolean isSame = existingAssignmentRequest.getEvent_id().equals(newAssignmentRequest.getEvent_id());
               isSame = isSame && existingAssignmentRequest.getRequested_guide_id().equals(newAssignmentRequest.getRequested_guide_id());
               if (isSame) {
                   throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "There is an existing assignment request!");
               }
            } else {
                // TODO: complete withdrawal
            }
        });
        db.requests.addRequest(request);
    }

    public void respondToRequest(String auth, String request_id, String responseString) {
        if (!JWTService.getSimpleton().isValid(auth)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid token");
        }
        try {
            RequestStatus response = RequestStatus.valueOf(responseString);
            // fetch the request
            List<Request> requests = db.requests.getRequests(request_id);
            Request request = null;
            for (Request r : requests) {
                if (r.getRequest_id().equals(request_id)) {
                    request = r;
                    break;
                }
            }
            if (request == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request not found");
            }
            // check if the request is already responded
            if (request.getStatus() != RequestStatus.PENDING) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request already responded");
            }

            // modify the request
            request.setStatus(response);
            // save the request
            db.requests.updateRequest(request);

        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Invalid response");
        }

    }

    public List<Request> getRequests(String authToken) {
        // validate token
        if (!JWTService.getSimpleton().isValid(authToken)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid token");
        }
        // get user id from token
        String userId = JWTService.getSimpleton().decodeUserID(authToken);

        // fetch all requests from the database
        List<Request> requests = db.requests.getRequests(null);

        List<Request> relatedRequests = new ArrayList<>();
        // find all that relate to this user
        // TODO: go over this, see if it covers all cases. Göktuğ görmesin bunu, optimizasyon'dan canıma okur dskfm
        for (Request request : requests) {
            if (request instanceof TourModificationRequest) {
                if (PermissionMap.hasPermission(JWTService.getSimpleton().getUserRole(authToken), Permission.AR_TOUR_CHANGES)) {
                    relatedRequests.add(request);
                }
            } else if (request instanceof GuideAssignmentRequest) {
                if (((GuideAssignmentRequest) request).getRequested_guide_id().equals(userId)) {
                    relatedRequests.add(request);
                }
            }
        }
        // aggregate them & return
        return requests;
    }
}
