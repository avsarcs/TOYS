package server.dbm;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import server.enums.roles.Reviewee;
import server.models.review.DTO_GuideReview;
import server.models.review.DTO_ReviewCreate;
import server.models.review.ReviewRecord;

import java.util.Map;
import java.util.UUID;

public class DBReviewService {


    private Firestore firestore;
    private ObjectMapper mapper;

    public DBReviewService() {
        this.firestore = Database.getFirestoreDatabase();
        this.mapper = Database.getObjectMapper();
    }
    public DTO_ReviewCreate getReview(String reviewID, Reviewee reviewType) {
        if (reviewType == null) {
            DTO_ReviewCreate review = null;
            for (Reviewee type : Reviewee.values()) {
                review = getReview(reviewID, type);
                if (review != null) {
                    return review;
                }
            }
        }
        String documentPath = reviewType.toString().toLowerCase() + "s";
        DTO_ReviewCreate review = null;

        try {
            DocumentReference reference = firestore.collection("reviews").document(documentPath);

            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("reviews");
            if (!data.containsKey(reviewID)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Review not found.");
            }
            if (reviewType == Reviewee.GUIDE) {
                review = DTO_GuideReview.fromMap((Map<String, Object>) data.get(reviewID));
            } else if (reviewType == Reviewee.TOUR) {
                review = DTO_ReviewCreate.fromMap((Map<String, Object>) data.get(reviewID));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch review from database.");
        }

        return review;
    }

    public Map<String, ReviewRecord> getReviewRecords() {
        Map<String, ReviewRecord> records = null;
        try {
            DocumentReference reference = firestore.collection("reviews").document("records");
            records = (Map<String, ReviewRecord>) reference.get().get().getData().get("records");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch review records from database.");
        }
        return records;
    }

    public void updateReviewRecords(Map<String, ReviewRecord> updatedVersion) {
        try {
            DocumentReference reference = firestore.collection("reviews").document("records");
            reference.update("records", updatedVersion);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to update review records in database.");
        }
    }

    public void addReview(DTO_ReviewCreate review) {
        String documentPath = review.getReviewee().name().toLowerCase() + "s";
        try {
            DocumentReference reference = firestore.collection("reviews").document(documentPath);
            Map<String, Object> data = (Map<String, Object>) reference.get().get().getData().get("reviews");

            String uuid = UUID.randomUUID().toString();
            while (data.containsKey(uuid)) {
                uuid = UUID.randomUUID().toString();
            }
            data.put(uuid, review);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add review from database.");
        }
    }
}
