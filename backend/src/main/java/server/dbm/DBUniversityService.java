package server.dbm;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import org.springframework.stereotype.Service;
import server.models.schools.University;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;


@Service
public class DBUniversityService {
    private final Firestore firestore;
    private final ObjectMapper mapper;

    public DBUniversityService() {
        this.firestore = Database.getFirestoreDatabase();
        this.mapper = Database.getObjectMapper();
    }
    // Adding may be useless, but it is still here if needed
    public boolean addUniversity(University university) {

        DocumentReference reference = firestore.collection("universities").document("universities");

        try {
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("universities");
            if (data == null) {
                data = new HashMap<>();
            }
            data.putIfAbsent(
                    university.getUid(),
                    mapper.convertValue(university, new TypeReference<HashMap<String, Object>>() {})
            );
            // Not sure about this line
            ApiFuture<WriteResult> result = reference.set(
                    mapper.convertValue(
                            Collections.singletonMap("universities", data),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );
            System.out.println("University added to database." + result.get().getUpdateTime());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add university to database.");
            return false;
        }
        return true;

}

    public Map<String, University> getUniversities() {
        Map<String, University> universities = new HashMap<>();
        try {
            DocumentReference reference = firestore.collection("universities").document("universities");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("universities");

            for (Map.Entry<String, Object> entry : data.entrySet()) {
                universities.putIfAbsent(entry.getKey(), University.fromMap((Map<String, Object>)entry.getValue()));
                //universities.putIfAbsent(entry.getKey(), mapper.convertValue(entry.getValue(), University.class));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch universities from database.");
        }
        return universities;
    }

    public University getUniversity(String uid) {
        try {
            DocumentReference reference = firestore.collection("universities").document("universities");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("universities");

            if (!data.containsKey(uid)) {
                throw new RuntimeException("University with id " + uid + " not found.");
            }
            return mapper.convertValue(data.get(uid), University.class);

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch university from database.");
        }
        return null;
    }
    public void updateUniversityRivalry(String uid, boolean isRival) {
        try {
            DocumentReference reference = firestore.collection("universities").document("universities");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("universities");

            if (!data.containsKey(uid)) {
                throw new RuntimeException("University with id " + uid + " not found.");
            }

            Map<String, Object> updatedData = new HashMap<>();
            updatedData.put("is_rival", isRival);

            reference.update("universities." + uid + ".is_rival", isRival).get();
            System.out.println("University rivalry status updated successfully.");

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to update university rivalry status.");
        }
    }
}
