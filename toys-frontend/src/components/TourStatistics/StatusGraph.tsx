import React from "react";
import {Chart} from "chart.js/auto";

interface StatusGraphProps {
    // Data to be displayed on the graph.
    data: {[status: string]: number};
    // Additional graph styling (used for setting the margin).
    style: React.CSSProperties;
}

/**
 * Bar chart graph for comparing tour statuses.
 * @param data: data to be displayed on the graph.
 */
const StatusGraph: React.FC<StatusGraphProps> = ({data, style}) => {
    const status = Object.keys(data);
    const values = Object.values(data);

    React.useEffect(() => {
        const ctx = document.getElementById('TourStatusChart') as HTMLCanvasElement;
        const ComparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: status,
                datasets: [{
                    data: values,
                    label: "Tur Sayısı"
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            },
        });

        return () => {
            ComparisonChart.destroy();
        };
    }, [status, values]);

    return <canvas id="TourStatusChart" style={style}></canvas>;
};

export default StatusGraph;