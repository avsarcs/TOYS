package server.models.DTO;

import server.models.schools.University;

public class DTO_SimpleUniversity {
    private String name;
    private String city;
    private boolean is_rival;
    private long id;


    public DTO_SimpleUniversity() {}

    static public DTO_SimpleUniversity fromUniversity(University university) {
        DTO_SimpleUniversity simpleUniversity = new DTO_SimpleUniversity();

        // TODO fix city and is_rival
        simpleUniversity.setCity("No data available");
        simpleUniversity.setIs_rival(false);
        simpleUniversity.setId(university.getId());
        simpleUniversity.setName(university.getName());

        return simpleUniversity;
    }

    public String getName() {
        return name;
    }

    public DTO_SimpleUniversity setName(String name) {
        this.name = name;
        return this;
    }

    public String getCity() {
        return city;
    }

    public DTO_SimpleUniversity setCity(String city) {
        this.city = city;
        return this;
    }

    public boolean isIs_rival() {
        return is_rival;
    }

    public DTO_SimpleUniversity setIs_rival(boolean is_rival) {
        this.is_rival = is_rival;
        return this;
    }

    public long getId() {
        return id;
    }

    public DTO_SimpleUniversity setId(long id) {
        this.id = id;
        return this;
    }
}
