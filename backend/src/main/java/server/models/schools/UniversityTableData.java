package server.models.schools;

import java.util.Map;
import java.util.regex.Pattern;

public class UniversityTableData {

    private String year;

    public String getYear() {
        return year;
    }

    public UniversityTableData setYear(String year) {
        this.year = year;
        return this;
    }

    public static  UniversityTableData fromSource(Map<String, Object> map) {
        UniversityTableData data = new UniversityTableData();
        data.osym_code = (String) map.get("ÖSYM Program Kodu");
        data.uni_type = (String) map.get("Üniversite Türü");
        data.uni_name = (String) map.get("Üniversite");
        data.faculty = (String) map.get("Fakülte / Yüksekokul");
        data.score_type = (String) map.get("Puan Türü");
        data.scholarship_type = (String) map.get("Burs Türü");
        data.general_capacity = (String) map.get("Genel Kontenjan");
        data.valedictorian_capacity = (String) map.get("Okul Birincisi Kontenjanı");
        data.total_capacity = (String) map.get("Toplam Kontenjan");
        data.general_capacity_fill = (String) map.get("Genel Kontenjana Yerleşen");
        data.valedictorian_capacity_fill = (String) map.get("Okul Birincisi Kontenjanına Yerleşen");
        data.total_fill = (String) map.get("Toplam Yerleşen");
        data.unfilled_capacity = (String) map.get("Boş Kalan Kontenjan");
        data.initial_fill = (String) map.get("İlk Yerleşme Oranı");
        data.unregistered = (String) map.get("Yerleşip Kayıt Yaptırmayan");
        data.latecomers = (String) map.get("Ek Yerleşen");
        data.base_lastguy_score = (String) map.get("0,12 Katsayı ile Yerleşen Son Kişinin Puanı*");
        data.amplified_lastguy_score = (String) map.get("0,12 + 0,06 Katsayı ile Yerleşen Son Kişinin Puanı*");
        data.base_lastguy_rank = (String) map.get("0,12 Katsayı ile Yerleşen Son Kişinin Başarı Sırası*");
        data.amplified_lastguy_rank = (String) map.get("0,12 + 0,06 Katsayı ile Yerleşen Son Kişinin Başarı Sırası*");

        String extractedYear = null;
        Pattern yearPattern = Pattern.compile("[0-9]{4}(?= Tavan Puan)");
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            if (yearPattern.matcher(entry.getKey()).find()) {
                extractedYear = entry.getKey().substring(0, 4);
                break;
            }
        }

        if (extractedYear != null) {
            data.best_score = (String) map.get(extractedYear + " Tavan Puan(0,12)*");
            data.best_rank = (String) map.get(extractedYear + " Tavan Başarı Sırası(0,12)*");
            data.fill_by_weird = (String) map.get((Integer.parseInt(extractedYear) - 1) + "'de Yerleşip " + extractedYear + "'de OBP'si Kırılarak Yerleşen Sayısı");
            data.year = extractedYear;
        }

