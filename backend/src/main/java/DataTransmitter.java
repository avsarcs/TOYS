import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import server.dbm.Database;
import server.models.schools.Highschool;
import server.models.schools.HighschoolRecord;

import java.io.File;
import java.io.IOException;
import java.util.*;

public class DataTransmitter {

    public static void main(String[] args) {
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            Database database = Database.getInstance();

            Firestore firestore = database.getFirestoreDatabase();
            ObjectMapper mapper = database.getObjectMapper();
            // Read JSON file into a Map
            List<Map<String, Object>> maps = objectMapper.readValue(new File("src/main/resources/hsdata.json"), new TypeReference<List<Map<String, Object>>>() {});

            DocumentReference reference = firestore.collection("edu").document("highschools");

            Map<String, Object> map = new HashMap<>();
            map.put("Default HS ID", HighschoolRecord.getDefault());
            maps.forEach(
                    m -> {
                        HighschoolRecord hs = HighschoolRecord.fromMap(m);
                        map.put(UUID.randomUUID().toString(), hs);
                    }
            );


            System.out.println("Entry count: " + map.size());

            ApiFuture<WriteResult> result = reference.set(
                    mapper.convertValue(
                            Collections.singletonMap("highschools", map),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );

            System.out.println("Highschool added to database." + result.get().getUpdateTime());

            // Print the map
            System.out.println(map);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
