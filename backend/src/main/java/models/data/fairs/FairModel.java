package models.data.fairs;

import apply.fair.FairApplicationModel;
import enums.status.FAIR_STATUS;
import models.Assignable;
import models.DateWrapper;
import models.data.guides.GuideModel;
import respond.tours.AcceptDeny;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

public class FairModel extends Assignable {
    private FairApplicationModel invitation;
    private FAIR_STATUS status;

    private DateWrapper applied_at;

    private List<GuideModel> guides;
    private String id;
    private String notes;

    public static FairModel fromInvitation(FairApplicationModel invitation) {
        return new FairModel()
                .setInvitation(invitation)
                .setStatus(FAIR_STATUS.INVITED)
                .setId();
    }

    public FairModel() {
    }

    public void accept_reject(AcceptDeny response) {
        if (response == AcceptDeny.ACCEPT) {
            setStatus(FAIR_STATUS.ACCEPTED);
        } else {
            setStatus(FAIR_STATUS.REJECTED);
        }
    }

    public static FairModel fromMap(Map<String, Object> map) {
        FairModel fair = new FairModel();
        fair.setId((String) map.get("id"));
        fair.setStatus(FAIR_STATUS.valueOf((String) map.get("status")));
        fair.setApplied_at(new DateWrapper(ZonedDateTime.parse((String) map.get("accepted_date"))));
        fair.setGuides((List<GuideModel>) map.get("guides"));
        fair.setNotes((String) map.get("notes"));
        return fair;
    }

    public DateWrapper getApplied_at() {
        return applied_at;
    }

    public FairModel setApplied_at(DateWrapper applied_at) {
        this.applied_at = applied_at;
        return this;
    }

    public FairModel(FairApplicationModel invitation, FAIR_STATUS status, DateWrapper applied_at, List<GuideModel> guides, String id, String notes) {
        this.invitation = invitation;
        this.status = status;
        this.applied_at = applied_at;
        this.guides = guides;
        this.id = id;
        this.notes = notes;
    }

    public FairApplicationModel getInvitation() {
        return invitation;
    }

    public FairModel setInvitation(FairApplicationModel invitation) {
        this.invitation = invitation;
        return this;
    }

    public FAIR_STATUS getStatus() {
        return status;
    }

    public FairModel setStatus(FAIR_STATUS status) {
        this.status = status;
        return this;
    }

    public List<GuideModel> getGuides() {
        return guides;
    }

    public FairModel setGuides(List<GuideModel> guides) {
        this.guides = guides;
        return this;
    }

    public String getId() {
        return id;
    }

    private String generateId() {
        return "fair_" + System.currentTimeMillis();
    }

    public FairModel setId() {
        this.id = generateId();
        return this;
    }

    public FairModel setId(String id) {
        this.id = id;
        return this;
    }

    public String getNotes() {
        return notes;
    }

    public FairModel setNotes(String notes) {
        this.notes = notes;
        return this;
    }
}