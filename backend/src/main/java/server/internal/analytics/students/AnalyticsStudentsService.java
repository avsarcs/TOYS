package server.internal.analytics.students;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import info.debatty.java.stringsimilarity.SorensenDice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import server.models.schools.CityData;
import server.models.schools.HighschoolRecord;
import server.models.schools.University;
import server.auth.AuthService;
import server.auth.Permission;
import server.dbm.Database;
import server.models.schools.UniversityTableData;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsStudentsService {

    @Autowired
    private AuthService authService;

    @Autowired
    private Database database;

    public Map<String, Integer> getRankings() throws IOException {
        Map<String, Integer> rankings = new HashMap<>();
        ObjectMapper objectMapper = new ObjectMapper();

        // Relative path may be wrong, please check
        JsonNode rootNode = objectMapper.readTree(Files.readAllBytes(Paths.get("data/top_ten_high_schools.json")));

        Iterator<Map.Entry<String, JsonNode>> fields = rootNode.fields();
        while (fields.hasNext()) {
            Map.Entry<String, JsonNode> field = fields.next();
            JsonNode yearsNode = field.getValue();
            Iterator<Map.Entry<String, JsonNode>> years = yearsNode.fields();
            while (years.hasNext()) {
                Map.Entry<String, JsonNode> yearEntry = years.next();
                String year = yearEntry.getKey();
                JsonNode schoolsArray = yearEntry.getValue();
                int totalStudents = 0;
                for (JsonNode school : schoolsArray) {
                    totalStudents += school.get("total").asInt();
                }
                rankings.merge(year, totalStudents, Integer::sum);
            }
        }

        return rankings;
    }

    public Map<String, Object> getAll(String auth) {
        if (!authService.check(auth, Permission.TOTAL_ANALYTICS_ACCESS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have enough permissions!");
        }

        University bilkent = database.universities.getUniversity("bilkent");
        Map<String, Long> highSchoolCounts = new HashMap<>();
        Map<String, Long> cityCounts = new HashMap<>();
        long[] totalStudentCount = {0};
        long[] totalCityCount = {0};

        bilkent.getDepartments().forEach(department ->
                department.getYears().forEach(year -> {
                    year.getHighschool_attendee_count().forEach(record -> {
                        highSchoolCounts.merge(record.getSchool_name(), record.getTotal(), Long::sum);
                        totalStudentCount[0] += record.getTotal();
                    });
                    year.getCity_data().forEach((cityName, cityData) -> {
                        cityCounts.merge(cityName, Long.parseLong(cityData.getStudent_count()), Long::sum);
                        totalCityCount[0] += Long.parseLong(cityData.getStudent_count());
                    });
                })
        );

        List<Map.Entry<String, Long>> sortedHighSchools = highSchoolCounts.entrySet()
                .stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .toList();

        Map<String, Long> topHighSchools = new LinkedHashMap<>();
        long topFiveTotal = 0;
        for (int i = 0; i < Math.min(5, sortedHighSchools.size()); i++) {
            Map.Entry<String, Long> entry = sortedHighSchools.get(i);
            topHighSchools.put(entry.getKey(), entry.getValue());
            topFiveTotal += entry.getValue();
        }

        long otherHighSchoolsTotal = totalStudentCount[0] - topFiveTotal;
        topHighSchools.put("Diğer", otherHighSchoolsTotal);

        List<Map.Entry<String, Long>> sortedCities = cityCounts.entrySet()
                .stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .collect(Collectors.toList());

        Map<String, Long> topCities = new LinkedHashMap<>();
        long topFiveCityTotal = 0;
        for (int i = 0; i < Math.min(5, sortedCities.size()); i++) {
            Map.Entry<String, Long> entry = sortedCities.get(i);
            topCities.put(entry.getKey(), entry.getValue());
            topFiveCityTotal += entry.getValue();
        }

        long otherCitiesTotal = totalCityCount[0] - topFiveCityTotal;
        topCities.put("Diğer", otherCitiesTotal);
        Map<String, Integer> rankings = new HashMap<>();
        try {
            rankings = getRankings();
        } catch (IOException e) {
            e.printStackTrace();
        }
        ArrayList<String> departments = new ArrayList<>();
        bilkent.getDepartments().forEach(department -> departments.add(department.getName()));
        Map<String, Object> response = new HashMap<>();
        response.put("high_schools", topHighSchools);
        response.put("cities", topCities);
        response.put("rankings", rankings);
        response.put("departments", departments);

        return response;
    }


    public Map<String, Object> getDepartments(String auth, String department) {
        if (!authService.check(auth, Permission.TOTAL_ANALYTICS_ACCESS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have enough permissions!");
        }

        University bilkent = database.universities.getUniversity("bilkent");
        SorensenDice sorensenDice = new SorensenDice();
        Map<String, Map<String, Integer>> rankings = new HashMap<>();
        Set<String> yearsSet = new HashSet<>();

        bilkent.getDepartments().stream()
                .filter(dept -> sorensenDice.similarity(dept.getName().toLowerCase(), department.toLowerCase()) > 0.9)
                .forEach(dept -> {
                    dept.getYears().forEach(year -> {
                        String yearStr = year.getYear();
                        yearsSet.add(yearStr);
                        UniversityTableData tableData = year.getTable_data();
                        String scholarship = dept.getScholarship();
                        String bestRank = tableData.getBest_rank().replace(".", ""); // Remove the dot
                        if (!bestRank.isEmpty()) {
                            rankings.computeIfAbsent(yearStr, k -> new HashMap<>())
                                    .put(scholarship, Integer.parseInt(bestRank));
                        } else {
                            // Handle the case where bestRank is empty, if necessary
                            rankings.computeIfAbsent(yearStr, k -> new HashMap<>()).put(scholarship, 0);
                        }
                    });
                });

        // Filter out scholarships and years where all ranking values are 0
        rankings.entrySet().removeIf(entry -> {
            Map<String, Integer> scholarshipMap = entry.getValue();
            boolean allZero = scholarshipMap.values().stream().allMatch(value -> value == 0);
            if (allZero) {
                yearsSet.remove(entry.getKey());
            }
            return allZero;
        });

        List<String> years = new ArrayList<>(yearsSet);
        Collections.sort(years);

        Map<String, Object> response = new HashMap<>();
        response.put("rankings", rankings);
        response.put("years", years);

        return response;
    }

    public Map<String, Object> getDepartmentHighSchools(String auth, String department, String year) {
        if (!authService.check(auth, Permission.TOTAL_ANALYTICS_ACCESS)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You do not have enough permissions!");
        }

        University bilkent = database.universities.getUniversity("bilkent");
        SorensenDice sorensenDice = new SorensenDice();
        Map<String, Map<String, Integer>> highSchoolCounts = new HashMap<>();

        bilkent.getDepartments().stream()
                .filter(dept -> sorensenDice.similarity(dept.getName().toLowerCase(), department.toLowerCase()) > 0.9)
                .forEach(dept -> {
                    dept.getYears().stream()
                            .filter(y -> y.getYear().equals(year))
                            .forEach(y -> {
                                y.getHighschool_attendee_count().forEach(record -> {
                                    String highSchoolName = record.getSchool_name();
                                    String scholarship = dept.getScholarship();
                                    // MAY CAUSE PROBLEMS
                                    int total = (int) record.getTotal();

                                    highSchoolCounts.computeIfAbsent(highSchoolName, k -> new HashMap<>())
                                            .merge(scholarship, total, Integer::sum);
                                });
                            });
                });

        Map<String, Object> response = new HashMap<>();
        response.put("students", highSchoolCounts);

        return response;
    }
}