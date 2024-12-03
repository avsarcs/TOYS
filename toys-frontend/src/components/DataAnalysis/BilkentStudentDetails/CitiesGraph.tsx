import React from "react";
import {Chart} from "chart.js/auto";

interface CitiesGraphProps {
    // Data to be displayed on the graph.
    data: {[city: string]: number};
    // Additional graph styling (used for setting the margin).
    style: React.CSSProperties;
}

/**
 * Pie chart graph for comparing student count over cities.
 * @param data data to be displayed on the graph.
 * @param style additional graph styling (used for setting the margin).
 */
const CitiesGraph: React.FC<CitiesGraphProps> = React.memo(({ data, style }) => {
    const cities = Object.keys(data);
    const values = Object.values(data);

    React.useEffect(() => {
        const ctx = document.getElementById('StudentCitiesChart') as HTMLCanvasElement;
        const ComparisonChart = new Chart(ctx, {
            type: 'pie',
            data: {
                datasets: [{ data: values }],
                labels: cities
            }
        });

        return () => {
            ComparisonChart.destroy();
        };
    }, [data]);

    return <canvas id="StudentCitiesChart" style={style}></canvas>;
});

export default CitiesGraph;