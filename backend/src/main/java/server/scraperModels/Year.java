package server.scraperModels;

import java.util.Map;

public class Year {
    public Map<String, String> hs_data;
    public long year;
    public Map<String, Object> table_data;
    public Map<String, Object> city_data;
    public long id;

    public Year(long year, long id) {
        this.year = year;
        this.id = id;
    }
}
