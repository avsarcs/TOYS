package server.models.schools;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.checkerframework.checker.units.qual.A;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UniversityDepartmentYear {
    public String year;
    public String id;
    @JsonProperty("hs_data")
    public List<UniHighschoolRecord> highschool_attendee_count;
    public UniversityTableData table_data;
    public Map<String, CityData> city_data;

    public static UniversityDepartmentYear fromMap(Map<String, Object> map) {
        return new UniversityDepartmentYear(map);
    }

    public static UniversityDepartmentYear fromSource(Map<String, Object> map) {
        UniversityDepartmentYear uni = new UniversityDepartmentYear();
        uni.year = ((Number) map.get("year")).toString();
        uni.id = (String) map.get("id");
        uni.highschool_attendee_count = new ArrayList<>();
        ((List<Map<String, Object>>) map.get("hs_data")).forEach(
                m -> {
                    uni.highschool_attendee_count.add(UniHighschoolRecord.fromMap(m));
                }
        );
        uni.table_data = UniversityTableData.fromSource((Map<String, Object>) map.get("table_data"));
        uni.city_data = new HashMap<>();
        ((Map<String, Object>)map.get("city_data")).forEach((k, v) -> {
            uni.city_data.put(k, CityData.fromMap((Map<String, Object>) v));
        });
        return uni;
    }

    protected UniversityDepartmentYear(Map<String, Object> map) {
        try {
            this.year = (String) map.get("year");
        } catch (Exception E) {
            this.year = map.get("year") + "";
        }
        this.id = (String) map.get("id");
        this.highschool_attendee_count = new ArrayList<>();
        try {
            this.highschool_attendee_count = ((List<Map<String, Object>>) map.get("hs_data")).stream().map(UniHighschoolRecord::fromMap).toList();
        } catch (Exception E) {
            E.printStackTrace();
            System.out.println("Error in UniversityDepartmentYear.java");
        }
        this.table_data = UniversityTableData.fromMap((Map<String, Object>) map.get("table_data"));
        this.city_data = new HashMap<>();
        ((Map<String, Object>)map.get("city_data")).forEach((k, v) -> {
            this.city_data.put(k, CityData.fromMap((Map<String, Object>) v));
        });
    }

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

    public UniversityTableData getTable_data() {
        return table_data;
    }

    public UniversityDepartmentYear setTable_data(UniversityTableData table_data) {
        this.table_data = table_data;
        return this;
    }

    public Map<String, CityData> getCity_data() {
        return city_data;
    }

    public UniversityDepartmentYear setCity_data(Map<String, CityData> city_data) {
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
