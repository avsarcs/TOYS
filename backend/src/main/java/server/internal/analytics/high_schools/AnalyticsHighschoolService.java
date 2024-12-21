package server.internal.analytics.high_schools;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.auth.JWTService;
import server.auth.Permission;
import server.auth.PermissionMap;
import server.dbm.Database;
import server.models.DTO.dataDTO.DDTO_Highschool;
import server.models.DTO.dataDTO.DDTO_HighschoolDetails;
import server.models.DTO.dataDTO.DDTO_HighschoolTour;
import server.models.DTO.dataDTO.DDTO_YearlyStudentCount;
import server.models.events.TourRegistry;
import server.models.review.ReviewRecord;
import server.models.schools.Highschool;
import server.models.schools.UniHighschoolRecord;
import server.models.schools.UniversityDepartment;
import server.models.schools.UniversityDepartmentYear;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class AnalyticsHighschoolService {

    @Autowired
    Database database;

    public List<DDTO_Highschool> getAll(String auth) {
        List<Highschool> highschools =  database.schools.getHighschools();
        List<DDTO_Highschool> ddto_highschools = new ArrayList<>();

        ddto_highschools.addAll(highschools.stream().map(hs -> DDTO_Highschool.fromHighscholl(hs)).toList());

        if (!JWTService.getSimpleton().isValid(auth)) {
            ddto_highschools.forEach(hs -> hs.anonimyze());
        }
        return ddto_highschools;
    }

    public DDTO_HighschoolDetails getDetails(String auth, String high_school_id) {
        if (!JWTService.getSimpleton().isValid(auth)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You need to login!");
        }

        if (!PermissionMap.hasPermission(JWTService.getSimpleton().getUserRole(auth), Permission.TOTAL_ANALYTICS_ACCESS)) {
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

        for (UniversityDepartment department : database.universities.getUniversities().get("bilkent").getDepartments()) {
            for (UniversityDepartmentYear year : department.getYears()) {
                for (UniHighschoolRecord data : year.highschool_attendee_count) {

                    boolean added = false;
                    for (DDTO_YearlyStudentCount count : counts) {
                        if (count.getYear() == year.year) {
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

        List<Map.Entry<String, TourRegistry>> tours = database.tours.fetchTours().entrySet().stream().filter(
                e -> e.getValue().getApplicant().getSchool().equals(high_school_id)
        ).toList();

        List<DDTO_HighschoolTour> tourDetails =  tours.stream().map(e -> new DDTO_HighschoolTour()
                .setTour_id(e.getValue().getTour_id())
                .setAttendance(e.getValue().getExpected_souls())
                .setContact_email(e.getValue().getApplicant().getContact_info().getEmail())
                .setDate(e.getValue().getAccepted_time())
                .setReview_rating(0)
        ).toList();

        //List<String> tourIDsForThisSchool = database.tours.fetchTours().entrySet();.

        Map<String, ReviewRecord> reviewRecord = database.reviews.getReviewRecords();
       /* database.reviews.getReviewRecords().entrySet().stream().filter(
                record -> record.getValue().getEvent_id()
        )*/


        return details;
    }

}
