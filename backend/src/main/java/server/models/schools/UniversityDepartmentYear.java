package server.models.schools;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

public class UniversityDepartmentYear {
    public String year;
    public String id;
    @JsonProperty("hs_data")
    public List<UniHighschoolRecord> highschool_attendee_count;
    public Map<String, Object> table_data;
    public Map<String, Object> city_data;

    public UniversityDepartmentYear(String year, String id) {
        this.year = year;
        this.id = id;
    }
    public UniversityDepartmentYear() {}
    public static UniversityDepartmentYear getDefault() {
        return new UniversityDepartmentYear("-1", "-1");
    }


    public List<UniHighschoolRecord> getHighschool_attendee_count() {
        return highschool_attendee_count;
    }

    public UniversityDepartmentYear setHighschool_attendee_count(List<UniHighschoolRecord> highschool_attendee_count) {
        this.highschool_attendee_count = highschool_attendee_count;
        return this;
    }

    public Map<String, Object> getTable_data() {
        return table_data;
    }

    public UniversityDepartmentYear setTable_data(Map<String, Object> table_data) {
        this.table_data = table_data;
        return this;
    }

    public Map<String, Object> getCity_data() {
        return city_data;
    }

    public UniversityDepartmentYear setCity_data(Map<String, Object> city_data) {
        this.city_data = city_data;
        return this;
    }

    public String getYear() {
        return year;
    }

    public UniversityDepartmentYear setYear(String year) {
        this.year = year;
        return this;
    }

    public String getId() {
        return id;
    }

    public UniversityDepartmentYear setId(String id) {
        this.id = id;
        return this;
    }
}
