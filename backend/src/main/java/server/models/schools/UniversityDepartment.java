package server.models.schools;

import java.util.List;

public class UniversityDepartment {
    public String name;
    public long id;
    public List<UniversityDepartmentYear> years;

    public UniversityDepartment (String name, long id) {
        this.name = name;
        this.id = id;
    }
    public UniversityDepartment() {}

    public static UniversityDepartment getDefault() {
        return new UniversityDepartment("default name", -1);
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

    public List<UniversityDepartmentYear> getYears() {
        return years;
    }

    public void setYears(List<UniversityDepartmentYear> years) {
        this.years = years;
    }
}
