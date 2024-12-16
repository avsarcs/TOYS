package server.models.DTO;

import server.enums.status.TourStatus;

public enum GroupTourStatus {
    AWAITING_CONFIRMATION,
    APPLICANT_WANTS_CHANGE,
    TOYS_WANTS_CHANGE,
    APPROVED,
    REJECTED;

    public static GroupTourStatus fromTourStatus(TourStatus status) {
        switch (status) {
            case AWAITING_CONFIRMATION:
                return AWAITING_CONFIRMATION;
            case AWAITING_CHANGES:
                return APPLICANT_WANTS_CHANGE;
            case CONFIRMED:
                return APPROVED;
            case REJECTED:
                return REJECTED;
            default:
                return null;
        }
    }
}
