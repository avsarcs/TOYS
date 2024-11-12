package apply.advisor;

public class AdvisorApplicationModel {
    private String bilkentID;
    private String requestID;

    public String getBilkentID() {
        return bilkentID;
    }

    public AdvisorApplicationModel setBilkentID(String bilkentID) {
        this.bilkentID = bilkentID;
        return this;
    }

    public String getRequestID() {
        return requestID;
    }

    public AdvisorApplicationModel setRequestID(String requestID) {
        this.requestID = requestID;
        return this;
    }
}
