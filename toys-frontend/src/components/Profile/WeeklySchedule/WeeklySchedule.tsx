import React, { useState, useContext } from "react";
import "./WeeklySchedule.css";
import { ScrollArea, Title } from "@mantine/core";
import { ProfileData, ScheduleData, DailyPlan} from "../../../types/data.ts";
import { TimeSlotStatus } from "../../../types/enum.ts";
import { UserContext } from "../../../context/UserContext.tsx";

const WeeklySchedule: React.FC = () => {
    const userContext = useContext(UserContext);
    const profile = userContext.user.profile;

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
    ];

    const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

    // Convert ScheduleData to a matrix for rendering
    const scheduleMatrix = days.map((day) => times.map((time) => profile.schedule[day][time] === TimeSlotStatus.BUSY));

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
        (days as Array<keyof ScheduleData>).forEach((day, dayIndex) => {
            updatedSchedule[day] = {} as DailyPlan;
            times.forEach((time, timeIndex) => {
                updatedSchedule[day][time as keyof DailyPlan] = schedule[timeIndex][dayIndex] ? TimeSlotStatus.BUSY : TimeSlotStatus.FREE;
            });
        });

        const updatedProfile: ProfileData = {
            ...profile,
            schedule: updatedSchedule,
        };

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/profile/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    authToken: userContext.authToken,
                    profileModel: updatedProfile,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save the schedule.");
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
                ) : (
                    <button onClick={startEditing} className="settings-button">
                        Haftalık Programı Düzenle
                    </button>
                )}
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
                                <th key={day}>{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {readableTimes.map((time, rowIndex) => (
                            <tr key={time}>
                                <td>{time}</td>
                                {days.map((_, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={schedule[rowIndex][colIndex] ? "busy" : "available"}
                                        onClick={() => toggleCell(rowIndex, colIndex)}
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
