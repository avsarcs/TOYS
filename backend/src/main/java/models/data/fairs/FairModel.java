package models.data.fairs;

import enums.status.FAIR_STATUS;
import models.data.guides.GuideModel;

import java.util.List;

public class FairModel {
    private String id;
    private String notes;
    private List<GuideModel> guides;
    private FAIR_STATUS status;
}
