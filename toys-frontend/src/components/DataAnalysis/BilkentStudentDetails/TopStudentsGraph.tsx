import React from "react";
import {Chart} from "chart.js/auto";

interface TopStudentsGraphProps {
    // Data to be displayed on the graph.
    data: {[year: string]: number};
    // Additional graph styling (used for setting the margin).
    style: React.CSSProperties;
}

/**
 * Bar chart graph for comparing number of students coming from top 10 universities.
 * @param data: data to be displayed on the graph.
 */
const TopStudentsGraph: React.FC<TopStudentsGraphProps> = React.memo(({ data, style }) => {
    const years = Object.keys(data);
    const values = Object.values(data);

    React.useEffect(() => {
        const ctx = document.getElementById('TopStudentsChart') as HTMLCanvasElement;
        const ComparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [{
                    data: values,
                    label: "Öğrenci Sayısı"
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
    }, [years, values]);

    return <canvas id="TopStudentsChart" style={style}></canvas>;
});

export default TopStudentsGraph;