package server.models.schools;

import java.util.List;

public class UniversityDepartment {
    public String name;
    public String id;
    public String scholarship;

    public List<UniversityDepartmentYear> years;

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
