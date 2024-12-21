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
            case RECEIVED:
                return AWAITING_CONFIRMATION;
            case PENDING_MODIFICATION:
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
