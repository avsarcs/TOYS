package server.models.schools;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UniversityTableDataDeserializer extends JsonDeserializer<UniversityTableData> {
    @Override
    public UniversityTableData deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JacksonException {

        //[0-9]{4}(?= Tavan Puan)
        JsonNode node = jsonParser.getCodec().readTree(jsonParser);
        UniversityTableData universityTableData = new UniversityTableData();

        universityTableData.setOsym_code(node.get("ÖSYM Program Kodu").asText());
        universityTableData.setUni_type(node.get("Üniversite Türü").asText());
        universityTableData.setUni_name(node.get("Üniversite").asText());
        universityTableData.setFaculty(node.get("Fakülte / Yüksekokul").asText());
        universityTableData.setScore_type(node.get("Puan Türü").asText());
        universityTableData.setScholarship_type(node.get("Burs Türü").asText());
        universityTableData.setGeneral_capacity(node.get("Genel Kontenjan").asText());
        universityTableData.setValedictorian_capacity(node.get("Okul Birincisi Kontenjanı").asText());
        universityTableData.setTotal_capacity(node.get("Toplam Kontenjan").asText());
        universityTableData.setGeneral_capacity_fill(node.get("Genel Kontenjana Yerleşen").asText());
        universityTableData.setValedictorian_capacity_fill(node.get("Okul Birincisi Kontenjanına Yerleşen").asText());
        universityTableData.setTotal_fill(node.get("Toplam Yerleşen").asText());
        universityTableData.setUnfilled_capacity(node.get("Boş Kalan Kontenjan").asText());
        universityTableData.setInitial_fill(node.get("İlk Yerleşme Oranı").asText());
        universityTableData.setUnregistered(node.get("Yerleşip Kayıt Yaptırmayan").asText());
        universityTableData.setLatecomers(node.get("Ek Yerleşen").asText());
        universityTableData.setBase_lastguy_score(node.get("0,12 Katsayı ile Yerleşen Son Kişinin Puanı*").asText());
        universityTableData.setAmplified_lastguy_score(node.get("0,12 + 0,06 Katsayı ile Yerleşen Son Kişinin Puanı*").asText());
        universityTableData.setBase_lastguy_rank(node.get("0,12 Katsayı ile Yerleşen Son Kişinin Başarı Sırası*").asText());
        universityTableData.setAmplified_lastguy_rank(node.get("0,12 + 0,06 Katsayı ile Yerleşen Son Kişinin Başarı Sırası*").asText());


        String extractedYear = null;

        for (JsonNode field : node) {
            if(field.asText().matches("[0-9]{4}(?= Tavan Puan)")) {
               extractedYear = field.asText().substring(0,4);
               break;
            }
        }

        universityTableData.setBest_score(node.get(extractedYear + " Tavan Puan(0,12)*").asText());
        universityTableData.setBest_rank(node.get(extractedYear + " Tavan Başarı Sırası(0,12)*").asText());
        universityTableData.setFill_by_weird(node.get((Integer.valueOf(extractedYear) -1) + "'de Yerleşip " + extractedYear + "'de OBP'si Kırılarak Yerleşen Sayısı").asText());

        universityTableData.setYear(extractedYear);



        universityTableData.setAverage_obp(node.get("Yerleşenlerin Ortalama OBP'si").asText());
        universityTableData.setAverage_gpa(node.get("Yerleşenlerin Ortalama Diploma Notu").asText());

        return universityTableData;
    }
}