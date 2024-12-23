package server.dbm;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import org.springframework.stereotype.Service;
import server.auth.JWTService;
import server.auth.Passkey;
import server.auth.Permission;
import server.auth.PermissionMap;
import server.models.auth.AuthEntry;
import server.models.time.ZTime;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class DBAuthService {

    private Firestore firestore;
    private ObjectMapper mapper;

    public DBAuthService() {
        this.firestore = Database.getFirestoreDatabase();
        this.mapper = Database.getObjectMapper();
    }


    public void invalidatePasskey(String passkey) {
        DocumentReference reference = firestore.collection("auth").document("passkeys");
        Map<String, Object> data = new HashMap<>();
        try {
            data = (Map<String,Object>) reference.get().get().getData().get("passkeys");

            data.remove(passkey);
            ApiFuture<WriteResult> result = reference.set(
                    mapper.convertValue(
                            Collections.singletonMap("passkeys", data),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );
            System.out.println("Passkey invalidated." + result);

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to invalidate passkey.");
        }
    }

    public void addAuthEntry(AuthEntry entry) {
        try {
            DocumentReference reference = firestore.collection("auth").document("tokens");
            Map<String, Object> tokens = new HashMap<>();

            try {
                tokens = (Map<String, Object>) reference.get().get().getData().get("tokens");
            } catch (Exception E) {}

            tokens.put(entry.getToken(), entry);

            ApiFuture<WriteResult> result = reference.set(
                    mapper.convertValue(
                            Collections.singletonMap("tokens", tokens),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );

            System.out.println("Auth entry added to database." + result.get().getUpdateTime());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add auth entry to database.");
        }
    }

    public void updateToken(AuthEntry entry) {
        try {
            DocumentReference reference = firestore.collection("auth").document("tokens");
            Map<String, Object> tokens = new HashMap<>();

            try {
                tokens = (Map<String, Object>) reference.get().get().getData().get("tokens");
            } catch (Exception E) {}


            tokens.put(entry.getToken(), entry);

            ApiFuture<WriteResult> result = reference.set(
                    mapper.convertValue(
                            Collections.singletonMap("tokens", tokens),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );

            System.out.println("Auth entry updated." + result.get().getUpdateTime());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add auth entry to database.");
        }
    }

    public Map<String, AuthEntry> getTokens() {
        Map<String, AuthEntry> tokens = new HashMap<>();
        try {
            DocumentReference reference = firestore.collection("auth").document("tokens");

            for (Map.Entry<String,Object> entry : ((Map<String, Object>) reference.get().get().getData().get("tokens")).entrySet()) {
                tokens.put(entry.getKey(), AuthEntry.fromMap((Map<String, Object>) entry.getValue()));
            }

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to fetch auth entries");
        }
        return tokens;
    }


    public void addPasskey(Passkey passkey) {
        DocumentReference reference = null;
        try {
            reference = firestore.collection("auth").document("passkeys");
        } catch (Exception e) {
            System.out.println("Failed to add passkey to database. Problem with firestore collection & document");
        }
        try {
            Map<String, Object> data = new HashMap<>();
            try {
                data = (Map<String,Object>) reference.get().get().getData().get("passkeys");
            } catch (Exception e) {

            }
            data.put(passkey.getEvent_id() , passkey);
            ApiFuture<WriteResult> result = reference.set(
                    mapper.convertValue(
                            Collections.singletonMap("passkeys", data),
                            new TypeReference<HashMap<String, Object>>() {}
                    )
            );

            System.out.println("Passkey added to database." + result.get().getUpdateTime());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add passkey to database.");
        }
    }

    public Map<String, Passkey> getPasskeys() {
        DocumentReference reference = null;
        try {
            reference = firestore.collection("auth").document("passkeys");
        } catch (Exception e) {
            System.out.println("Failed to get passkeys from database. Possibly due to missing collection.");
        }
        Map<String, Passkey> data = new HashMap<>();
        try {
            ((Map<String, Object>) reference.get().get().getData().get("passkeys")).entrySet().stream().forEach(
                    pk -> data.put(pk.getKey(), Passkey.fromMap((Map<String, Object>) pk.getValue()))
            );
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to add passkey to database.");
        }
        return data;
    }

    public String createTourKey(String tourID, ZTime acceptedTime) {
        // create modification passkey for tour
        Passkey passkey = new Passkey()
                .setEvent_id(tourID)
                .setExpiration(new ZTime(acceptedTime.getDate().minusDays(3)));

        Map<String, Passkey> data = getPasskeys();
        String key = UUID.randomUUID().toString();

        while (data.containsKey(key)) {
            key = UUID.randomUUID().toString();
        }

        passkey.setKey(key);
        addPasskey(passkey);
        return key;
    }

}
