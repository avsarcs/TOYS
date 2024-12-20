package server.internal.analytics.high_schools;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.AuthService;
import server.auth.JWTService;
import server.auth.Permission;
import server.auth.PermissionMap;
import server.dbm.Database;
import server.models.DTO.DTOFactory;
import server.models.DTO.dataDTO.*;
import server.models.events.TourRegistry;
import server.models.review.ReviewRecord;
import server.models.schools.Highschool;
import server.models.schools.UniHighschoolRecord;
import server.models.schools.UniversityDepartment;
import server.models.schools.UniversityDepartmentYear;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class AnalyticsHighschoolService {

    @Autowired
    DTOFactory dto;

    @Autowired
    Database database;

    @Autowired
    AuthService authService;

    public List<Map<String, Object>> getAll(String auth) {
        List<Highschool> highschools =  database.schools.getHighschools();
        List<Map<String, Object>> response = new ArrayList<>();


        response.addAll(
                highschools.stream().map(hs -> dto.highschool(hs)).toList()
        );

        if (!authService.check(auth)) {
            response.forEach(
                    map -> {
                        map.put("ranking", -1);
                        map.put("priority", -1);
                    }
            );
        }

        return response;
    }

    public DDTO_HighschoolDetails getDetails(String auth, String high_school_id) {
        if (!authService.check(auth, Permission.TOTAL_ANALYTICS_ACCESS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have enough permissions!");
        }

        Highschool highschool = database.schools.getHighschoolByID(high_school_id);
        if (highschool == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Highschool not found!");
        }

        DDTO_HighschoolDetails details = new DDTO_HighschoolDetails();

        details.setCity(highschool.getCity());
        details.setRanking(highschool.getRanking());
        details.setPriority(highschool.getPriority());

        List<DDTO_YearlyStudentCount> counts = new ArrayList<>();
        // go through every year, get total student counts for those years
        for (UniversityDepartment department : database.universities.getUniversities().get("bilkent").getDepartments()) {
            for (UniversityDepartmentYear year : department.getYears()) {
                for (UniHighschoolRecord data : year.highschool_attendee_count) {

                    boolean added = false;
                    for (DDTO_YearlyStudentCount count : counts) {
                        if (count.getYear().equals(year.year)) {
                            count.setCount(count.getCount() + data.getTotal());
                            added = true;
                            break;
                        }
                    }
                    if (!added) {
                        DDTO_YearlyStudentCount newCount = new DDTO_YearlyStudentCount();
                        newCount.setYear(year.year);
                        newCount.setCount(data.getTotal());
                        counts.add(newCount);
                    }

                }
            }
        }

        details.setStudents(counts);


        // Fetch every review done by this school, assign tour id to review
        List<String> tourIDsForThisSchool = database.tours.fetchTours().entrySet().stream().filter(
                e -> e.getValue().getApplicant().getSchool().equals(high_school_id)
        ).map(e -> e.getValue().getTour_id()).toList();

        List<ReviewRecord> relatedReviews = database.reviews.getReviewRecords().entrySet().stream().filter(
                record -> tourIDsForThisSchool.contains(record.getValue().getEvent_id())
        ).map(e -> e.getValue()).toList();
        Map<String, DDTO_HighschoolTour> highschoolTours = new HashMap<>();
        for (ReviewRecord reviewRecord : relatedReviews) {
            try {
                highschoolTours.putIfAbsent(
                        reviewRecord.getEvent_id(),
                        new DDTO_HighschoolTour()
                                .setTour_id(reviewRecord.getEvent_id())
                                .setReview_rating(database.reviews.getReview(reviewRecord.getReview_id()).getEvent_review().getScore())
                );
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("There was an error while getting reviews for tours.");
            }
        }

        details.setTours(highschoolTours.values().stream().toList());

        return details;
    }



}
