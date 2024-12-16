package server.models.DTO.dataDTO;

import java.util.List;
import java.util.Map;

public class DDTO_HighschoolDetails {
    private long priority;
    private long ranking;
    private String city;

    private List<DDTO_HighschoolTour> tours;

    private List<DDTO_YearlyStudentCount> students;

    public static DDTO_HighschoolDetails fromMap(Map<String, Object> map) {
        DDTO_HighschoolDetails dto = new DDTO_HighschoolDetails();
        dto.setPriority((long) map.get("priority"));
        dto.setRanking((long) map.get("ranking"));
        dto.setCity((String) map.get("city"));
        dto.setTours(
                ((List<Object>) map.get("tours")).stream().map(tourOBJ -> DDTO_HighschoolTour.fromMap((Map<String, Object>)tourOBJ)).toList()
        );

        dto.setStudents(
                ((List<Object>) map.get("students")).stream().map(studentOBJ -> DDTO_YearlyStudentCount.fromMap((Map<String, Object>)studentOBJ)).toList()
        );

        return dto;
    }

    public long getPriority() {
        return priority;
    }

    public DDTO_HighschoolDetails setPriority(long priority) {
        this.priority = priority;
        return this;
    }

    public long getRanking() {
        return ranking;
    }

    public DDTO_HighschoolDetails setRanking(long ranking) {
        this.ranking = ranking;
        return this;
    }

    public String getCity() {
        return city;
    }

    public DDTO_HighschoolDetails setCity(String city) {
        this.city = city;
        return this;
    }

    public List<DDTO_HighschoolTour> getTours() {
        return tours;
    }

    public DDTO_HighschoolDetails setTours(List<DDTO_HighschoolTour> tours) {
        this.tours = tours;
        return this;
    }

    public List<DDTO_YearlyStudentCount> getStudents() {
        return students;
    }

    public DDTO_HighschoolDetails setStudents(List<DDTO_YearlyStudentCount> students) {
        this.students = students;
        return this;
    }
}

