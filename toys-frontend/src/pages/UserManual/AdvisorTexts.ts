import {UserManualItem} from "./UserManual.tsx";

const AdvisorTexts: UserManualItem[] = [
    {
        title: "Bir tur için gönüllü olun.",
        content: "Onaylanmış ve henüz rehberi olmayan bir turun rehberi olmak için gönüllü olabilirsiniz.",
        dynamicSteps: [
            { title: "Turlar sayfasını açın.", image: "manual/enrollintour1.png" },
            { title: "İstediğiniz turu seçin ve üzerine tıklayın.", image: "manual/enrollintour2.png" },
            { title: "Rehber olma tuşuna tıklayın.", image: "manual/enrollintour3.png" },
            { title: "Onaylayın.", image: "manual/enrollintour4.png" }
        ]
    },
    {
        title: "Bir tur için gönüllü olmaktan vazgeçin.",
        content: "Daha önce gönüllü olduğunuz bir tura katılmaktan vazgeçebilirsiniz.",
        dynamicSteps: [
            { title: "Turlar sayfasını açın.", image: "manual/enrollintour1.png" },
            { title: "İstediğiniz turu seçin ve üzerine tıklayın.", image: "manual/enrollintour2.png" },
            { title: "Rehber olmaktan vazgeçme tuşuna tıklayın.", image: "manual/enrollintour5.png" },
            { title: "Onaylayın.", image: "manual/enrollintour6.png" }
        ]
    }
]

export default AdvisorTexts;