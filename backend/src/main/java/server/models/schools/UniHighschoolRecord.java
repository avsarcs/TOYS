package server.models.schools;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public class UniHighschoolRecord {
    @JsonProperty("school")
    private String school_name;
    private long total;
    private long new_graduates;
    private long previous_graduates;

    protected UniHighschoolRecord(Map<String, Object> map) {
        this.school_name = (String) map.get("school");
        this.total = (long) map.get("total");
        this.new_graduates = (long) map.get("new_graduates");
        this.previous_graduates = (long) map.get("previous_graduates");
    }

    public static UniHighschoolRecord fromMap(Map<String, Object> map) {
        return new UniHighschoolRecord(map);
    }

    public String getSchool_name() {
        return school_name;
    }

    public UniHighschoolRecord setSchool_name(String school_name) {
        this.school_name = school_name;
        return this;
    }

    public long getTotal() {
        return total;
    }

    public UniHighschoolRecord setTotal(long total) {
        this.total = total;
        return this;
    }

    public long getNew_graduates() {
        return new_graduates;
    }

    public UniHighschoolRecord setNew_graduates(long new_graduates) {
        this.new_graduates = new_graduates;
        return this;
    }

    public long getPrevious_graduates() {
        return previous_graduates;
    }

    public UniHighschoolRecord setPrevious_graduates(long previous_graduates) {
        this.previous_graduates = previous_graduates;
        return this;
    }
}
