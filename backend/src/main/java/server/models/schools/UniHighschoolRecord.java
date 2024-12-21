package server.models.schools;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UniHighschoolRecord {
    @JsonProperty("school")
    private String school_name;
    private long total;
    private long new_graduates;
    private long previous_graduates;

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
