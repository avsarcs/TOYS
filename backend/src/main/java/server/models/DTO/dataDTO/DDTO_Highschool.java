package server.models.DTO.dataDTO;

import server.models.schools.Highschool;
import server.models.schools.HighschoolRecord;

public class DDTO_Highschool {
    private String id;
    private String name;
    private String city;
    private long ranking;
    private long priority;

    public static DDTO_Highschool fromHighscholl(Highschool highschool) {
        DDTO_Highschool dto = new DDTO_Highschool();
        dto.setName(highschool.getTitle());
        dto.setCity(highschool.getLocation());
        dto.setCity(highschool.getCity());
        //dto.setRanking(highschool.getRanking());
        //dto.setPriority(highschool.getPriority());
        dto.setId(highschool.getId());
        return dto;
    }

    public void anonimyze() {
        this.priority = 0;
        this.ranking = 0;
    }

    public String getName() {
        return name;
    }

    public DDTO_Highschool setName(String name) {
        this.name = name;
        return this;
    }

    public String getCity() {
        return city;
    }

    public DDTO_Highschool setCity(String city) {
        this.city = city;
        return this;
    }

    public long getRanking() {
        return ranking;
    }

    public DDTO_Highschool setRanking(long ranking) {
        this.ranking = ranking;
        return this;
    }

    public long getPriority() {
        return priority;
    }

    public DDTO_Highschool setPriority(long priority) {
        this.priority = priority;
        return this;
    }

    public String getId() {
        return id;
    }

    public DDTO_Highschool setId(String id) {
        this.id = id;
        return this;
    }
}
