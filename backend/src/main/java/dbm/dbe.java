package dbm;

import apply.tour.request_changes.GuideAssignmentRequestModel;
import apply.tour.request_changes.GuideFairInviteModel;
import apply.tour.request_changes.RequestBase;
import apply.tour.request_changes.TourChangeRequestModel;
import auth.UserModel;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import internal.user.profile.ProfileModel;
import models.AdvisorModel;
import models.data.fairs.FairModel;
import models.data.guides.GuideModel;
import models.data.tours.TourModel;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.google.firebase.FirebaseApp;
import org.springframework.web.server.ResponseStatusException;

import java.io.InputStream;
import java.util.*;

@Service
public class dbe {

    private static Firestore firestoreDatabase;

    private static final String credentialsFile = "toys-bilkent-67ba3be94a67.json";

    private ObjectMapper objectMapper;

    public dbe() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        if (this.firestoreDatabase == null) {
            try {
                InputStream serviceAccountFile = getCredentials(credentialsFile);

                GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccountFile);

                FirebaseOptions options = new FirebaseOptions.Builder()
                        .setCredentials(credentials)
                        .build();

                FirebaseApp.initializeApp(options);

                firestoreDatabase = FirestoreClient.getFirestore();



                System.out.println("initialized firestore database.");

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }



    private InputStream getCredentials(String credentialsFile) {
        ClassLoader classLoader = dbe.class.getClassLoader();

        InputStream inputStream = classLoader.getResourceAsStream(credentialsFile);

        if (inputStream == null) {
            throw new IllegalArgumentException("File not found! " + credentialsFile);
        }
        return inputStream;
    }

    public UserModel fetchUser(String bilkentID) {
        UserModel user = fetchGuide(bilkentID);
        if (user == null) {
            user = fetchAdvisor(bilkentID);
        }
        if (user == null){
            System.out.println("user null");
        }
        return user;
    }