        data.average_obp = (String) map.get("Yerleşenlerin Ortalama OBP'si");
        data.average_gpa = (String) map.get("Yerleşenlerin Ortalama Diploma Notu");
        return data;
    }

    protected UniversityTableData(Map<String, Object> map) {
        this.osym_code = (String) map.get("osym_code");
        this.uni_type = (String) map.get("uni_type");
        this.uni_name = (String) map.get("uni_name");
        this.faculty = (String) map.get("faculty");
        this.score_type = (String) map.get("score_type");
        this.scholarship_type = (String) map.get("scholarship_type");
        this.general_capacity = (String) map.get("general_capacity");
        this.valedictorian_capacity = (String) map.get("valedictorian_capacity");
        this.total_capacity = (String) map.get("total_capacity");
        this.general_capacity_fill = (String) map.get("general_capacity_fill");
        this.valedictorian_capacity_fill = (String) map.get("valedictorian_capacity_fill");
        this.total_fill = (String) map.get("total_fill");
        this.unfilled_capacity = (String) map.get("unfilled_capacity");
        this.initial_fill = (String) map.get("initial_fill");
        this.unregistered = (String) map.get("unregistered");
        this.latecomers = (String) map.get("latecomers");
        this.base_lastguy_score = (String) map.get("base_lastguy_score");
        this.amplified_lastguy_score = (String) map.get("amplified_lastguy_score");
        this.base_lastguy_rank = (String) map.get("base_lastguy_rank");
        this.amplified_lastguy_rank = (String) map.get("amplified_lastguy_rank");
        this.best_score = (String) map.get("best_score");
        this.best_rank = (String) map.get("best_rank");
        this.fill_by_weird = (String) map.get("fill_by_weird");
        this.average_obp = (String) map.get("average_obp");
        this.average_gpa = (String) map.get("average_gpa");
    }

    public static UniversityTableData fromMap(Map<String, Object> map) {
        return new UniversityTableData(map);
    }

    public UniversityTableData() {
    }

    private String osym_code,
    uni_type, uni_name,
    faculty,
    score_type, scholarship_type,
    general_capacity,
    valedictorian_capacity,
    total_capacity,
    general_capacity_fill,
    valedictorian_capacity_fill,
    total_fill,
    unfilled_capacity,

    initial_fill,
    unregistered,
    latecomers,

    base_lastguy_score,
    amplified_lastguy_score,

    base_lastguy_rank,
    amplified_lastguy_rank,

    best_score,
    best_rank,

    fill_by_weird,
    average_obp,
    average_gpa;

    public String getInitial_fill() {
        return initial_fill;
    }

    public UniversityTableData setInitial_fill(String initial_fill) {
        this.initial_fill = initial_fill;
        return this;
    }

    public String getUnregistered() {
        return unregistered;
    }

    public UniversityTableData setUnregistered(String unregistered) {
        this.unregistered = unregistered;
        return this;
    }

    public String getLatecomers() {
        return latecomers;
    }

    public UniversityTableData setLatecomers(String latecomers) {
        this.latecomers = latecomers;
        return this;
    }

    public String getBase_lastguy_score() {
        return base_lastguy_score;
    }

    public UniversityTableData setBase_lastguy_score(String base_lastguy_score) {
        this.base_lastguy_score = base_lastguy_score;
        return this;
    }

    public String getAmplified_lastguy_score() {
        return amplified_lastguy_score;
    }

    public UniversityTableData setAmplified_lastguy_score(String amplified_lastguy_score) {
        this.amplified_lastguy_score = amplified_lastguy_score;
        return this;
    }

    public String getBase_lastguy_rank() {
        return base_lastguy_rank;
    }

    public UniversityTableData setBase_lastguy_rank(String base_lastguy_rank) {
        this.base_lastguy_rank = base_lastguy_rank;
        return this;
    }

    public String getAmplified_lastguy_rank() {
        return amplified_lastguy_rank;
    }

    public UniversityTableData setAmplified_lastguy_rank(String amplified_lastguy_rank) {
        this.amplified_lastguy_rank = amplified_lastguy_rank;
        return this;
    }

    public String getBest_score() {
        return best_score;
    }

    public UniversityTableData setBest_score(String best_score) {
        this.best_score = best_score;
        return this;
    }

    public String getBest_rank() {
        return best_rank;
    }

    public UniversityTableData setBest_rank(String best_rank) {
        this.best_rank = best_rank;
        return this;
    }

    public String getFill_by_weird() {
        return fill_by_weird;
    }

    public UniversityTableData setFill_by_weird(String fill_by_weird) {
        this.fill_by_weird = fill_by_weird;
        return this;
    }

    public String getAverage_obp() {
        return average_obp;
    }

    public UniversityTableData setAverage_obp(String average_obp) {
        this.average_obp = average_obp;
        return this;
    }

    public String getAverage_gpa() {
        return average_gpa;
    }

    public UniversityTableData setAverage_gpa(String average_gpa) {
        this.average_gpa = average_gpa;
        return this;
    }

    public String getTotal_capacity() {
        return total_capacity;
    }

    public UniversityTableData setTotal_capacity(String total_capacity) {
        this.total_capacity = total_capacity;
        return this;
    }

    public String getOsym_code() {
        return osym_code;
    }

    public UniversityTableData setOsym_code(String osym_code) {
        this.osym_code = osym_code;
        return this;
    }

    public String getUni_type() {
        return uni_type;
    }

    public UniversityTableData setUni_type(String uni_type) {
        this.uni_type = uni_type;
        return this;
    }

    public String getUni_name() {
        return uni_name;
    }

    public UniversityTableData setUni_name(String uni_name) {
        this.uni_name = uni_name;
        return this;
    }

    public String getFaculty() {
        return faculty;
    }

    public UniversityTableData setFaculty(String faculty) {
        this.faculty = faculty;
        return this;
    }

    public String getScore_type() {
        return score_type;
    }

    public UniversityTableData setScore_type(String score_type) {
        this.score_type = score_type;
        return this;
    }

    public String getScholarship_type() {
        return scholarship_type;
    }

    public UniversityTableData setScholarship_type(String scholarship_type) {
        this.scholarship_type = scholarship_type;
        return this;
    }

    public String getGeneral_capacity() {
        return general_capacity;
    }

    public UniversityTableData setGeneral_capacity(String general_capacity) {
        this.general_capacity = general_capacity;
        return this;
    }

    public String getValedictorian_capacity() {
        return valedictorian_capacity;
    }

    public UniversityTableData setValedictorian_capacity(String valedictorian_capacity) {
        this.valedictorian_capacity = valedictorian_capacity;
        return this;
    }

    public String getGeneral_capacity_fill() {
        return general_capacity_fill;
    }

    public UniversityTableData setGeneral_capacity_fill(String general_capacity_fill) {
        this.general_capacity_fill = general_capacity_fill;
        return this;
    }

    public String getValedictorian_capacity_fill() {
        return valedictorian_capacity_fill;
    }

    public UniversityTableData setValedictorian_capacity_fill(String valedictorian_capacity_fill) {
        this.valedictorian_capacity_fill = valedictorian_capacity_fill;
        return this;
    }

    public String getTotal_fill() {
        return total_fill;
    }

    public UniversityTableData setTotal_fill(String total_fill) {
        this.total_fill = total_fill;
        return this;
    }

    public String getUnfilled_capacity() {
        return unfilled_capacity;
    }

    public UniversityTableData setUnfilled_capacity(String unfilled_capacity) {
        this.unfilled_capacity = unfilled_capacity;
        return this;
    }
}
