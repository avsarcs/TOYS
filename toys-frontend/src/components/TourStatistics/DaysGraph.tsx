import React from "react";
import {Chart} from "chart.js/auto";

interface DaysGraphProps {
    // Data to be displayed on the graph.
    data: {[day: string]: number};
    // Additional graph styling (used for setting the margin).
    style: React.CSSProperties;
}

/**
 * Pie chart graph for comparing tour days.
 * @param data data to be displayed on the graph.
 * @param style additional graph styling (used for setting the margin).
 */
const DaysGraph: React.FC<DaysGraphProps> = ({data, style}) => {
    const days = Object.keys(data);
    const values = Object.values(data);

    React.useEffect(() => {
        const ctx = document.getElementById('TourDaysChart') as HTMLCanvasElement;
        const ComparisonChart = new Chart(ctx, {
            type: 'pie',
            data: {
                datasets: [{ data: values }],
                labels: days
            }
        });

        return () => {
            ComparisonChart.destroy();
        };
    }, [values, days]);

    return <canvas id="TourDaysChart" style={style}></canvas>;
}

export default DaysGraph;