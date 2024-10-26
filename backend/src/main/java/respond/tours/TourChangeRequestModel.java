package respond.tours;

import enums.status.TOUR_CHANGE_REQUEST_STATUS;

import java.util.UUID;

public class TourChangeRequestModel {
    private String idt;
    private TOUR_CHANGE_REQUEST_STATUS status;

    public static TourChangeRequestModel formRequest()
    {
        return new TourChangeRequestModel(formIdt(), TOUR_CHANGE_REQUEST_STATUS.PENDING);
    }

    private static String formIdt() {
        return System.currentTimeMillis() + "-" + UUID.randomUUID();
    }
    public TourChangeRequestModel(String idt, TOUR_CHANGE_REQUEST_STATUS status) {
        this.idt = idt;
        this.status = status;
    }

    public String getIdt() {
        return idt;
    }

    public TourChangeRequestModel setIdt(String idt) {
        this.idt = idt;
        return this;
    }

    public TOUR_CHANGE_REQUEST_STATUS getStatus() {
        return status;
    }

    public TourChangeRequestModel setStatus(TOUR_CHANGE_REQUEST_STATUS status) {
        this.status = status;
        return this;
    }
}
