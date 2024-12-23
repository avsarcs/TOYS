import {UserManualItem} from "./UserManual.tsx";

const DirectorTexts: UserManualItem[] = [
    {
        title: "Bir tur nasıl kabul edilir?",
        content: "Aşağıdaki adımları izleyerek bir turu kabul edebilirsiniz.",
        staticSteps: [
            { title: "Those steps are always there!", content: "Text.", image: "bilkent_drone.jpg" },
            { title: "Step 2", content: "Lorem ipsum." },
        ],
        dynamicSteps: [
            { title: "Dynamic step 1", content: "Text." },
            { title: "Dynamic step 2", content: "Lorem ipsum." }
        ]
    }
]

export default DirectorTexts;