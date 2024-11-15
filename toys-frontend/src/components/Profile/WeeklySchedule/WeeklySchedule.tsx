import React, { useState } from "react";
import "./WeeklySchedule.css";
import {ScrollArea, Title} from "@mantine/core"; // Import the updated CSS

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

    // State to manage busy/available status for each cell and edit mode
    const [schedule, setSchedule] = useState(
        Array(times.length).fill(Array(days.length).fill(false))
    );
    const [isEditing, setIsEditing] = useState(false);

    // Toggle the status of a specific cell
    const toggleCell = (rowIndex: number, colIndex: number) => {
        if (!isEditing) return; // Only toggle if in edit mode

        const newSchedule = schedule.map((row, rIdx) =>
            row.map((cell: any, cIdx: any) => (rIdx === rowIndex && cIdx === colIndex ? !cell : cell))
        );
        setSchedule(newSchedule);
    };

    // Toggle edit mode
    const toggleEditMode = () => setIsEditing(!isEditing);

    // Save function (placeholder for any save logic)
    const saveSchedule = () => {
        console.log("Saved Schedule:", schedule);
        setIsEditing(false); // Exit edit mode after saving
    };

    return (
        <div className="weekly-schedule">
            <div className="header">
                <Title p="" pb="" order={3} className="text-blue-700 font-bold font-main">
                    Weekly Schedule
                </Title>
                <button onClick={toggleEditMode} className="settings-button">
                    {isEditing ? "Cancel" : "Settings"}
                </button>
                {isEditing && (
                    <button onClick={saveSchedule} className="save-button">
                        Save
                    </button>
                )}
            </div>

            {isEditing && (
                <p className="edit-mode-message" >You can now edit your busy hours by clicking on the cells.</p>
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
                        {days.map((day, colIndex) => (
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
