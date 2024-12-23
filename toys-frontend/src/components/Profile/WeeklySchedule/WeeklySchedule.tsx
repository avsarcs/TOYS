import React, { useState, useContext, useEffect } from "react";
import "./WeeklySchedule.css";
import { ScrollArea, Title } from "@mantine/core";
import { ProfileData, ScheduleData, DailyPlan, ScheduleStub} from "../../../types/data.ts";
import { TimeSlotStatus } from "../../../types/enum.ts";
import { UserContext } from "../../../context/UserContext.tsx";
import { ProfileComponentProps } from "../../../types/designed.ts";
import {notifications} from "@mantine/notifications";

const WeeklySchedule: React.FC<ProfileComponentProps> = (props: ProfileComponentProps) => {
    const userContext = useContext(UserContext);

    const dayTranslations: { [key in keyof ScheduleData]: string } = {
        MONDAY: "Pazartesi",
        TUESDAY: "Salı",
        WEDNESDAY: "Çarşamba",
        THURSDAY: "Perşembe",
        FRIDAY: "Cuma",
        SATURDAY: "Cumartesi",
        SUNDAY: "Pazar",
    };
    
    // Human-readable times for display
    const readableTimes = [
        "8:30 - 9:30",
        "9:30 - 10:30",
        "10:30 - 11:30",
        "11:30 - 12:30",
        "12:30 - 13:30",
        "13:30 - 14:30",
        "14:30 - 15:30",
        "15:30 - 16:30",
        "16:30 - 17:30",
        "17:30 - 18:30",
    ];

    // Keys for accessing schedule data
    const times = [
        "_830_930",
        "_930_1030",
        "_1030_1130",
        "_1130_1230",
        "_1230_1330",
        "_1330_1430",
        "_1430_1530",
        "_1530_1630",
        "_1630_1730",
        "_1730_1830",
    ];

    const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
    let scheduleMatrix = days.map((day) =>
        times.map((time) =>
            props.profile.schedule.schedule[day as keyof ScheduleData][time as keyof DailyPlan] === TimeSlotStatus.BUSY || false
        )
    );
    useEffect(() => {
        // Convert ScheduleData to a matrix for rendering
        scheduleMatrix = days.map((day) =>
            times.map((time) =>
                props.profile.schedule.schedule[day as keyof ScheduleData][time as keyof DailyPlan] === TimeSlotStatus.BUSY || false
            )
        );
        setSchedule(scheduleMatrix);
    }, [props.profile.schedule.schedule]);

    // Initialize state with a valid matrix
    const [schedule, setSchedule] = useState<boolean[][]>(scheduleMatrix);

    const [backupSchedule, setBackupSchedule] = useState<boolean[][]>([...schedule]);
    const [isEditing, setIsEditing] = useState(false);

    const toggleCell = (rowIndex: number, colIndex: number) => {
        if (!isEditing) return;
        const newSchedule = schedule.map((row, rIdx) =>
            row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === colIndex ? !cell : cell))
        );
        setSchedule(newSchedule);
    };

    const startEditing = () => {
        setBackupSchedule([...schedule]);
        setIsEditing(true);
    };

    const saveSchedule = async () => {
        // Convert matrix back to ScheduleData
        const updatedSchedule: ScheduleData = {} as ScheduleData;

        // Iterate over days first, as schedule rows now represent days
        (days as Array<keyof ScheduleData>).forEach((day, rowIndex) => {
            updatedSchedule[day] = {} as DailyPlan;
        
            // Iterate over times within each day (columns of the schedule)
            times.forEach((time, colIndex) => {
                updatedSchedule[day][time as keyof DailyPlan] = schedule[rowIndex][colIndex] ? TimeSlotStatus.BUSY : TimeSlotStatus.FREE;
            });
        });
        const updatedScheduleStub: ScheduleStub = {
            schedule: updatedSchedule,
        };
        const updatedProfile: ProfileData = {
            ...props.profile,
            schedule: updatedScheduleStub,
        };

        try {
            const url = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/profile/update");

            // Add query parameters
            url.searchParams.append("auth", await userContext.getAuthToken());
            console.log(updatedProfile);

            const response = await fetch(url.toString(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...updatedProfile
                }),
            });

            if (!response.ok) {
                notifications.show({ title: "Error", message: "Failed to update schedule.", color: "red" });
            }

            console.log("Schedule saved successfully.");
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving schedule:", error);
            alert("An error occurred while saving the schedule.");
        }
    };

    const cancelChanges = () => {
        setSchedule([...backupSchedule]);
        setIsEditing(false);
    };
    return (
        <div className="weekly-schedule">
            <div className="header">
                <Title order={3} className="text-blue-700 font-bold font-main">
                    Haftalık Program
                </Title>
                {isEditing ? (
                    <>
                        <button onClick={cancelChanges} className="settings-button">
                            İptal Et
                        </button>
                        <button onClick={saveSchedule} className="save-button">
                            Kaydet
                        </button>
                    </>
                ) :
                        userContext.user.id === props.profile.id
                            ?
                            <button onClick={startEditing} className="settings-button">
                                Haftalık Programı Düzenle
                            </button>
                            : null
                }
            </div>

            {isEditing && (
                <p className="edit-mode-message">Meşgul olduğunuz saatleri aşağıdaki kutucuklara tıklayarak seçebilirsiniz.</p>
            )}

            <ScrollArea scrollbars="x">
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            {days.map((day) => (
                                <th key={day}>{dayTranslations[day as keyof ScheduleData]}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {readableTimes.map((time, colIndex) => (
                            <tr key={time}>
                                <td>{time}</td>
                                {days.map((_, rowIndex) => (
                                    <td
                                        key={colIndex*10 + rowIndex}
                                        className={
                                        //this is stupid and bad
                                        // but so is chatgpt
                                            (schedule[rowIndex][colIndex] ? "busy" : "available") +
                                            (isEditing ? "" : " !cursor-default")
                                        }
                                        onClick={
                                            isEditing
                                                ?
                                                () => toggleCell(rowIndex, colIndex)
                                                : undefined
                                    }
                                    ></td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </ScrollArea>

            <div className="legend">
                <p>
                    <span className="busy"></span> Kullanıcı meşgul
                </p>
                <p>
                    <span className="available"></span> Kullanıcı müsait
                </p>
            </div>
        </div>
    );
};

export default WeeklySchedule;
