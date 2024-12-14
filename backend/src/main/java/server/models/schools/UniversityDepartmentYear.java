package server.models.schools;

import java.util.Map;

public class UniversityDepartmentYear {
    public Map<String, String> hs_data;
    public long year;
    public Map<String, Object> table_data;
    public Map<String, Object> city_data;
    public long id;

    public UniversityDepartmentYear(long year, long id) {
        this.year = year;
        this.id = id;
    }
    public UniversityDepartmentYear() {}
    public static UniversityDepartmentYear getDefault() {
        return new UniversityDepartmentYear(-1, -1);
    }

}
