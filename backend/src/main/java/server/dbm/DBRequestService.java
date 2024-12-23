package server.dbm;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import server.enums.types.RequestType;
import server.models.requests.GuideAssignmentRequest;
import server.models.requests.Request;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.models.requests.TourModificationRequest;

import java.util.*;

@Service
public class DBRequestService {
    private Firestore firestore;
    private ObjectMapper mapper;

    public DBRequestService() {
        this.firestore = Database.getFirestoreDatabase();
        this.mapper = Database.getObjectMapper();
    }


    public void deleteRequest(Request request) {
        String document = request.getType().name().toLowerCase();
        DocumentReference reference = firestore.collection("requests").document(document);
        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get(document);
            data.remove(request.getRequest_id());

            ApiFuture<WriteResult> result = reference.set(
                    mapper.convertValue(
                            Collections.singletonMap(document, data),
                            new TypeReference<HashMap<String, Object>>() {
                            }));

            System.out.println("Request [" + request.getRequest_id() + "] deleted from database." + result.get().getUpdateTime());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to delete request from database.");
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete request from the database.");
        }
    }

    public boolean addRequest(Request request, boolean force) {
        String document = request.getType().name().toLowerCase();
        DocumentReference reference = firestore.collection("requests").document(document);
        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get(document);
            if (force) {
                data.put(
                        request.getRequest_id(),
                        mapper.convertValue(request, new TypeReference<HashMap<String, Object>>() {
                        }));
            } else {
                data.putIfAbsent(
                        request.getRequest_id(),
                        mapper.convertValue(request, new TypeReference<HashMap<String, Object>>() {
                        }));
            }

            ApiFuture<WriteResult> result = reference.set(
                    mapper.convertValue(
                            Collections.singletonMap(document, data),
                            new TypeReference<HashMap<String, Object>>() {
                            }));

            System.out.println("Request [" + request.getRequest_id() + "] added to database." + result.get().getUpdateTime());
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add request to database.");
            return false;
        }
    }
    public boolean addRequest(Request request) {
        String document = request.getType().name().toLowerCase();
        DocumentReference reference = firestore.collection("requests").document(document);
        try {
            Map<String, Object> data = new HashMap<>();
            try {
                data = (Map<String, Object>) reference.get().get().getData().get(document);
            } catch (Exception E) {

            }
            data.putIfAbsent(
                    request.getRequest_id(),
                    mapper.convertValue(request, new TypeReference<HashMap<String, Object>>() {
            }));

            ApiFuture<WriteResult> result = reference.set(
                    mapper.convertValue(
                            Collections.singletonMap(document, data),
                            new TypeReference<HashMap<String, Object>>() {
                            }));

            System.out.println("Request [" + request.getRequest_id() + "] added to database." + result.get().getUpdateTime());
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add request to database.");
            return false;
        }
    }
    public List<Request> getRequests(String request_id) {
        List<Request> requests = new ArrayList<Request>();
        try {
            for (RequestType type : RequestType.values()) {
                requests.addAll(getRequestsOfType(type, request_id));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch request from database.");
            return null;
        }
        return requests;
    }

    public List<TourModificationRequest> getTourModificationRequests() {
        List<TourModificationRequest> requests = new ArrayList<>();
        try {
            DocumentReference reference = firestore.collection("requests").document("tour_modification");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("tour_modification");

            for (Map.Entry<String, Object> entry : data.entrySet()) {
                try {
                    requests.add(TourModificationRequest.fromMap((Map<String, Object>) entry.getValue()));
                } catch (Exception e) {
                    e.printStackTrace();
                    System.out.println("Failed to fetch directors from database.");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch directors from database.");
        }
        return requests;
    }

    public List<GuideAssignmentRequest> getGuideAssignmentRequests() {
        List<GuideAssignmentRequest> requests = new ArrayList<>();
        try {
            DocumentReference reference = firestore.collection("requests").document("assignment");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("assignment");

            for (Map.Entry<String, Object> entry : data.entrySet()) {
                requests.add(GuideAssignmentRequest.fromMap((Map<String, Object>) entry.getValue()));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch directors from database.");
        }
        return requests;
    }

    @Deprecated
    public List<Request> getRequestsOfType(RequestType type, String request_id) {
        List<Request> requests = new ArrayList<Request>();
        try {
            DocumentReference reference = firestore.collection("requests").document(type.name().toLowerCase());

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get(type.name().toLowerCase());

            if (request_id == null) {
                for (Map.Entry<String, Object> entry : data.entrySet()) {
                    if (((Map<String,Object>) entry.getValue()).get("type").equals(type.name())) {
                        if (type == RequestType.TOUR_MODIFICATION) {
                            requests.add(TourModificationRequest.fromMap((Map<String, Object>) entry.getValue()));
                        } else if (type == RequestType.ASSIGNMENT) {
                            requests.add(GuideAssignmentRequest.fromMap((Map<String, Object>) entry.getValue()));
                        } else if (type == RequestType.WITHDRAWAL) {
                            // requests.add(WithdrawalRequest.fromMap((Map<String, Object>) entry.getValue()));
                        } else {
                            System.out.println("ELSED");
                            requests.add(Request.fromMap((Map<String, Object>) entry.getValue()));
                        }
                    }
                }
            } else {
                if (data.containsKey(request_id)) {
                    if (((Map<String,Object>)data.get(request_id)).get("type").equals(type.name())) {
                        if (type == RequestType.TOUR_MODIFICATION) {
                            requests.add(TourModificationRequest.fromMap((Map<String, Object>) data.get(request_id)));
                        } else if (type == RequestType.ASSIGNMENT) {
                            requests.add(GuideAssignmentRequest.fromMap((Map<String, Object>) data.get(request_id)));
                        } else if (type == RequestType.WITHDRAWAL) {
                            // requests.add(WithdrawalRequest.fromMap((Map<String, Object>) entry.getValue()));
                        } else {
                            requests.add(Request.fromMap((Map<String, Object>) data.get(request_id)));
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch directors from database.");
        }
        return requests;
    }

    public boolean updateRequest(Request request) {
        String document = request.getType().name().toLowerCase();

        DocumentReference reference = firestore.collection("requests").document(document);

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get(document);
            data.put(request.getRequest_id(), request);

            ApiFuture<WriteResult> result = reference.set(
                    mapper.convertValue(
                            Collections.singletonMap(document, data),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );
            System.out.println("Request [" + request.getRequest_id() + "]  updated. " + result.get().getUpdateTime());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to update the request.");
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update request in the database.");
        }
        return true;
    }
}
