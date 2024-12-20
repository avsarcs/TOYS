package server.models.schools;

public class CityData {
    private String student_count;
    private String percentage;


    public String getStudent_count() {
        return student_count;
    }

    public CityData setStudent_count(String student_count) {
        this.student_count = student_count;
        return this;
    }

    public String getPercentage() {
        return percentage;
    }

    public CityData setPercentage(String percentage) {
        this.percentage = percentage;
        return this;
    }
}
