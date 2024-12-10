package server.scraperModels;

import java.util.List;

public class UniversityModel {
    public String university_type;
    public String name;
    public long id;
    public List<DepartmentModel> departments;
    public String url;

    public UniversityModel(String university_type, String name, long id, List<DepartmentModel> departments, String url) {
        this.university_type = university_type;
        this.name = name;
        this.id = id;
        this.departments = departments;
        this.url = url;
    }
}
