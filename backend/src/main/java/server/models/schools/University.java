package server.models.schools;

import java.util.List;
import java.util.Map;

public class University {
    public boolean is_rival;
    public String university_type;
    public String name;
    public String id;
    public String url;
    public String city;
    public List<UniversityDepartment> departments;
    public UniversityTableData table_data;
    public Map<String, CityData> city_data;
    

    protected University(Map<String, Object> map) {
        this.university_type = (String) map.get("university_type");
        this.name = (String) map.get("name");
        this.id = (String) map.get("id");
        this.departments = (List<UniversityDepartment>) map.get("departments");
        this.url = (String) map.get("url");
        this.city = (String) map.get("city");
    }

    public static University fromMap(Map<String, Object> map) {
        return new University(map);
    }

    public University() {}

    public String getUniversity_type() {
        return university_type;
    }

    public void setUniversity_type(String university_type) {
        this.university_type = university_type;
    }


    public String getId() {
        return id;
    }

    public University setId(String id) {
        this.id = id;
        return this;
    }

    public String getCity() {
        return city;
    }

    public University setCity(String city) {
        this.city = city;
        return this;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<UniversityDepartment> getDepartments() {
        return departments;
    }

    public void setDepartments(List<UniversityDepartment> departments) {
        this.departments = departments;
    }
    public UniversityTableData getTable_data() {
        return table_data;
    }
    public void setTable_data(UniversityTableData table_data) {
        this.table_data = table_data;
    }
    public Map<String, CityData> getCity_data() {
        return city_data;
    }
    public void setCity_data(Map<String, CityData> city_data) {
        this.city_data = city_data;
    }
    public boolean getIs_rival() {
        return is_rival;
    }
    public void setIs_rival(boolean is_rival) {
        this.is_rival = is_rival;
    }
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUid() {
        return String.valueOf(id);
    }
}
