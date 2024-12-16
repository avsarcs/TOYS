package server.models.DTO;

import server.models.schools.UniversityDepartmentYear;

public class DTO_UniversityYearDetails {
    private String title;
    private String min;
    private String max;



    public static DTO_UniversityYearDetails fromOG(UniversityDepartmentYear reg) {
        DTO_UniversityYearDetails details = new DTO_UniversityYearDetails();


        return details;
    }

    public String getTitle() {
        return title;
    }

    public DTO_UniversityYearDetails setTitle(String title) {
        this.title = title;
        return this;
    }

    public String getMin() {
        return min;
    }

    public DTO_UniversityYearDetails setMin(String min) {
        this.min = min;
        return this;
    }

    public String getMax() {
        return max;
    }

    public DTO_UniversityYearDetails setMax(String max) {
        this.max = max;
        return this;
    }
}
