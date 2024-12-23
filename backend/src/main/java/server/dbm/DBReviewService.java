package server.dbm;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import server.enums.roles.Reviewee;
import server.models.review.EventReview;
import server.models.review.ReviewRecord;

import java.util.*;

public class DBReviewService {


    private Firestore firestore;
    private ObjectMapper mapper;

    public DBReviewService() {
        this.firestore = Database.getFirestoreDatabase();
        this.mapper = Database.getObjectMapper();
    }

    public void deleteReview(String reviewID) {
        try {
            DocumentReference reference = firestore.collection("reviews").document("reviews");
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("reviews");
            if (!data.containsKey(reviewID)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No review with this id!");
            }
            data.remove(reviewID);
            reference.set(
                    mapper.convertValue(
                            Collections.singletonMap("reviews", data),
                            new TypeReference<HashMap<String, Object>>() {}
                    ));
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to delete review from database.");
        }
    }

    public EventReview getReview(String reviewID) {
        EventReview review = null;

        try {
            DocumentReference reference = firestore.collection("reviews").document("reviews");

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("reviews");
            if (!data.containsKey(reviewID)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Review not found.");
            }
            review = EventReview.fromMap((Map<String, Object>) data.get(reviewID));

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch review from database.");
        }

        return review;
    }

    public Map<String, ReviewRecord> getReviewRecords() {
        Map<String, ReviewRecord> records = new HashMap<>();
        try {
            DocumentReference reference = firestore.collection("reviews").document("records");
            List<Map.Entry<String, ReviewRecord>> entries = ((Map<String, Object>) reference.get().get().getData().get("records")).entrySet().stream().map(
                    e -> Map.entry(e.getKey(), ReviewRecord.fromMap((Map<String, Object>) e.getValue()))
            ).toList();
            for (Map.Entry<String, ReviewRecord> entry : entries) {
                records.put(entry.getKey(), entry.getValue());
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch review records from database.");
        }
        return records;
    }

    public void updateReviewRecords(Map<String, ReviewRecord> updatedVersion) {
        try {
            DocumentReference reference = firestore.collection("reviews").document("records");
            // Not sure about this line
            ApiFuture<WriteResult> result = reference.set(
                    mapper.convertValue(
                            Collections.singletonMap("records", updatedVersion),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );
            //reference.update("records", updatedVersion);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to update review records in database.");
        }
    }

    public String addReview(EventReview review) {
        try {
            DocumentReference reference = firestore.collection("reviews").document("reviews");
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("reviews");

            String uuid = UUID.randomUUID().toString();
            while (data.containsKey(uuid)) {
                uuid = UUID.randomUUID().toString();
            }
            data.put(uuid, review);
            reference.set(
                    mapper.convertValue(
                        Collections.singletonMap("reviews", data),
                        new TypeReference<HashMap<String, Object>>() {}
                    ));
            return uuid;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add review from database.");
        }
        return "";
    }
}
