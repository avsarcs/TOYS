package server.models.DTO.dataDTO;

import java.util.Map;

public class DDTO_YearlyStudentCount {
    private String year;
    private long count;

    public DDTO_YearlyStudentCount(Map<String, Object> map) {
        this.year = (String) map.get("year");
        this.count = (long) map.get("count");
    }

    public DDTO_YearlyStudentCount() {};

    public static DDTO_YearlyStudentCount fromMap(Map<String, Object> map) {
        return new DDTO_YearlyStudentCount(map);
    }

    public String getYear() {
        return year;
    }

    public DDTO_YearlyStudentCount setYear(String year) {
        this.year = year;
        return this;
    }

    public long getCount() {
        return count;
    }

    public DDTO_YearlyStudentCount setCount(long count) {
        this.count = count;
        return this;
    }
}