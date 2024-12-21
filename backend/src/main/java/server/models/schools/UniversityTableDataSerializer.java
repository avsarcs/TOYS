/*package server.models.schools;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class UniversityTableDataSerializer extends JsonSerializer<UniversityTableData> {

    @Override
    public void serialize(UniversityTableData universityTableData, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) {
        try {

            Map<String, String> data = new HashMap<String, String>();
            data.put("ÖSYM Program Kodu", universityTableData.getOsym_code());
            data.put("Üniversite Türü", universityTableData.getUni_type());
            data.put("Üniversite", universityTableData.getUni_name());
            data.put("Fakülte / Yüksekokul", universityTableData.getFaculty());
            data.put("Puan Türü", universityTableData.getScore_type());
            data.put("Burs Türü", universityTableData.getScholarship_type());
            data.put("Genel Kontenjan", universityTableData.getGeneral_capacity());
            data.put("Okul Birincisi Kontenjanı", universityTableData.getValedictorian_capacity());
            data.put("Toplam Kontenjan", universityTableData.getTotal_capacity());
            data.put("Genel Kontenjana Yerleşen", universityTableData.getGeneral_capacity_fill());
            data.put("Okul Birincisi Kontenjanına Yerleşen", universityTableData.getValedictorian_capacity_fill());
            data.put("Toplam Yerleşen", universityTableData.getTotal_fill());
            data.put("Boş Kalan Kontenjan", universityTableData.getUnfilled_capacity());
            data.put("İlk Yerleşme Oranı", universityTableData.getInitial_fill());
            data.put("Yerleşip Kayıt Yaptırmayan", universityTableData.getUnregistered());
            data.put("Ek Yerleşen", universityTableData.getLatecomers());
            data.put("0,12 Katsayı ile Yerleşen Son Kişinin Puanı*", universityTableData.getBase_lastguy_score());
            data.put("0,12 + 0,06 Katsayı ile Yerleşen Son Kişinin Puanı*", universityTableData.getAmplified_lastguy_score());
            data.put("0,12 Katsayı ile Yerleşen Son Kişinin Başarı Sırası*", universityTableData.getAmplified_lastguy_score());
            data.put("0,12 + 0,06 Katsayı ile Yerleşen Son Kişinin Başarı Sırası*", universityTableData.getAmplified_lastguy_rank());
            data.put(universityTableData.getYear() + " Tavan Puan(0,12)*", universityTableData.getBest_score());
            data.put(universityTableData.getYear() + " Tavan Başarı Sırası(0,12)*", universityTableData.getBest_rank());

            data.put((Integer.valueOf(universityTableData.getYear()) - 1) + "'de Yerleşip " + universityTableData.getYear() + "'de OBP'si Kırılarak Yerleşen Sayısı", universityTableData.getFill_by_weird());

            data.put("Yerleşenlerin Ortalama OBP'si", universityTableData.getAverage_obp());
            data.put("Yerleşenlerin Ortalama Diploma Notu", universityTableData.getAverage_gpa());

            jsonGenerator.writeObject(data);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
*/