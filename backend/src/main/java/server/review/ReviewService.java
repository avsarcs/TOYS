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
import server.models.DTO.DTO_SimpleGuide;
import server.models.events.FairRegistry;
import server.models.events.TourRegistry;
import server.models.people.Guide;
import server.models.review.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

        if (!reviewRecord.containsKey(reviewerID)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authorized to review");
        }
        if (reviewRecord.get(reviewerID).getStatus() != ReviewResponse.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Review already submitted!");
        }

        EventReview review = dto.reviewCreateModel(reviewMap);

        database.reviews.addReview(review);
        try {

            mailService.sendMail(
                    database.people.fetchAdvisorForDay(database.tours.fetchTour(review.getEvent_id()).getAccepted_time().getDate().getDayOfWeek()).getProfile().getContact_info().getEmail(),
                    Concerning.ADVISOR,
                    About.REVIEW,
                    Status.RECIEVED,
                    Map.of("tour_id", review.getEvent_id(), "score", Long.toString(review.getEvent_review().getScore()))
            );
        } catch (Exception e) {
            System.out.println("ReviewService:reviewTour() :There was an error on sending mail to advisor");
        }
    }

    public Map<String, Object> getTourDetails(String reviewer_id) {
        Map<String, ReviewRecord> reviewRecord = database.reviews.getReviewRecords();

        if (!reviewRecord.containsKey(reviewer_id)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authorized");
        }


        TourRegistry tour = database.tours.fetchTour(reviewRecord.get(reviewer_id).getEvent_id());
        List<Guide> guides = new ArrayList<>();
        for (String gid : tour.getGuides()) {
            try {
                guides.add(database.people.fetchGuides(gid).get(0));
            } catch (Exception e) {
                System.out.println("ReviewService:getTourDetails() :There was an error on fetching guide with id: " + gid);
            }
        }

        return dto.tourToReview(tour, guides);
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

    public Map<String,Object> getReviewOfTour(String auth, String tour_id) {
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
        ).findFirst().orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "No review for this tour!"));
        ReviewRecord reviewRecord = reviewEntry.getValue();

        EventReview review = database.reviews.getReview(reviewRecord.getReview_id());

        TourRegistry tour = database.tours.fetchTour(tour_id);
        return dto.reviewOfTour(tour, review);
    }

    public Map<String,Object> getReviewOfGuide(String auth, String guide_id) {
        if (!JWTService.getSimpleton().isValid(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authorization!");
        }
        if (!JWTService.getSimpleton().decodeUserID(auth).equals(guide_id)) {
            if (!PermissionMap.hasPermission(
                    JWTService.getSimpleton().getUserRole(auth),
                    Permission.VIEW_TOUR_REVIEW
            )) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authorized to view review");
            }
        }
        Guide guide;
        try {
            guide = database.people.fetchGuides(guide_id).get(0);
        } catch (Exception e) {
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
        ).filter(
                e -> e.getValue().getStatus().equals(ReviewResponse.APPROVED)
        ).map( e -> e.getValue().getReview_id()).toList();

        response.put("reviews",
        relatedReviews.stream().map( reviewID -> {
            TourRegistry tour = database.tours.fetchTour(database.reviews.getReview(reviewID).getEvent_id());
            return dto.reviewOfGuide(guide, tour, database.reviews.getReview(reviewID));
        }).toList());

        return response;
    }
}
