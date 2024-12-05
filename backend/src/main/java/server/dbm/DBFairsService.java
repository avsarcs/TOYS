package server.dbm;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import server.models.FairRegistry;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class DBFairsService {

    private Firestore firestore;
    private ObjectMapper mapper;

    public DBFairsService() {
        this.firestore = Database.getFirestoreDatabase();
        this.mapper = Database.getObjectMapper();
    }
    public boolean addFair(FairRegistry fair) {
        DocumentReference reference = firestore.collection("events").document("fairs");

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("fairs");
            data.putIfAbsent(fair.getFair_id(), fair);


            ApiFuture<WriteResult> result = reference.set(
                    mapper.convertValue(
                            Collections.singletonMap("fairs", data),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );
            System.out.println("fair [" + fair.getFair_id() + "]  added to database." + result.get().getUpdateTime());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add fair to database.");
            return false;
        }
        return true;
    }

    public boolean updateFair(FairRegistry fair, String fairID) {
        DocumentReference reference = firestore.collection("events").document("fairs");

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("fairs");
            data.put(fairID, fair);

            ApiFuture<WriteResult> result = reference.set(
                    mapper.convertValue(
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

    public Map<String,FairRegistry> fetchFairs() {
        Map<String, FairRegistry> fairs = new HashMap<String, FairRegistry>();
        try {
            DocumentReference reference = firestore.collection("events").document("fairs");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("fairs");


            for (Map.Entry<String, Object> entry : data.entrySet()) {
                fairs.putIfAbsent(entry.getKey(), FairRegistry.fromMap((Map<String, Object>) data.get("fairs")));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch fairs from database.");
        }
        return fairs;
    }
}
