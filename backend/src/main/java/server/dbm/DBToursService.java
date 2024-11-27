package server.dbm;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import org.springframework.web.server.ResponseStatusException;
import server.models.TourRegistry;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class DBToursService {

    private Firestore firestore;
    private ObjectMapper mapper;

    public DBToursService() {
        this.firestore = Database.getFirestoreDatabase();
        this.mapper = Database.getObjectMapper();
    }
    public TourRegistry fetchTour (String tid) {

        try {
            DocumentReference reference = firestore.collection("events").document("tours");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("tours");

            if (!data.containsKey(tid)) {
                throw new RuntimeException("Tour with id " + tid + " not found.");
            }
            return TourRegistry.fromMap((Map<String, Object>) data.get(tid));

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch tours from database.");
        }
        return null;
    }

    public Map<String,TourRegistry> fetchTours() {

        Map<String, TourRegistry> tours = new HashMap<String, TourRegistry>();
        try {
            DocumentReference reference = firestore.collection("events").document("tours");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("tours");

            for (Map.Entry<String, Object> entry : data.entrySet()) {
                tours.putIfAbsent(entry.getKey(), TourRegistry.fromMap((Map<String, Object>) entry.getValue()));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch tours from database.");
        }
        return tours;
    }

    // tour applicastions are handled by DBApplicationsService
    public boolean addTour(TourRegistry tour) {
        DocumentReference reference = firestore.collection("events").document("tours");

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("tours");
            data.putIfAbsent(tour.getTour_id(), tour);


            ApiFuture<WriteResult> result = reference.set(
                    mapper.convertValue(
                            Collections.singletonMap("tours", data),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );
            System.out.println("["+tour.getTour_id()+"] added to database." + result.get().getUpdateTime());
        } catch (Exception e) {
            e.printStackTrace();;
            System.out.println("Failed to add tour to database.");
            return false;
        }
        return true;
    }

    public boolean updateTour(TourRegistry tour, String tourId) {
        DocumentReference reference = firestore.collection("events").document("tours");

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("tours");
            data.put(tourId, tour);

            ApiFuture<WriteResult> result = reference.set(
                    mapper.convertValue(
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
}
