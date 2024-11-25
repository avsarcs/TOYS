package apply.tour.request_changes;

import auth.Permission;
import auth.PermissionMap;
import auth.services.JWTService;
import dbm.dbe;
import mailService.MailServiceGateway;
import mailService.MailType;
import models.data.tours.TourModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import respond.tours.AcceptDeny;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class RequestService {

    @Autowired
    dbe db;

    @Autowired
    MailServiceGateway mailServiceGateway;

    public void requestChanges(TourChangeRequestModel changeRequest) {
        // check if there is an existing request with the same id
        RequestBase existingRequest = db.fetchRequest(changeRequest.getId());
        if (existingRequest != null) {
            // if there is, throw an exception
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request already exists");
        }
        // assign a new id to the request, so that it is unique
        changeRequest.generateId();

        // otherwise, save the request to the database
        db.addRequest(changeRequest);

        for (TourModel tour : db.fetchTours().values()) {
            if (tour.getId().equals(changeRequest.getTour_id())) {
                mailServiceGateway.sendMail(tour.getApplication().getApplicant().getEmail(), MailType.TOUR_CHANGE, Map.of("tourModel", changeRequest.getRequestedChanges().toString()));
                break;
            }
        }
    }

    public void respondToRequest(String idt, String responseString) {
        try {
            AcceptDeny response = AcceptDeny.valueOf(responseString);
            // fetch the request
            RequestBase request = db.fetchRequest(idt);
            // modify the request
            request.accept_reject(response);
            // save the request
            db.updateRequest(request);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Invalid response");
        }

    }

    public void respondToChangesRequest(String id, String responseString) {
        try {
            AcceptDeny response = AcceptDeny.valueOf(responseString);

            // fetch the request from the database
            TourChangeRequestModel request = (TourChangeRequestModel) db.fetchRequest(id);

            // if the request does not exist, throw an exception
            if (request == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request not found");
            }

            // accept or reject the request
            request.accept_reject(response);

            // save the updated request to the database
            db.updateRequest(request);

            for (TourModel tour : db.fetchTours().values()) {
                if (tour.getId().equals(request.getTour_id())) {
                    MailType mailtype = response == AcceptDeny.ACCEPT ? MailType.TOUR_CHANGE_CONFIRMATION : MailType.TOUR_CHANGE_REJECTION;
                    mailServiceGateway.sendMail(tour.getApplication().getApplicant().getEmail(), mailtype , Map.of("tourModel", request.getRequestedChanges().toString()));
                    break;
                }
            }

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Something happened, I hope you are not debugging this cuz I'm not giving any details >:)");
        }
    }

    public List<RequestBase> getRequests(String authToken) {
        // validate token
        if (!JWTService.getSimpleton().isValid(authToken)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid token");
        }
        // get user id from token
        String userId = JWTService.getSimpleton().decodeUserID(authToken);

        // fetch all requests from the database
        List<RequestBase> requests = db.fetchRequests().values().stream().toList();

        List<RequestBase> relatedRequests = new ArrayList<>();
        // find all that relate to this user
        // TODO: go over this, see if it covers all cases. Göktuğ görmesin bunu, optimizasyon'dan canıma okur dskfm
        for (RequestBase request : requests) {
            if (request instanceof TourChangeRequestModel) {
                if (PermissionMap.hasPermission(JWTService.getSimpleton().getUserRole(authToken), Permission.AR_TOUR_CHANGES)) {
                    relatedRequests.add(request);
                }
            } else if (request instanceof GuideAssignmentRequestModel) {
                if (((GuideAssignmentRequestModel) request).getGuide_id().equals(userId)) {
                    relatedRequests.add(request);
                }
            } else if (request instanceof GuideFairInviteModel) {
                if (((GuideFairInviteModel) request).getGuide_id().equals(userId)) {
                    relatedRequests.add(request);
                }
            }
        }
        // aggregate them & retunr
        return requests;
    }
}
