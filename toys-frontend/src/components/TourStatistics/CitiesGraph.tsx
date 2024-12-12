import React from "react";
import {Chart} from "chart.js/auto";

interface CitiesGraphProps {
    // Data to be displayed on the graph.
    data: {[city: string]: number};
    // Additional graph styling (used for setting the margin).
    style: React.CSSProperties;
}

/**
 * Bar chart graph for comparing cities tour groups are coming from.
 * @param data: data to be displayed on the graph.
 */
const CitiesGraph: React.FC<CitiesGraphProps> = ({data, style}) => {
    // List of possible bar colors.
    const colors = [
        'rgba(255, 99, 132, 0.7)', // Pink
        'rgba(255, 159, 64, 0.7)', // Orange
        'rgba(255, 205, 86, 0.7)', // Yellow
        'rgba(75, 192, 192, 0.7)', // Turquoise
        'rgba(54, 162, 235, 0.7)', // Blue
        'rgba(153, 102, 255, 0.7)', // Purple
        'rgba(33, 33, 33, 1)', // Black
        'rgba(0, 128, 0, 0.7)', // Green
        'rgba(128, 0, 128, 0.7)', // Purple
        'rgba(255, 0, 0, 0.7)', // Red
        'rgba(0, 0, 255, 0.7)', // Blue
        'rgba(255, 255, 0, 0.7)', // Yellow
        'rgba(0, 255, 255, 0.7)', // Cyan
        'rgba(255, 0, 255, 0.7)' // Magenta
    ]

    const cities = Object.keys(data);
    const values = Object.values(data);

    React.useEffect(() => {
        const ctx = document.getElementById('TourCitiesChart') as HTMLCanvasElement;
        const ComparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: cities,
                datasets: [{
                    data: values,
                    label: "Tur Sayısı",
                    backgroundColor: colors
                }]
            },
            options: {
                indexAxis: 'y',
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
    }, [cities, values]);

    return <canvas id="TourCitiesChart" style={style}></canvas>;
};

export default CitiesGraph;