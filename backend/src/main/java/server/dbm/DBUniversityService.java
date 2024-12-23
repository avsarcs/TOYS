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
                universities.putIfAbsent(entry.getKey(), University.fromSource((Map<String, Object>)entry.getValue()));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch universities from database.");
        }
        return universities;
    }

    public University getUniversity(String uid) {

        System.out.println("Cache check");
        if (MemCache.isValid("uni_" + uid)) {
            System.out.println("Cache valid");
            return (University) MemCache.load("uni_" + uid);
        }
        System.out.println("Cache invalid");

        try {

            Map<String, Object> data = local.loadMap(universityFilePath);

            if (!data.containsKey(uid)) {
                return null;
            }

            University university = null;
            try {
                university = University.fromSource((Map<String, Object>) data.get(uid));
                System.out.println("found uni, saving to cache.");
                MemCache.save("uni_" + uid, university);
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("Error parsing University from source.");
            }

            return university;

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch university from database.");
        }
        return null;
    }
    public void updateUniversityRivalry(String uid, boolean isRival) {
        MemCache.invalidate("uni_" + uid);

        try {
            Map<String, Object> data = local.loadMap(universityFilePath);

            if (!data.containsKey(uid)) {
                throw new RuntimeException("University with id " + uid + " not found.");
            }

            Map<String, Object> relatedUni = (Map<String, Object>) data.get(uid);

            relatedUni.put("is_rival", isRival);
            data.put(uid, relatedUni);

            System.out.println(":::" + ((Map<?, ?>) data.get(uid)).get("is_rival"));

            if (local.saveMap(universityFilePath, data)) {
                System.out.println("University rivalry status updated successfully.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to update university rivalry status.");
        }
    }
}
