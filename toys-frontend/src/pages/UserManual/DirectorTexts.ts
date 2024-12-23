import {UserManualItem} from "./UserManual.tsx";

const DirectorTexts: UserManualItem[] = [
    {
        title: "Bir turu kabul edin veya reddedin.",
        content: "Sisteme kaydedilen bir turu kabul edebilir / reddedebilir veya tur bilgilerinde değişiklik isteyebilirsiniz.",
        dynamicSteps: [
            { title: "Tur sayfasını açın.", image: "manual/accepttour1.png" },
            { title: "İstediğiniz turu seçin.", image: "manual/accepttour2.png" },
            { title: "İstediğiniz değişikliği yapın.", image: "manual/accepttour3.png" }
        ]
    },
    {
        title: "Sisteme bir lise ekleyin.",
        content: "Tur başvurularında veya veri analizlerinde kullanılması için sisteme lise ekleyebilirsiniz. Özellikle özel liselerden gelen turları kabul edebilmek için bu özelliği kullanmanız gerekebilir.",
        dynamicSteps: [
            { title: "Liseler listesi sayfasını açın.", image: "manual/addhighschool1.png" },
            { title: "Lise ekleme tuşuna tıklayın.", image: "manual/addhighschool2.png" },
            { title: "Lise bilgilerini girin.", image: "manual/addhighschool3.png" },
            { title: "Kaydet tuşuna tıklayın.", image: "manual/addhighschool4.png" }
        ]
    },
    {
        title: "Sistemdeki bir liseyi düzenleyin.",
        content: "Tur başvurularında veya veri analizlerinde kullanılması için sisteme lise ekleyebilirsiniz. Özellikle özel liselerden gelen turları kabul edebilmek için bu özelliği kullanmanız gerekebilir.",
        dynamicSteps: [
            { title: "Liseler listesi sayfasını açın.", image: "manual/edithighschool1.png" },
            { title: "Düzenlemek istediğiniz liseyi belirleyin.", image: "manual/edithighschool2.png" },
            { title: "Düzeleme tuşuna tıklayın.", image: "manual/edithighschool3.png" },
            { title: "İstedğiniz değişiklikleri yapın.", image: "manual/edithighschool4.png" },
            { title: "Kaydet tuşuna tıklayın.", image: "manual/edithighschool5.png" }
        ]
    }
]

export default DirectorTexts;