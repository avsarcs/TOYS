package server.models.schools;

import java.util.Map;

public class CityData {
    private String student_count;
    private String percentage;

    protected CityData(Map<String, Object> map) {
        this.student_count = (String) map.get("student_count");
        this.percentage = (String) map.get("percentage");
    }

    public static CityData fromMap(Map<String, Object> map) {
        return new CityData(map);
    }

    public CityData() {}

    public String getStudent_count() {
        return student_count;
    }

    public CityData setStudent_count(String student_count) {
        this.student_count = student_count;
        return this;
    }

    public String getPercentage() {
        return percentage;
    }

    public CityData setPercentage(String percentage) {
        this.percentage = percentage;
        return this;
    }
}
