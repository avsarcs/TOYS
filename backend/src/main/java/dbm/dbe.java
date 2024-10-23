package dbm;

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
import models.AdvisorModel;
import models.data.guides.GuideModel;
import models.data.tours.TourModel;
import org.springframework.stereotype.Service;

import com.google.firebase.FirebaseApp;

import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
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

    private GuideModel fetchGuide(String bilkentID) {
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

    public List<TourModel> fetchTours() {
        List<TourModel> tours = new ArrayList<TourModel>();
        try {
            DocumentReference reference = firestoreDatabase.collection("applications").document("tours");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("tours");

            for (Map.Entry<String, Object> entry : data.entrySet()) {
                tours.add(TourModel.fromMap((Map<String, Object>) entry.getValue()));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch tours from database.");
        }
        // TODO : obvious
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
}
