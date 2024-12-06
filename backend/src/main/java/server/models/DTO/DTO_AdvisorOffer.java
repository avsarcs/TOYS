package server.models.DTO;

import server.mailService.mailTypes.Status;
import server.models.review.ReviewResponse;
import server.models.time.ZTime;

public class DTO_AdvisorOffer {
    private String offer_made_to;
    private String status;
    private ZTime offer_date;
    private ZTime response_date;
    private String rejection_reason;


    public String getOffer_made_to() {
        return offer_made_to;
    }

    public DTO_AdvisorOffer setOffer_made_to(String offer_made_to) {
        this.offer_made_to = offer_made_to;
        return this;
    }

    public String getStatus() {
        return status;
    }

    public DTO_AdvisorOffer setStatus(String status) {
        this.status = status;
        return this;
    }

    public ZTime getOffer_date() {
        return offer_date;
    }

    public DTO_AdvisorOffer setOffer_date(ZTime offer_date) {
        this.offer_date = offer_date;
        return this;
    }

    public ZTime getResponse_date() {
        return response_date;
    }

    public DTO_AdvisorOffer setResponse_date(ZTime response_date) {
        this.response_date = response_date;
        return this;
    }

    public String getRejection_reason() {
        return rejection_reason;
    }

    public DTO_AdvisorOffer setRejection_reason(String rejection_reason) {
        this.rejection_reason = rejection_reason;
        return this;
    }
}
