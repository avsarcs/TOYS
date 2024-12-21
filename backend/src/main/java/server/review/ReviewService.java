package server.review;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.JWTService;
import server.auth.Permission;
import server.auth.PermissionMap;
import server.dbm.Database;
import server.enums.roles.Reviewee;
import server.mailService.MailServiceGateway;
import server.mailService.mailTypes.About;
import server.mailService.mailTypes.Concerning;
import server.mailService.mailTypes.Status;
import server.models.DTO.DTO_SimpleGuide;
import server.models.events.FairRegistry;
import server.models.events.TourRegistry;
import server.models.people.Guide;
import server.models.review.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ReviewService {

    @Autowired
    Database database;

    @Autowired
    MailServiceGateway mailService;

    public void reviewTour(String reviewerID, Map<String, Object> reviewMap) {

        Map<String, ReviewRecord> reviewRecord = database.reviews.getReviewRecords();

        if (!reviewRecord.containsKey(reviewerID)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authorized to review");
        }
        if (reviewRecord.get(reviewerID).getStatus() != ReviewResponse.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Review already submitted!");
        }

        DTO_ReviewCreate review = null;

        if (reviewMap.get("for").equals( Reviewee.GUIDE.name())) {
            review = DTO_GuideReview.fromMap(reviewMap);
        } else if (reviewMap.get("for").equals( Reviewee.TOUR.name())) {
            review = DTO_ReviewCreate.fromMap(reviewMap);
        }
        if (review == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid review type");
        }

        database.reviews.addReview(review);
        mailService.sendMail(
                database.people.fetchAdvisorForDay(database.tours.fetchTour(review.getTour_id()).getAccepted_time().getDate().getDayOfWeek()).getProfile().getContact_info().getEmail(),
                Concerning.ADVISOR,
                About.REVIEW,
                Status.RECIEVED,
                Map.of("tour_id", review.getTour_id(), "score", Long.toString(review.getScore()))
        );
    }

    public DTO_TourToReview getTourDetails(String reviewer_id) {
        Map<String, ReviewRecord> reviewRecord = database.reviews.getReviewRecords();

        if (!reviewRecord.containsKey(reviewer_id)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authorized");
        }

        DTO_TourToReview ttr = new DTO_TourToReview();

        ttr.setTour_id(
                reviewRecord.get(reviewer_id).getEvent_id()
        );
        TourRegistry tour = database.tours.fetchTour(ttr.getTour_id());
        ttr.setTour_date(tour.getAccepted_time());
        List<DTO_SimpleGuide> guides = new ArrayList<>();
        for (String gid : tour.getGuides()) {
            guides.add(DTO_SimpleGuide.fromGuide(database.people.fetchGuides(gid).get(0)));
        }
        ttr.setGuides(guides);

        return ttr;
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

    public DTO_Review getReviewOfTour(String auth, String tour_id) {
        if (!JWTService.getSimpleton().isValid(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authorization!");
        }
        if (!PermissionMap.hasPermission(
                JWTService.getSimpleton().getUserRole(auth),
                Permission.VIEW_TOUR_REVIEW
        )) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authorized to view review");
        }

        if (database.tours.fetchTour(tour_id) != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No tour with this id!");
        }

        DTO_Review review = null;

        Map<String, ReviewRecord> record = database.reviews.getReviewRecords();

        try {
            Map.Entry<String, ReviewRecord> reviewEntry = record.entrySet().stream().filter(
                    e -> e.getValue()
                            .getEvent_id()
                            .equals(tour_id)
            ).findFirst().get();

            if (reviewEntry.getValue().getStatus() == ReviewResponse.APPROVED
                    || reviewEntry.getValue().getStatus() == ReviewResponse.PARTIAL) {
                DTO_ReviewCreate RC =  database.reviews.getReview(reviewEntry.getKey(), null);
                review = DTO_Review.merge(RC, reviewEntry.getValue());
            }

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No review for this tour!");
        }


        return review;
    }

    public DTO_GuideOverall getReviewOfGuide(String auth, String guide_id) {
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
        // get related tours
        Map<String, FairRegistry> fairs = database.fairs.fetchFairs();
        List<String> tourIDs = guide.getExperience().getPrevious_events().stream().filter(
                e -> fairs.get(e) == null
        ).toList();
        List<TourRegistry> tours = new ArrayList<>();
        for (String tid : tourIDs) {
            tours.add(database.tours.fetchTour(tid));
        }

        Map<String, ReviewRecord> record = database.reviews.getReviewRecords();

        try {
            DTO_GuideOverall overall = new DTO_GuideOverall();
            List<DTO_Review> reviewList = new ArrayList<>();

            reviewList.addAll(
                    record.entrySet().stream().filter(
                            entry -> entry.getValue().getStatus() == ReviewResponse.APPROVED
                                    || entry.getValue().getStatus() == ReviewResponse.PARTIAL
                    ).map(
                            oe -> DTO_Review.merge(database.reviews.getReview(
                                    oe.getValue().getReview_id(), null
                            ),oe.getValue())
                    ).toList()
            );

            overall.setReviews(reviewList);
            overall.setAverage(
                    reviewList.stream().mapToLong(DTO_Review::getScore).average().orElse(0)
            );
            overall.setCount(reviewList.size());


        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No review for this tour!");
        }


        return null;
    }
}
