package server.models.schools;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class UniversityDepartment {
    public String name;
    public String id;
    public String scholarship;

    public List<UniversityDepartmentYear> years;

    public static UniversityDepartment fromMap(Map<String, Object> map) {
        return new UniversityDepartment(map);
    }
    protected UniversityDepartment(Map<String, Object> map) {
        this.name = (String) map.get("name");
        this.id = (String) map.get("id");
        this.scholarship = (String) map.get("scholarship");
        this.years = new ArrayList<>();
        try {
            years = ((List<Map<String, Object>>) map.get("years")).stream().map(UniversityDepartmentYear::fromMap).toList();
        } catch (Exception E) {
            System.out.println(E.getMessage());
            System.out.println(E.getCause());
            E.printStackTrace();
            System.out.println("Error in UniversityDepartment.java");
        }
    }

    public UniversityDepartment (String name, String id, String scholarship) {
        this.name = name;
        this.id = id;
        this.scholarship = scholarship;
    }
    public UniversityDepartment() {}

    public static UniversityDepartment getDefault() {
        return new UniversityDepartment("default name", "-1", "N/A");
    }

    public String getId() {
        return id;
    }


    public UniversityDepartment setId(String id) {
        this.id = id;
        return this;
    }

    public String getScholarship() {
        return scholarship;
    }

    public UniversityDepartment setScholarship(String scholarship) {
        this.scholarship = scholarship;
        return this;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<UniversityDepartmentYear> getYears() {
        return years;
    }

    public void setYears(List<UniversityDepartmentYear> years) {
        this.years = years;
    }
}