    public GuideModel fetchGuide(String bilkentID) {
        DocumentReference reference = firestoreDatabase.collection("users").document("guides");

        try {

            Map<String, Object> data = (Map<String, Object>) reference.get().get().get("guides");
            if (data.containsKey(bilkentID)) {
                return GuideModel.fromMap((Map<String, Object>) data.get(bilkentID));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to check if user exists in database.");
            return null;
        }

        return null;
    }

    private AdvisorModel fetchAdvisor(String bilkentID) {
        DocumentReference reference = firestoreDatabase.collection("users").document("advisors");

        try {

            Map<String, Object> data = (Map<String, Object>) reference.get().get().get("advisors");
            if (data.containsKey(bilkentID)) {
                return (AdvisorModel) data.get(bilkentID);
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to check if user exists in database.");
            return null;
        }

        return null;
    }

    // TODO: add fetch advisor and coordinator

    private boolean addGuide(GuideModel guide) {
        DocumentReference reference = firestoreDatabase.collection("users").document("guides");

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("guides");
            data.putIfAbsent(guide.getBilkentID(), guide);

            ApiFuture<WriteResult> result = reference.set(objectMapper.convertValue(Collections.singletonMap("guides", data), new TypeReference<HashMap<String, Object>>() {
            }));

            System.out.println("user added to database." + result.get().getUpdateTime());
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add user to database.");
            return false;
        }
    }

    public boolean addAdvisor(AdvisorModel advisor) {
        DocumentReference reference = firestoreDatabase.collection("users").document("advisors");

        try {
            // TODO: fix
            ApiFuture<WriteResult> result = reference.set(advisor);

            System.out.println("user added to database." + result.get().getUpdateTime());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add user to database.");
            return false;
        }
        return false;
    }

    public boolean addUser(UserModel user) {

        if (user instanceof GuideModel) {
            return addGuide((GuideModel) user);
        } else if (user instanceof AdvisorModel) {
            return addAdvisor((AdvisorModel) user);
        }

        return false;
    }

    public TourModel fetchTour (String tid) {
        try {
            DocumentReference reference = firestoreDatabase.collection("applications").document("tours");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("tours");

            return TourModel.fromMap((Map<String, Object>) data.get(tid));

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch tours from database.");
        }
        return null;
    }
    public Map<String,TourModel> fetchTours() {
        Map<String, TourModel> tours = new HashMap<String, TourModel>();
        try {
            DocumentReference reference = firestoreDatabase.collection("applications").document("tours");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("tours");

            for (Map.Entry<String, Object> entry : data.entrySet()) {
                tours.putIfAbsent(entry.getKey(), TourModel.fromMap((Map<String, Object>) entry.getValue()));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch tours from database.");
        }
        return tours;
    }

    public boolean addTour(TourModel tour) {
        DocumentReference reference = firestoreDatabase.collection("applications").document("tours");

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("tours");
            data.putIfAbsent(tour.getId(), tour);


            ApiFuture<WriteResult> result = reference.set(
                    objectMapper.convertValue(
                            Collections.singletonMap("tours", data),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );
            System.out.println("tour added to database." + result.get().getUpdateTime());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add tour to database.");
            return false;
        }
        return true;
    }

    public boolean updateTour(TourModel tour, String tourId) {
        DocumentReference reference = firestoreDatabase.collection("applications").document("tours");

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("tours");
            data.put(tourId, tour);

            ApiFuture<WriteResult> result = reference.set(
                    objectMapper.convertValue(
                            Collections.singletonMap("tours", data),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );
            System.out.println("tour [" + tourId + "] updated in database." + result.get().getUpdateTime());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to update tour in database.");
            return false;
        }
        return true;
    }

    public boolean addFair(FairModel fair) {
        DocumentReference reference = firestoreDatabase.collection("applications").document("fairs");

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("fairs");
            data.putIfAbsent(fair.getId(), fair);


            ApiFuture<WriteResult> result = reference.set(
                    objectMapper.convertValue(
                            Collections.singletonMap("fairs", data),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );
            System.out.println("fair [" + fair.getId() + "]  added to database." + result.get().getUpdateTime());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add fair to database.");
            return false;
        }
        return true;
    }

    public boolean updateFair(FairModel fair, String fairID) {
        DocumentReference reference = firestoreDatabase.collection("applications").document("fairs");

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("fairs");
            data.put(fairID, fair);

            ApiFuture<WriteResult> result = reference.set(
                    objectMapper.convertValue(
                            Collections.singletonMap("fairs", data),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );
            System.out.println("fair [" + fairID + "] updated in database." + result.get().getUpdateTime());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to update fair in database.");
            return false;
        }
        return true;
    }

    public Map<String,FairModel> fetchFairs() {
        Map<String, FairModel> fairs = new HashMap<String, FairModel>();
        try {
            DocumentReference reference = firestoreDatabase.collection("applications").document("fairs");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("fairs");

            for (Map.Entry<String, Object> entry : data.entrySet()) {
                fairs.putIfAbsent(entry.getKey(), FairModel.fromMap((Map<String, Object>) entry.getValue()));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch fairs from database.");
        }
        return fairs;
    }


    public Map<String, ProfileModel> fetchProfiles() {
        Map<String, ProfileModel> profiles = new HashMap<String, ProfileModel>();
        try {
            DocumentReference reference = firestoreDatabase.collection("users").document("profiles");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("profiles");

            for (Map.Entry<String, Object> entry : data.entrySet()) {
                profiles.putIfAbsent(entry.getKey(), ProfileModel.fromMap((Map<String, Object>) entry.getValue()));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch profiles from database.");
        }
        return profiles;
    }

    public ProfileModel fetchProfile(String bilkentID) {
        DocumentReference reference = firestoreDatabase.collection("users").document("profiles");

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("profiles");
            if (data.containsKey(bilkentID)) {
                return ProfileModel.fromMap((Map<String, Object>) data.get(bilkentID));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to check if profile exists in database.");
            return null;
        }

        System.out.println("Profile does not exist in the database");
        return null;
    }

    public boolean addProfile(ProfileModel profile) {
        DocumentReference reference = firestoreDatabase.collection("users").document("profiles");

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("profiles");
            data.putIfAbsent(profile.getId(), profile);

            ApiFuture<WriteResult> result = reference.set(objectMapper.convertValue(Collections.singletonMap("profiles", data), new TypeReference<HashMap<String, Object>>() {
            }));

            System.out.println("profile added to database." + result.get().getUpdateTime());
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add profile to database.");
            return false;
        }
    }

    public boolean updateProfile(ProfileModel profile) {
        DocumentReference reference = firestoreDatabase.collection("users").document("profiles");

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("profiles");
            data.put(profile.getId(), profile);

            ApiFuture<WriteResult> result = reference.set(
                    objectMapper.convertValue(
                            Collections.singletonMap("profiles", data),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );
            System.out.println("profile [" + profile.getId() + "] updated in database." + result.get().getUpdateTime());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to update profile in database.");
            return false;
        }
        return true;
    }

    public RequestBase fetchRequest(String requestId) {
        RequestBase request = fetchTourChangeRequest(requestId);
        if (request == null) {
            request = fetchGuideAssignmentRequest(requestId);
        }
        if (request == null) {
            request = fetchGuideFairInvite(requestId);
        }
        return request;
    }

    private TourChangeRequestModel fetchTourChangeRequest(String requestId) {
        DocumentReference reference = firestoreDatabase.collection("requests").document("tour_change_requests");

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("tour_change_requests");
            if (data.containsKey(requestId)) {
                return TourChangeRequestModel.fromMap((Map<String, Object>) data.get(requestId));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to check if request exists in database.");
            return null;
        }

        System.out.println("Request does not exist in the database");
        return null;
    }

    private GuideAssignmentRequestModel fetchGuideAssignmentRequest(String requestId) {
        DocumentReference reference = firestoreDatabase.collection("requests").document("guide_assign_requests");

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("guide_assign_requests");
            if (data.containsKey(requestId)) {
                return GuideAssignmentRequestModel.fromMap((Map<String, Object>) data.get(requestId));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to check if request exists in database.");
            return null;
        }

        System.out.println("Request does not exist in the database");
        return null;
    }

    private GuideFairInviteModel fetchGuideFairInvite(String requestId) {
        DocumentReference reference = firestoreDatabase.collection("requests").document("guide_fair_invites");

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("guide_fair_invites");
            if (data.containsKey(requestId)) {
                return GuideFairInviteModel.fromMap((Map<String, Object>) data.get(requestId));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to check if request exists in database.");
            return null;
        }

        System.out.println("Request does not exist in the database");
        return null;
    }

    public boolean addRequest(RequestBase request) {
        String collection = "";
        if (request instanceof TourChangeRequestModel) {
            collection = "tour_change_requests";
        } else if (request instanceof GuideAssignmentRequestModel) {
            collection = "guide_assign_requests";
        } else if (request instanceof GuideFairInviteModel) {
            collection = "guide_fair_invites";
        }

        DocumentReference reference = firestoreDatabase.collection("requests").document(collection);

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get(collection);
            data.putIfAbsent(request.getId(), request);

            ApiFuture<WriteResult> result = reference.set(
                    objectMapper.convertValue(
                            Collections.singletonMap(collection, data),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );
            System.out.println("Request [" + request.getId() + "]  added to the database." + result.get().getUpdateTime());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add request to the db.");
            return false;
        }
        return true;
    }

    public boolean updateRequest(RequestBase request) {
        String collection = "";
        if (request instanceof TourChangeRequestModel) {
            collection = "tour_change_requests";
        } else if (request instanceof GuideAssignmentRequestModel) {
            collection = "guide_assign_requests";
        } else if (request instanceof GuideFairInviteModel) {
            collection = "guide_fair_invites";
        }

        DocumentReference reference = firestoreDatabase.collection("requests").document(collection);

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get(collection);
            data.put(request.getId(), request);

            ApiFuture<WriteResult> result = reference.set(
                    objectMapper.convertValue(
                            Collections.singletonMap(collection, data),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );
            System.out.println("Request [" + request.getId() + "]  added to the database." + result.get().getUpdateTime());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add request to the db.");
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update request in the database.");
        }
        return true;
    }

    public Map<String, RequestBase> fetchRequests() {
        Map<String, RequestBase> requests = new HashMap<String, RequestBase>();
        String[] collections = {"tour_change_requests", "guide_assign_requests", "guide_fair_invites"};
        for (String collection : collections) {

            try {
                DocumentReference reference = firestoreDatabase.collection("requests").document(collection);

                Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get(collection);

                for (Map.Entry<String, Object> entry : data.entrySet()) {
                    // Ugly yes, but is it inefficient? no, sadly no
                    if (collection.equals("tour_change_requests")) {
                        requests.putIfAbsent(entry.getKey(), TourChangeRequestModel.fromMap((Map<String, Object>) entry.getValue()));
                    } else if (collection.equals("guide_assign_requests")) {
                        requests.putIfAbsent(entry.getKey(), GuideAssignmentRequestModel.fromMap((Map<String, Object>) entry.getValue()));
                    } else if (collection.equals("guide_fair_invites")) {
                        requests.putIfAbsent(entry.getKey(), GuideFairInviteModel.fromMap((Map<String, Object>) entry.getValue()));
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("Failed to fetch fairs from database.");
            }
        }
        return requests;
    }
}
