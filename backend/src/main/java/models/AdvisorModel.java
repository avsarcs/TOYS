package models;

import apply.advisor.AdvisorApplicationModel;
import auth.UserModel;

import java.time.DayOfWeek;

public class AdvisorModel extends UserModel {
    private DayOfWeek responsibleFor;

    private AdvisorApplicationModel application;

    public AdvisorApplicationModel getApplication() {
        return application;
    }

    public AdvisorModel setApplication(AdvisorApplicationModel application) {
        this.application = application;
        return this;
    }

    public DayOfWeek getResponsibleFor() {
        return responsibleFor;
    }

    public AdvisorModel setResponsibleFor(DayOfWeek responsibleFor) {
        this.responsibleFor = responsibleFor;
        return this;
    }
}
