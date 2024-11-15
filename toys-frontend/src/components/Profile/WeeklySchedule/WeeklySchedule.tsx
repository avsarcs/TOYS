import React, { useState } from "react";
import "./WeeklySchedule.css";
import { ScrollArea, Title } from "@mantine/core";

const WeeklySchedule: React.FC = () => {
    const times = [
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
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // State to manage the schedule and editing mode
    const [schedule, setSchedule] = useState<boolean[][]>(
        Array(times.length).fill(Array(days.length).fill(false))
    );

    const [backupSchedule, setBackupSchedule] = useState<boolean[][]>([...schedule]); // Backup for revert
    const [isEditing, setIsEditing] = useState(false);

    // Toggle the status of a specific cell
    const toggleCell = (rowIndex: number, colIndex: number) => {
        if (!isEditing) return; // Allow toggling only in edit mode

        const newSchedule = schedule.map((row, rIdx) =>
            row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === colIndex ? !cell : cell))
        );
        setSchedule(newSchedule);
    };

    // Enter edit mode and back up the current schedule
    const startEditing = () => {
        setBackupSchedule([...schedule]); // Backup current schedule before editing
        setIsEditing(true);
    };

    // Save the schedule and exit edit mode
    const saveSchedule = () => {
        console.log("Saved Schedule:", schedule);
        setIsEditing(false); // Exit edit mode after saving
    };

    // Revert to the backup schedule and exit edit mode
    const cancelChanges = () => {
        setSchedule([...backupSchedule]); // Restore the backup schedule
        setIsEditing(false); // Exit edit mode
    };

    return (
        <div className="weekly-schedule">
            <div className="header">
                <Title p="" pb="" order={3} className="text-blue-700 font-bold font-main">
                    Weekly Schedule
                </Title>
                {isEditing ? (
                    <>
                        <button onClick={cancelChanges} className="settings-button">
                            Cancel
                        </button>
                        <button onClick={saveSchedule} className="save-button">
                            Save
                        </button>
                    </>
                ) : (
                    <button onClick={startEditing} className="settings-button">
                        Settings
                    </button>
                )}
            </div>

            {isEditing && (
                <p className="edit-mode-message">You can now edit your busy hours by clicking on the cells.</p>
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
                    {times.map((time, rowIndex) => (
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
                <p><span className="busy"></span> User is busy</p>
                <p><span className="available"></span> User is available</p>
            </div>
        </div>
    );
};

export default WeeklySchedule;
