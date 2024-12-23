package server.internal.analytics.high_schools;

import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import info.debatty.java.stringsimilarity.SorensenDice;
import server.auth.AuthService;
import server.auth.JWTService;
import server.auth.Permission;
import server.auth.PermissionMap;
import server.dbm.Database;
import server.enums.Department;
import server.models.DTO.DTOFactory;
import server.models.DTO.dataDTO.*;
import server.models.events.TourRegistry;
import server.models.review.ReviewRecord;
import server.models.schools.*;
import server.review.ReviewService;

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

    @Autowired
    ReviewService reviewService;

    public List<Map<String, Object>> getAll(String auth) {
        List<HighschoolRecord> highschools =  database.schools.getHighschools();
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

    public List<Map<String, Object>> getAllDto(String auth) {
        List<HighschoolRecord> highschools =  database.schools.getHighschools();
        List<Map<String, Object>> response = new ArrayList<>();

        response.addAll(
                highschools.stream().map(hs -> dto.highschoolNoLocation(hs)).toList()
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

    public Map<String, Object> getDetails(String auth, String high_school_id) {
        if (!authService.check(auth, Permission.TOTAL_ANALYTICS_ACCESS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have enough permissions!");
        }

        HighschoolRecord hs = database.schools.getHighschoolByID(high_school_id);
        if (hs == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Highschool not found!");
        }

        Map<String, Object> details_map = new HashMap<>();


        details_map.put("city", hs.getLocation());
        details_map.put("ranking", hs.getRanking());
        details_map.put("priority", hs.getPriority());

        SorensenDice sorensenDice = new SorensenDice();
        List<Map<String, Object>> counts_map = new ArrayList<>();
        // go through every year, get total student counts for those years
        try {
            // Get the Bilkent university
            University bilkent = database.universities.getUniversity("bilkent");
            // Initialize a map to store the total student counts for each year
            Map<String, Long> studentCountsByYear = new HashMap<>();

            // Iterate through the departments of Bilkent university
            for (UniversityDepartment department : bilkent.getDepartments()) {
                // Iterate through each year of the department
                for (UniversityDepartmentYear year : department.getYears()) {
                    // Sum the totals of the given high school for the specific year
                    long totalForYear = year.getHighschool_attendee_count().stream()
                            .filter(record -> sorensenDice.similarity(record.getSchool_name().toLowerCase(), hs.getTitle().toLowerCase()) > 0.8)
                            .mapToLong(UniHighschoolRecord::getTotal)
                            .sum();

                    // Add the total to the map
                    studentCountsByYear.merge(year.getYear(), totalForYear, Long::sum);
                }
            }

// Convert the map to a list of maps for the response
            counts_map = studentCountsByYear.entrySet().stream()
                    .map(entry -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("year", entry.getKey());
                        map.put("count", entry.getValue());
                        return map;
                    })
                    .toList();
        } catch (Exception E) {
            E.printStackTrace();
            System.out.println("There was an error while getting student counts for highschools.");
        }

        details_map.put("students", counts_map);


        // Fetch every review done by this school, assign tour id to review
        List<String> tourIDsForThisSchool = database.tours.fetchTours().entrySet().stream().filter(
                e -> e.getValue().getApplicant().getSchool().equals(high_school_id)
        ).map(e -> e.getValue().getTour_id()).toList();

        List<ReviewRecord> relatedReviews = database.reviews.getReviewRecords().entrySet().stream().filter(
                record -> tourIDsForThisSchool.contains(record.getValue().getEvent_id())
        ).map(e -> e.getValue()).toList();


        List<Map<String, Object>> HSTours = new ArrayList<>();
        for (ReviewRecord reviewRecord : relatedReviews) {
            try {
                HSTours.add(
                        Map.of(
                                "date", database.tours.fetchTour(reviewRecord.getEvent_id()).getStarted_at(),
                                "attendance", database.tours.fetchTour(reviewRecord.getEvent_id()).getExpected_souls(),
                                "review_rating", database.reviews.getReview(reviewRecord.getReview_id()).getEvent_review().getScore(),
                                "contact", database.tours.fetchTour(reviewRecord.getEvent_id()).getApplicant().getContact_info().getEmail(),
                                "tour_id", reviewRecord.getEvent_id()
                        )

                );
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("There was an error while getting reviews for tours.");
            }
        }

        details_map.put("tours", HSTours);

        return details_map;
    }

    public Map<String, Object> getTourReviews(String auth, String high_school_id, String tour_id) {
        if (!authService.check(auth, Permission.TOTAL_ANALYTICS_ACCESS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have enough permissions!");
        }

        HighschoolRecord hs = database.schools.getHighschoolByID(high_school_id);
        if (hs == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Highschool not found!");
        }
        
        TourRegistry tour = database.tours.fetchTour(tour_id);
        if (tour == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tour not found!");
        }


        Map<String, Object> response = new HashMap<>();
        if (response == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No review for this tour!");
        }

        // This had to be done because the method signature of getReviewOfTour was changed

        response = reviewService.getReviewOfTour(auth, tour_id).stream().filter(
                e -> !e.containsKey("guide_id")
        ).findFirst().orElse(Map.of());
        //response = reviewService.getReviewOfTour(auth, tour_id);
        return response;
    }

    public Map<String, Object> getStudents(String auth, String high_school_id, String year) {
        if (!authService.check(auth, Permission.TOTAL_ANALYTICS_ACCESS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have enough permissions!");
        }

        HighschoolRecord hs = database.schools.getHighschoolByID(high_school_id);
        if (hs == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Highschool not found!");
        }

        String hsName = hs.getTitle();
        
        SorensenDice alg = new SorensenDice();
        University bilkent = database.universities.getUniversity("bilkent");

        //bilkent.departments.get(0).years.get(0).getHighschool_attendee_count().get(0).getSchool_name();

        Map<String, Map<String, Long>> resp = new HashMap<>();

        bilkent.departments.stream().forEach(
                dep -> dep.getYears().stream().forEach(
                        y -> {
                            if (y.getYear().equals(year)) {
                                y.getHighschool_attendee_count().stream()
                                        .filter(
                                                d -> alg.similarity(d.getSchool_name().toLowerCase(), hsName.toLowerCase()) > 0.8
                                        ).findFirst().ifPresent(
                                                h -> {
                                                    if (resp.containsKey(dep.getName())) {
                                                        resp.get(dep.getName()).put(
                                                                dep.getScholarship(), h.getTotal()
                                                        );

                                                    } else {
                                                        resp.put(
                                                                dep.getName(),
                                                                Map.of(
                                                                        dep.getScholarship(), h.getTotal()
                                                                )
                                                        );
                                                    }

                                                }
                                        );
                            }
                        }
                )
        );

        resp.entrySet().stream().forEach(
                e -> {
                    e.getValue().put("total_count", e.getValue().values().stream().reduce(0L, Long::sum));
                }
        );

        Map<String, Object> response = new HashMap<>();
        return response;
    }

    public void editHighSchool(String auth, Map<String, Object> highschool) {
        if (!authService.check(auth, Permission.TOTAL_ANALYTICS_ACCESS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have enough permissions!");
        }

        HighschoolRecord hs = database.schools.getHighschoolByID((String) highschool.get("id"));
        hs.setPriority((String) highschool.get("priority"));
        hs.setRanking((String) highschool.get("ranking"));
        String location = (String) highschool.get("location");
        hs.setLocation(location);

        if (location != null && location.contains(" / ")) {
            String[] locationParts = location.split(" / ");
            String formattedLocation = locationParts[0] + " - " + locationParts[1];
            hs.setTitle(highschool.get("name") + " (" + formattedLocation + ")");
        } else {
            hs.setTitle(highschool.get("name") + " (" + location + ")");
        }

        database.schools.updateHighschool(hs);
    }

    public void addHighSchool(String auth, Map<String, Object> highschool) {
        if (!authService.check(auth, Permission.TOTAL_ANALYTICS_ACCESS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have enough permissions!");
        }
        HighschoolRecord hs = new HighschoolRecord();
        hs.setTitle((String) highschool.get("name"));
        hs.setLocation((String) highschool.get("location"));
        hs.setRanking((String) highschool.get("ranking"));
        hs.setPriority((String) highschool.get("priority"));
        HighschoolEntranceDetails details = new HighschoolEntranceDetails();
        details.setPercentile("0");
        details.setDuration("0");
        details.setLanguage("Turkish");
        details.setPuan("0");
        details.setQuota("0");
        hs.setDetails(details);
        database.schools.addHighschool(hs);
    }
}
