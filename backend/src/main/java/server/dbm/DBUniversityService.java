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
    private static final String universityFilePath = "data/universities.json";
    private final LocalFileService local;
    private final ObjectMapper mapper;

    public DBUniversityService() {
        this.local = Database.getLocalFileService();
        this.mapper = Database.getObjectMapper();
    }
    // Adding may be useless, but it is still here if needed
    public boolean addUniversity(University university) {

        try {
            Map<String, Object> data = local.loadMap(universityFilePath);

            data.putIfAbsent(
                    university.getUid(),
                    mapper.convertValue(university, new TypeReference<HashMap<String, Object>>() {})
            );
            if (local.saveMap(universityFilePath, data)) {
                System.out.println("University added to database.");
            }
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
            Map<String, Object> data = local.loadMap(universityFilePath);

            for (Map.Entry<String, Object> entry : data.entrySet()) {
                universities.putIfAbsent(entry.getKey(), University.fromMap((Map<String, Object>)entry.getValue()));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch universities from database.");
        }
        return universities;
    }

    public University getUniversity(String uid) {
        try {

            Map<String, Object> data = local.loadMap(universityFilePath);

            if (!data.containsKey(uid)) {
                throw new RuntimeException("University with id " + uid + " not found.");
            }
            return University.fromSource((Map<String, Object>) data.get(uid));

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch university from database.");
        }
        return null;
    }
    public void updateUniversityRivalry(String uid, boolean isRival) {
        try {
            Map<String, Object> data = local.loadMap(universityFilePath);

            if (!data.containsKey(uid)) {
                throw new RuntimeException("University with id " + uid + " not found.");
            }


            ((Map<String, Object>) data.get(uid)).put("is_rival", isRival);

            if (local.saveMap(universityFilePath, data)) {
                System.out.println("University rivalry status updated successfully.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to update university rivalry status.");
        }
    }
}
