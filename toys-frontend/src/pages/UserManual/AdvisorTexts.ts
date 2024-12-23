import {UserManualItem} from "./UserManual.tsx";

const AdvisorTexts: UserManualItem[] = [
    {
        title: "Bir turu kabul edin veya reddedin.",
        content: "Sisteme kaydedilen bir turu kabul edebilir / reddedebilir veya tur bilgilerinde değişiklik isteyebilirsiniz.",
        dynamicSteps: [
            { title: "Tur sayfasını açın.", image: "manual/accepttour1.png" },
            { title: "İstediğiniz turu seçin.", image: "manual/accepttour2.png" },
            { title: "İstediğiniz değişikliği yapın.", image: "manual/accepttour3.png" }
        ]
    }
]

export default AdvisorTexts;