package server.dbm;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import org.checkerframework.checker.units.qual.A;
import server.auth.Passkey;
import server.enums.status.ApplicationStatus;
import server.enums.types.ApplicationType;
import org.springframework.stereotype.Service;
import server.models.Application;
import server.models.events.FairApplication;
import server.models.people.GuideApplication;
import server.models.events.TourApplication;
import server.models.time.ZTime;

import java.util.*;

@Service
public class DBApplicationService {
    private final Firestore firestore;
    private final ObjectMapper mapper;

    public DBApplicationService() {
        this.firestore = Database.getFirestoreDatabase();
        this.mapper = Database.getObjectMapper();
    }

    public void addApplication(Application application) {

        String document = "";
        document = application instanceof GuideApplication ?  "guides" : document;
        document = application instanceof TourApplication ? "tours" : document;
        document = application instanceof FairApplication ? "fairs" : document;

        DocumentReference reference = firestore.collection("applications").document(document);

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get(document);

            if (data == null) {
                data = new HashMap<>();
            }
            data.putIfAbsent(
                    application.getType().name()  + "_" + System.currentTimeMillis(),
                    mapper.convertValue(application, new TypeReference<HashMap<String, Object>>() {})
            );


            ApiFuture<WriteResult> result = reference.set(
                    mapper.convertValue(
                            Collections.singletonMap(document, data),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );
            System.out.println("Application added to database." + result.get().getUpdateTime());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add application to database.");
        }
    }

    public void removeApplication(Application app, String id) {
        String document = app.getType().name().toLowerCase() + "s";
        DocumentReference reference = firestore.collection("applications").document(document);

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get(document);
            data.remove(id);
            reference.set(
                    mapper.convertValue(
                            Collections.singletonMap(document, data),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to remove application from database.");
        }
    }

    public Map<String, GuideApplication> getGuideApplications() {
        Map<String, GuideApplication> applications = new HashMap<>();
        DocumentReference reference = firestore.collection("applications").document("guides");

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("guides");
            for (Map.Entry<String, Object> entry : data.entrySet()) {
                applications.put(entry.getKey(), GuideApplication.fromMap((Map<String,Object>) entry.getValue()));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to get applications from database.");
        }
        return applications;
    }

    public Map<String, TourApplication> getTourApplications() {
        Map<String, TourApplication> applications = new HashMap<>();
        DocumentReference reference = firestore.collection("applications").document("tours");

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("tours");
            for (Map.Entry<String, Object> entry : data.entrySet()) {
                applications.put(entry.getKey(), TourApplication.fromMap((Map<String,Object>) entry.getValue()));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to get applications from database.");
        }
        return applications;
    }

    public Map<String, FairApplication> getFairApplications() {
        Map<String, FairApplication> applications = new HashMap<>();
        DocumentReference reference = firestore.collection("applications").document("fairs");

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("fairs");
            for (Map.Entry<String, Object> entry : data.entrySet()) {
                applications.put(entry.getKey(), FairApplication.fromMap((Map<String,Object>) entry.getValue()));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to get applications from database.");
        }
        return applications;
    }

    public Map<String, Application> getApplications() {
        Map<String, Application> applications = new HashMap<>();
        for (ApplicationType type : ApplicationType.values()) {
            applications.putAll(getAppicationsOfType(type));
        }
        return applications;
    }

    public Map<String, Application> getAppicationsOfType(ApplicationType type) {
        Map<String, Application> applications = new HashMap<>();
        String document = type.name().toLowerCase() + "s";
        DocumentReference reference = firestore.collection("applications").document(document);

        try {
            System.out.println("Getting for " + document);
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get(document);
            for (Map.Entry<String, Object> entry : data.entrySet()) {
                if (type == ApplicationType.GUIDE) {
                    applications.put(entry.getKey(), GuideApplication.fromMap((Map<String,Object>) entry.getValue()));
                } else if (type == ApplicationType.TOUR) {
                    applications.put(entry.getKey(), TourApplication.fromMap((Map<String,Object>) entry.getValue()));
                } else if (type == ApplicationType.FAIR) {
                    applications.put(entry.getKey(), FairApplication.fromMap((Map<String,Object>) entry.getValue()));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to get applications from database.");
        }
        return applications;
    }
    public void updateApplication(String applicationID, ApplicationType type, ApplicationStatus update) {
        String document = type.name().toLowerCase() + "s";
        DocumentReference reference = firestore.collection("applications").document(document);

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get(document);
            Map<String, Object> application = (Map<String, Object>) data.get(applicationID);
            application.put("status", update.name());

            data.put(applicationID, application);
            reference.set(
                    mapper.convertValue(
                            Collections.singletonMap(document, data),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to update application in database.");
        }
    }
}
