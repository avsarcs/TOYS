package models;

import auth.UserModel;

import java.time.DayOfWeek;

public class AdvisorModel extends UserModel {
    private DayOfWeek responsibleFor;

    public DayOfWeek getResponsibleFor() {
        return responsibleFor;
    }

    public AdvisorModel setResponsibleFor(DayOfWeek responsibleFor) {
        this.responsibleFor = responsibleFor;
        return this;
    }
}
