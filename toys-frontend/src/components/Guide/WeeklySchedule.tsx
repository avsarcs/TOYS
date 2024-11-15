import React from "react";

const WeeklySchedule = () => {
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

    return (
        <div className="weekly-schedule">
            <h2>Weekly Schedule</h2>
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
                            <td key={colIndex} className={rowIndex === 0 && colIndex === 0 ? "busy" : "available"}></td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="legend">
                <p><span className="busy"></span> User is busy</p>
                <p><span className="available"></span> User is available</p>
            </div>
        </div>
    );
};

export default WeeklySchedule;
