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

            maps.sort(
                    (m1, m2) -> {
                        double hs1 = 0;
                        try {
                            hs1 = Double.valueOf((String)((Map<String,Object>)m1.get("details")).get("percentile"));
                        } catch (Exception e) {}
                        double hs2 = 0;
                        try {
                            hs2 = (Double.valueOf((String)((Map<String,Object>)m2.get("details")).get("percentile")));
                        } catch (Exception e) {}
                        return Double.compare(hs1, hs2);
                    }
            );

            maps.forEach(
                    m -> {
                        HighschoolRecord hs = HighschoolRecord.fromMap(m);
                        String id = UUID.randomUUID().toString();
                        map.put(id, hs.setId(id).setRanking(String.valueOf(maps.indexOf(m) + 1)));
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
            System.out.println("WE GOT AN ERROR AI AI AI IAI ");
            e.printStackTrace();
        }
    }

}
