package server.models.schools;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UniversityEntryRecord {
    private String OSYMCode;

    private String UniType;

    private String department;


    private String scoreType;

  //  @JsonProperty("Burs Türü")
    private String scholarshipType;

//    @JsonProperty("Genel Kontenjan")
    private String capacity;

  //  @JsonProperty("Okul Birincisi Kontenjanı")
    private String valedictorianCapacity;

  //  @JsonProperty("Toplam Kontenjan")
    private String totalCapacity;

 //   @JsonProperty("Genel Kontenjana Yerleşen")
    private String filled;

   // @JsonProperty("Okul Birincisi Kontenjanına Yerleşen")
    private String valedictorianFilled;

  //  @JsonProperty("Toplam Yerleşen")
    private String totalFilled;

   // @JsonProperty("Boş Kalan Kontenjan")
    private String remainingCapacity;

  //  @JsonProperty("İlk Yerleşme Oranı")
    private String initialFillRate;

   // @JsonProperty("Yerleşip Kayıt Yaptırmayan")
    private String notRegistered;

   // @JsonProperty("Ek Yerleşen")
    private String extras;

    //@JsonProperty("0,12 Katsayı ile Yerleşen Son Kişinin Puanı")
    private String basicEntryBottomScore;

   // @JsonProperty("0,12 + 0,06 Katsayı ile Yerleşen Son Kişinin Puanı")
    private String augmentedEntryBottomScore;

    //@JsonProperty("0,12 Katsayı ile Yerleşen Son Kişinin Başarı Sırası")
    private String basicEntryBottomRanking;

    //@JsonProperty("0,12 + 0,06 Katsayı ile Yerleşen Son Kişinin Başarı Sırası")
    private String augmentedEntryBottomRanking;

    //@JsonProperty("Tavan Puanı")
    private String thisYearsEntrants;
}
