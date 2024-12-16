package server.models.schools;

import java.util.List;
import java.util.Map;

public class University {
    public String university_type;
    public String name;
    public long id;
    public List<UniversityDepartment> departments;
    public String url;

    public University(String university_type, String name, long id, List<UniversityDepartment> departments, String url) {
        this.university_type = university_type;
        this.name = name;
        this.id = id;
        this.departments = departments;
        this.url = url;
    }

    protected University(Map<String, Object> map) {
        this.university_type = (String) map.get("university_type");
        this.name = (String) map.get("name");
        this.id = (long) map.get("id");
        this.departments = (List<UniversityDepartment>) map.get("departments");
        this.url = (String) map.get("url");
    }

    public static University fromMap(Map<String, Object> map) {
        return new University(map);
    }

    public University() {}

    public static University getDefault() {
        return new University("default univesity type", "default university name", -1, List.of(UniversityDepartment.getDefault()), "default url");
    }
    public String getUniversity_type() {
        return university_type;
    }

    public void setUniversity_type(String university_type) {
        this.university_type = university_type;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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
