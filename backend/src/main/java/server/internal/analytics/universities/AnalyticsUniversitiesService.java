package server.internal.analytics.universities;

import info.debatty.java.stringsimilarity.SorensenDice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import server.auth.AuthService;
import server.auth.Permission;
import server.dbm.Database;
import server.models.DTO.DTOFactory;
import server.models.schools.University;
import server.models.schools.UniversityTableData;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@Service
public class AnalyticsUniversitiesService {
    @Autowired
    Database database;

    @Autowired
    DTOFactory dto;

    @Autowired
    AuthService authService;    

    public List<Map<String, Object>> getAll(String auth) {

        // check auth
        if (!authService.check(auth, Permission.TOTAL_ANALYTICS_ACCESS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        // get universities
        Map<String, University> universities = database.universities.getUniversities();
        List<Map<String, Object>> response = new ArrayList<>();
        
        // return universities
        response.addAll(
                universities.entrySet().stream().map(uni -> {
                    Map<String, Object> data = dto.university(uni.getValue());
                    data.put("id", uni.getKey());
                    return data;
                }).toList()
        );
        return response;
    }

    public List<Map<String, Object>> getSimpleAll(String auth){
        // check auth
        if (!authService.check(auth, Permission.TOTAL_ANALYTICS_ACCESS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        // get universities
        Map<String, University> universities = database.universities.getUniversities();
        List<Map<String, Object>> response = new ArrayList<>();
        
        // return universities
        response.addAll(
                universities.entrySet().stream().map(uni -> dto.simpleUniversity(uni.getValue())).toList()
        );
        return response;
    }

    public List<Map<String, Object>> getRivals(String auth){
        // check auth
        if (!authService.check(auth, Permission.TOTAL_ANALYTICS_ACCESS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        // get universities
        Map<String, University> universities = database.universities.getUniversities();
        List<Map<String, Object>> response = new ArrayList<>();
        
        // filter and return rival universities
        response.addAll(
            universities.entrySet().stream()
                .filter(uni -> uni.getValue().getIs_rival())
                .map(uni -> dto.university(uni.getValue()))
                .toList()
        );

        return response;
    }

    public List<String> getDepartments(String auth, String university_id){
        // check auth
        if (!authService.check(auth, Permission.TOTAL_ANALYTICS_ACCESS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        // get university
        University university = database.universities.getUniversity(university_id);
        List<String> response = new ArrayList<>();
        
        // return departments
        response.addAll(
            university.getDepartments().stream()
                .map(department -> dto.department(department))
                .toList()
        );

        return response;
    }

    public Map<String, Object> getDetails(String auth, String university_id, String department_name){
        // check auth
        if (!authService.check(auth, Permission.TOTAL_ANALYTICS_ACCESS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }


        // TODO: FIX
        // get university
        University university = database.universities.getUniversity(university_id);
        Map<String, Object> response = new HashMap<>();

        SorensenDice alg = new SorensenDice();

        // return department details
        university.getDepartments().stream()
            .filter(department -> alg.similarity(department.getName().toLowerCase(), department_name.toLowerCase()) > 0.8)
                .forEach( dep -> {
                    dep.getYears().forEach(
                            year -> {
                                if (!response.containsKey(year.getYear())) {
                                    response.put(year.getYear(), new ArrayList<Map<String, Object>>());
                                }

                                List<Map<String,Object>> data = (List<Map<String, Object>>) response.get(year.getYear());
                                if (data == null) {
                                    data = new ArrayList<>();
                                }
                                if (dep.getScholarship() == null) {
                                    System.out.println("scholarship is null");
                                }
                                if (year.getTable_data() == null) {
                                    System.out.println("table data is null");
                                }
                                if (year.getTable_data().getBest_rank() == null) {
                                    System.out.println("best rank is null");
                                }
                                if (year.getTable_data().getBase_lastguy_rank() == null) {
                                    System.out.println("base last guy rank is null");
                                }
                                data.add(
                                    Map.of(
                                        "title", dep.getScholarship(),
                                        "min", year.getTable_data().getBest_rank(),
                                        "max", year.getTable_data().getBase_lastguy_rank()
                                    )
                                );

                                response.put(year.getYear(), data);
                            }
                    );
                });

        return response;
    }

    public void setRival(String university_id, String value_to_set, String auth){
        // check auth
        if (!authService.check(auth, Permission.TOTAL_ANALYTICS_ACCESS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        // get university
        University university = database.universities.getUniversity(university_id);
        if (university == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "University not found!");
        }
        
        // set rival
        boolean is_rival = false;
        try {
            is_rival = Boolean.parseBoolean(value_to_set);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        System.out.println("Setting rivalry status of " + university_id + " to " + is_rival);
        database.universities.updateUniversityRivalry(university_id, is_rival);
    }
}
