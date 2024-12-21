package server.internal.analytics.universities;

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
                universities.entrySet().stream().map(uni -> dto.university(uni.getValue())).toList()
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

        // get university
        University university = database.universities.getUniversity(university_id);
        Map<String, Object> response = new HashMap<>();
        

        // return department details
        university.getDepartments().stream()
            .filter(department -> department.getName().equals(department_name))
            .forEach(department -> {
                department.getYears().forEach(year -> {
                    List<Map<String, String>> yearDetails = year.getTable_data().entrySet().stream()
                        .map(entry -> {
                            UniversityTableData tableData = (UniversityTableData) entry.getValue();
                            Map<String, String> detailMap = new HashMap<>();
                            detailMap.put("title", department.getScholarship());
                            detailMap.put("min", tableData.getBase_lastguy_rank());
                            detailMap.put("max", tableData.getBest_rank());
                            return detailMap;
                        })
                        .collect(Collectors.toList());
                    response.put(year.getYear(), yearDetails);
                });
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
        
        // set rival
        boolean is_rival = false;
        try {
            is_rival = Boolean.parseBoolean(value_to_set);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        university.setIs_rival(is_rival);
        database.universities.updateUniversityRivalry(university_id, is_rival);
    }
}
