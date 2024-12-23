package server.review;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.AuthService;
import server.auth.JWTService;
import server.auth.Permission;
import server.auth.PermissionMap;
import server.dbm.Database;
import server.enums.roles.Reviewee;
import server.mailService.MailServiceGateway;
import server.mailService.mailTypes.About;
import server.mailService.mailTypes.Concerning;
import server.mailService.mailTypes.Status;
import server.models.DTO.DTOFactory;
import server.models.events.FairRegistry;
import server.models.events.TourRegistry;
import server.models.people.Guide;
import server.models.review.*;

import java.util.*;

@Service
public class ReviewService {

    @Autowired
    DTOFactory dto;

    @Autowired
    Database database;

    @Autowired
    MailServiceGateway mailService;

    @Autowired
    AuthService authService;

    public void deleteReview(String auth, String review_id) {
        if (!JWTService.getSimpleton().check(auth, Permission.AR_REVIEWS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authorized to delete review");
        }

        Map<String, ReviewRecord> reviewRecord = database.reviews.getReviewRecords();

        if (!reviewRecord.containsKey(review_id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No review with this id!");
        }

        reviewRecord.remove(review_id);

        database.reviews.updateReviewRecords(reviewRecord);
        database.reviews.deleteReview(review_id);
    }

    public void reviewTour(String reviewerID, List<Map<String, Object>> reviewMap) {

        Map<String, ReviewRecord> reviewRecord = database.reviews.getReviewRecords();

       /* if (!reviewRecord.containsKey(reviewerID)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authorized to review");
        }
        if (reviewRecord.get(reviewerID).getStatus() != ReviewResponse.PENDING) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Review already submitted!");
        }*/

        try {
            String event_id = reviewRecord.entrySet().stream().filter(
                    e -> e.getValue().getEvent_id().equals(reviewerID)
            ).findFirst().orElse(null).getKey();

            /*if (canReview(reviewerID, event_id)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authorized to review");
            }*/

            reviewEvent(reviewerID, event_id, reviewMap);

            try {
                mailService.sendMail(
                        database.people.fetchAdvisorForDay(database.tours.fetchTour(event_id).getAccepted_time().getDate().getDayOfWeek()).getProfile().getContact_info().getEmail(),
                        Concerning.ADVISOR,
                        About.REVIEW,
                        Status.RECIEVED,
                        Map.of("tour_id", event_id)
                );

            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid reviewer!");
        }

    }

    public String markForReview(String event_id) {
        String pass = "";

        Map<String, ReviewRecord> record = database.reviews.getReviewRecords();

        if (record.containsKey(event_id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Already marked for review!");
        }

        pass = UUID.randomUUID().toString();

        record.put(event_id, new ReviewRecord().setEvent_id(pass).setStatus(ReviewResponse.PENDING).setReview_id(""));

        database.reviews.updateReviewRecords(record);

        return pass;
    }

    public boolean canReview(String pass, String event_id) {
        Map<String, ReviewRecord> record = database.reviews.getReviewRecords();
        return record.containsKey(event_id) && record.get(event_id).getEvent_id().equals(pass) && record.get(event_id).getStatus().equals(ReviewResponse.PENDING);
    }

    public void reviewEvent(String pass, String event_id, List<Map<String, Object>> reviews) {
        /*if (!canReview(pass, event_id)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authorized to review");
        }*/

        EventReview eventReview = dto.reviewCreateModel(reviews);

        String review_id = database.reviews.addReview(eventReview);

        Map<String, ReviewRecord> record = database.reviews.getReviewRecords();

        record.get(event_id).setReview_id(review_id).setStatus(ReviewResponse.RECEIVED);

        database.reviews.updateReviewRecords(record);
    }

    public Map<String, Object> getTourDetails(String reviewer_id) {
        Map<String, ReviewRecord> reviewRecord = database.reviews.getReviewRecords();

        try {
            String eventID = reviewRecord.entrySet().stream().filter(
                    e -> e.getValue().getEvent_id().equals(reviewer_id)
            ).findFirst().orElse(null).getKey();


            TourRegistry tour = database.tours.fetchTour(eventID);
            List<Guide> guides = new ArrayList<>();
            for (String gid : tour.getGuides()) {
                try {
                    guides.add(database.people.fetchGuides(gid).get(0));
                } catch (Exception e) {
                    System.out.println("ReviewService:getTourDetails() :There was an error on fetching guide with id: " + gid);
                }
            }
            return dto.tourToReview(tour, guides);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authorized");
        }
    }

    public void respondToReview(String auth, String review_id, String responseString) {
        if (!JWTService.getSimpleton().isValid(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authorization!");
        }
        if (PermissionMap.hasPermission(
                JWTService.getSimpleton().getUserRole(auth),
                Permission.AR_REVIEWS
        )) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authorized to respond to review");
        }
        ReviewResponse response = null;
        try {
            response = ReviewResponse.valueOf(responseString);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid response!");
        }

        Map<String, ReviewRecord> reviewRecord = database.reviews.getReviewRecords();
        reviewRecord.get(review_id).setStatus(response);
        database.reviews.updateReviewRecords(reviewRecord);

        mailService.sendMail(
                database.tours.fetchTour(reviewRecord.get(review_id).getEvent_id()).getApplicant().getContact_info().getEmail(),
                Concerning.EVENT_APPLICANT,
                About.REVIEW,
                Status.valueOf(responseString),
                Map.of("tour_id", reviewRecord.get(review_id).getEvent_id())
        );
    }

    public List<Map<String,Object>> getReviewOfTour(String auth, String tour_id) {
        if (!authService.check(auth, Permission.VIEW_TOUR_REVIEW)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authorized to view review");
        }

        if (database.tours.fetchTour(tour_id) == null) {;
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No tour with this id!");
        }

        Map<String, ReviewRecord> record = database.reviews.getReviewRecords();

        Map.Entry<String, ReviewRecord> reviewEntry =   record.entrySet().stream().filter(
                e -> e.getValue()
                        .getEvent_id()
                        .equals(tour_id)
        ).findFirst().orElse(null);
        if (reviewEntry == null) {
            return new ArrayList<>();
        }
        try {

            ReviewRecord reviewRecord = reviewEntry.getValue();

            EventReview review = database.reviews.getReview(reviewRecord.getReview_id());
        if(review == null) {
            return new ArrayList<>();
        }

            TourRegistry tour = database.tours.fetchTour(tour_id);
            List<Map<String, Object>> reviews = new ArrayList<>();
            reviews.add(dto.reviewOfTour(tour, review));
            reviews.addAll(review.getGuide_reviews().entrySet().stream().map(
                    e -> {
                        try {
                            return dto.reviewOfGuide(database.people.fetchGuides(e.getKey()).get(0), tour, review);
                        } catch (Exception ex) {
                            return null;
                        }
                    }
            ).toList());
            return reviews.stream().filter(Objects::nonNull).toList();
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    public Map<String,Object> getReviewOfGuide(String auth, String guide_id) {
        if (!authService.check(auth, Permission.RU_FROM_TOUR)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authorization!");
        }

        Guide guide;
        try {
            System.out.println("Guide ID: " + guide_id);
            List<Guide> guides = database.people.fetchGuides(guide_id);
            if (guides.isEmpty()) {
                guide = database.people.fetchAdvisors(guide_id).get(0);
            } else {
                guide = guides.get(0);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No guide with this id!");
        }

        Map<String, ReviewRecord> record = database.reviews.getReviewRecords();

        List<String> relatedReviews = record.entrySet().stream().filter(
                 e -> guide.getExperience().getPrevious_events().contains(e.getValue().getEvent_id())
        ).map( e -> e.getValue().getReview_id()).toList();

        double average = relatedReviews.stream().mapToLong(id -> database.reviews.getReview(id).getGuide_reviews().get(guide_id).getScore()).average().orElse(0);

        Map<String, Object> response = new HashMap<>();

        response.put("average", average);
        response.put("count", relatedReviews.size());
        // horrible, unoptimized, but functional
        // filter again, this time to get only approved reviews
        relatedReviews = record.entrySet().stream().filter(
                e -> guide.getExperience().getPrevious_events().contains(e.getValue().getEvent_id())
        ).map( e -> e.getValue().getReview_id()).toList();

        response.put("reviews",
        relatedReviews.stream().map( reviewID -> {
            TourRegistry tour = database.tours.fetchTour(database.reviews.getReview(reviewID).getEvent_id());
            return dto.reviewOfGuide(guide, tour, database.reviews.getReview(reviewID));
        }).toList());

        return response;
    }
}
