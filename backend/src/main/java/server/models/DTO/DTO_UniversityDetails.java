package server.models.DTO;

import info.debatty.java.stringsimilarity.SorensenDice;
import server.models.schools.University;
import server.models.schools.UniversityDepartment;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DTO_UniversityDetails {
    private Map<String, List<DTO_UniversityYearDetails>> details;

    public DTO_UniversityDetails() {};

    static public DTO_UniversityDetails fromUniversity(University university, String departmentName) throws Exception {
        DTO_UniversityDetails _details = new DTO_UniversityDetails();
        SorensenDice alg = new SorensenDice();
        UniversityDepartment department = null;
        try {
             department = university.departments.stream().filter(
                    dep -> alg.similarity(dep.getName().toLowerCase(), departmentName.toLowerCase()) > 0.90
            ).findFirst().get();
        } catch (Exception E) {
            throw new Exception("University doesn't contain such department!");
        }

        Map<String, List<DTO_UniversityYearDetails>> map = new HashMap<>();

       /* department.getYears().forEach(
                year -> map.putIfAbsent(
                        Long.toString(year.year),
                        DTO_UniversityYearDetails.
                )
        );*/
        return _details;
    }

    public Map<String, List<DTO_UniversityYearDetails>> getDetails() {
        return details;
    }

    public DTO_UniversityDetails setDetails(Map<String, List<DTO_UniversityYearDetails>> details) {
        this.details = details;
        return this;
    }
}
