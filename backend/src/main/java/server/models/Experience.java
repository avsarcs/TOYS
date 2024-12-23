package server.models;

import server.enums.ExperienceLevel;

import java.util.List;
import java.util.Map;

public class Experience {
    private ExperienceLevel experienceLevel_level;
    private List<String> previous_events;

    public static Experience nonnull() {
        return new Experience().setPrevious_events(List.of()).setExperienceLevel_level(ExperienceLevel.JUNIOR);
    }

    public Experience() {
    }

    public Experience(Experience other) {
        this.experienceLevel_level = other.experienceLevel_level;
        this.previous_events = other.previous_events;
    }

    public static Experience fromMap(Map<String,Object> map) {
        return new Experience()
                .setExperienceLevel_level(ExperienceLevel.valueOf((String) map.get("experienceLevel_level")))
                .setPrevious_events((List<String>) map.get("previous_events"));
    }
    public static Experience getDefault() {
        return new Experience()
                .setExperienceLevel_level(ExperienceLevel.JUNIOR)
                .setPrevious_events(List.of("123", "321"));
    }
    public ExperienceLevel getExperienceLevel_level() {
        return experienceLevel_level;
    }

    public Experience setExperienceLevel_level(ExperienceLevel experienceLevel_level) {
        this.experienceLevel_level = experienceLevel_level;
        return this;
    }

    public List<String> getPrevious_events() {
        return previous_events;
    }

    public Experience setPrevious_events(List<String> previous_events) {
        this.previous_events = previous_events;
        return this;
    }
}
