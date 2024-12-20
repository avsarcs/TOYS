package server.dbm;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import server.models.payment.HourlyRate;
import java.util.*;

public class DBPaymentService {
    private Firestore firestore;
    private ObjectMapper mapper;

    public DBPaymentService() {
        this.firestore = Database.getFirestoreDatabase();
        this.mapper = Database.getObjectMapper();
    }

    public void addHourlyRate(HourlyRate rate) {
        DocumentReference ref =  firestore.collection("payment").document("timesheet");

        try {
            DocumentSnapshot snapshot = ref.get().get();
            List<Object> rates = ((List<Object>) ((Map<String, Object>) snapshot.getData()).get("rates"));
            rates.add(rate);
            ref.set(mapper.convertValue(
                    Collections.singletonMap("rates", rates),
                    new TypeReference<HashMap<String, Object>>() {}
            ));
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add hourly rate in database.");
        }
    }

    public void setHourlyRates(List<HourlyRate> rates) {
        DocumentReference ref =  firestore.collection("payment").document("timesheet");

        try {
            DocumentSnapshot snapshot = ref.get().get();
            ref.set(mapper.convertValue(
                    Collections.singletonMap("rates", rates),
                    new TypeReference<HashMap<String, Object>>() {}
            ));
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to set hourly rates in database.");
        }
    }



    public List<HourlyRate> getRates() {
        List<HourlyRate> rates = new ArrayList<>();
        DocumentReference ref =  firestore.collection("payment").document("timesheet");
        try {
            DocumentSnapshot snapshot = ref.get().get();
            ((List<Object>) ((Map<String, Object>) snapshot.getData()).get("rates")).forEach(
                    rate -> rates.add(HourlyRate.fromMap((Map<String, Object>) rate))
            );
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to get hourly rates from database.");
        }
        return rates;
    }




}
