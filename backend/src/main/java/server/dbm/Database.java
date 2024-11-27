package server.dbm;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
public class Database {

    private static Firestore firestoreDatabase;

    private static final String credentialsFile = "toys-bilkent-67ba3be94a67.json";

    private static ObjectMapper objectMapper;

    public static ObjectMapper getObjectMapper() {
        return objectMapper;
    }

    public static Firestore getFirestoreDatabase() {
        return firestoreDatabase;
    }

    private static Database instance;
    public static Database getInstance() {
        if (instance == null) {
            instance = new Database();
        }
        return instance;
    }

    public DBApplicationService applications;
    public DBToursService tours;
    public DBFairsService fairs;
    public DBUsersService people;
    public DBSchoolService schools;
    public DBRequestService requests;

    private Database() {

        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        if (this.firestoreDatabase == null) {
            try {
                InputStream serviceAccountFile = getCredentials(credentialsFile);

                GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccountFile);

                FirebaseOptions options = new FirebaseOptions.Builder()
                        .setCredentials(credentials)
                        .build();

                FirebaseApp.initializeApp(options);

                firestoreDatabase = FirestoreClient.getFirestore();

                System.out.println("initialized firestore database.");

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        applications = new DBApplicationService();
        tours = new DBToursService();
        people = new DBUsersService();
        fairs = new DBFairsService();
        schools = new DBSchoolService();
        requests = new DBRequestService();

    }

    private InputStream getCredentials(String credentialsFile) {
        ClassLoader classLoader = Database.class.getClassLoader();

        InputStream inputStream = classLoader.getResourceAsStream(credentialsFile);

        if (inputStream == null) {
            throw new IllegalArgumentException("File not found! " + credentialsFile);
        }
        return inputStream;
    }
}