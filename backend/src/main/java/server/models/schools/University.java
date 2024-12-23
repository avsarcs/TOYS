package server.models.schools;

import org.checkerframework.checker.units.qual.A;

import java.util.ArrayList;
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

    protected University(Map<String, Object> map) {
        this.university_type = (String) map.get("university_type");
        this.name = (String) map.get("name");
        this.id = (String) map.get("id");
        this.departments = new ArrayList<>();
        try {
            departments = ((List<Map<String, Object>>) map.get("departments")).stream().map(UniversityDepartment::fromMap).toList();
        } catch (Exception E) {
            E.printStackTrace();
            System.out.println("Error in University.java");
        }
        this.url = (String) map.get("url");
        this.city = (String) map.get("city");
        this.is_rival = (boolean) map.get("is_rival");
    }

    public static University fromSource(Map<String, Object> map) {
        University uni = new University();
        uni.university_type = (String) map.get("university_type");
        uni.name = (String) map.get("name");
        uni.id = (String) map.get("id");
        uni.departments = new ArrayList<>();
        ((List<Map<String, Object>>) map.get("departments")).forEach(
                m -> {
                    uni.departments.add(UniversityDepartment.fromSource(m));
                }
        );
        uni.url = (String) map.get("url");
        uni.city = (String) map.get("city");
        try {
            uni.is_rival = (Boolean) map.get("is_rival");
        } catch (Exception e) {
            try {
                uni.is_rival = (boolean) map.get("is_rival");
            } catch (Exception e1) {
                try {
                    uni.is_rival = Boolean.valueOf((String) map.get("is_rival"));
                } catch (Exception e2) {
                    e.printStackTrace();
                    uni.is_rival = false;
                    System.out.println("Error in University.java");
                }
            }
        }
        return uni;
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
