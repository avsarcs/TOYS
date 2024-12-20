package server.dbm;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import server.models.DTO.DTO_Highschool;
import server.models.schools.Highschool;
import server.models.schools.HighschoolRecord;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DBSchoolService {

    private Firestore firestore;
    private ObjectMapper mapper;

    public DBSchoolService() {
        this.firestore = Database.getFirestoreDatabase();
        this.mapper = Database.getObjectMapper();
    }

    public void addHighschool(Highschool highschool) {
        try {
            DocumentReference reference = firestore.collection("edu").document("highschools");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("highschools");

            data.put(
                    highschool.getId(),
                    highschool
            );

            ApiFuture<WriteResult> result = reference.set(
                    mapper.convertValue(
                            Collections.singletonMap("highschools", data),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );

            System.out.println("Highschool added to database." + result.get().getUpdateTime());

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add highschool to the database.");
        }
    }

    public  List<Highschool> getHighschools() {
        List<Highschool> schools = new ArrayList<>();
        try {
            DocumentReference reference = firestore.collection("edu").document("highschools");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("highschools");

            schools.addAll(
                    data.entrySet().stream().map(
                            entry -> Highschool.fromMap((Map<String, Object>) entry.getValue())
                    ).toList()
            );


        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch highschools from database.");
        }
        return schools;
    }

    public Highschool getHighschoolByID(String id) {
        System.out.println("Getting for id: " + id);
        if (Objects.equals(id, DTO_Highschool.getDefault().getId())
        || Objects.equals(id, DTO_Highschool.getDefault().getId() + "new")) {
            return Highschool.getDefault();
        }

        try {
            DocumentReference reference = firestore.collection("edu").document("highschools");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("highschools");

            if (!data.containsKey(id)) {
                return null;
            }
            return Highschool.fromMap((Map<String, Object>) data.get(id));

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch tours from database.");
        }
        return null;
    }
}
