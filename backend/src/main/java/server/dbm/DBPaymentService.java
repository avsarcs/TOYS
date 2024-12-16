package server.dbm;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import server.models.payment.DTO_HourlyRate;
import server.models.payment.DTO_MoneyForGuide;
import server.models.payment.DTO_MoneyForTour;

import java.util.*;

public class DBPaymentService {
    private Firestore firestore;
    private ObjectMapper mapper;

    public DBPaymentService() {
        this.firestore = Database.getFirestoreDatabase();
        this.mapper = Database.getObjectMapper();
    }
    public void addHourlyRate(DTO_HourlyRate rate) {
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

    public void setHourlyRates(List<DTO_HourlyRate> rates) {
        DocumentReference ref =  firestore.collection("payment").document("timesheet");

        try {
            DocumentSnapshot snapshot = ref.get().get();
            ref.set(mapper.convertValue(
                    Collections.singletonMap("records", rates),
                    new TypeReference<HashMap<String, Object>>() {}
            ));
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to set hourly rates in database.");
        }
    }



    public List<DTO_HourlyRate> getRates() {
        List<DTO_HourlyRate> rates = new ArrayList<>();
        DocumentReference ref =  firestore.collection("payment").document("timesheet");
        try {
            DocumentSnapshot snapshot = ref.get().get();
            ((List<Object>) ((Map<String, Object>) snapshot.getData()).get("rates")).forEach(
                    rate -> rates.add(DTO_HourlyRate.fromMap((Map<String, Object>) rate))
            );
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to get hourly rates from database.");
        }
        return rates;
    }

    public Map<String, DTO_MoneyForGuide> getGuidePaymentStates(String id) {
        Map<String, DTO_MoneyForGuide> data = new HashMap<>();
        DocumentReference ref =  firestore.collection("payment").document("guides");

        try {
            DocumentSnapshot snapshot = ref.get().get();

            if (!id.isBlank()) {
                if (!snapshot.getData().containsKey(id)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Guide not found!");
                }
                data.put(id, DTO_MoneyForGuide.fromMap((Map<String, Object>) snapshot.getData().get(id)));
            } else {
                snapshot.getData().entrySet().stream().forEach(
                        e -> data.put(e.getKey(), DTO_MoneyForGuide.fromMap((Map<String, Object>) e.getValue()))
                );
            }

            return data;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to get guide payment states from database.");
        }
        return data;
    }

    public Map<String, DTO_MoneyForTour> getTourPaymentStates(String id) {
        Map<String, DTO_MoneyForTour> data = new HashMap<>();
        DocumentReference ref =  firestore.collection("payment").document("tours");

        try {
            DocumentSnapshot snapshot = ref.get().get();

            if (!id.isBlank()) {
                if (!snapshot.getData().containsKey(id)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tour not found!");
                }
                data.put(id, DTO_MoneyForTour.fromMap((Map<String, Object>) snapshot.getData().get(id)));
            } else {
                snapshot.getData().entrySet().stream().forEach(
                        e -> data.put(e.getKey(), DTO_MoneyForTour.fromMap((Map<String, Object>) e.getValue()))
                );
            }

            return data;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to get tour payment states from database.");
        }
        return data;
    }

}
