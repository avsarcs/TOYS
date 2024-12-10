import React from "react";
import {Chart} from "chart.js/auto";

interface HighSchoolsGraphProps {
    // Data to be displayed on the graph.
    data: {[highSchool: string]: number};
    // Additional graph styling (used for setting the margin).
    style: React.CSSProperties;
}

/**
 * Pie chart graph for comparing student count over high schools.
 * @param data data to be displayed on the graph.
 * @param style additional graph styling (used for setting the margin).
 */
const HighSchoolsGraph: React.FC<HighSchoolsGraphProps> = React.memo(({ data, style }) => {
    const highSchools = React.useMemo(() => Object.keys(data), [data]);
    const values = React.useMemo(() => Object.values(data), [data]);

    React.useEffect(() => {
        const ctx = document.getElementById('StudentHighSchoolsChart') as HTMLCanvasElement;
        const ComparisonChart = new Chart(ctx, {
            type: 'pie',
            data: {
                datasets: [{ data: values }],
                labels: highSchools
            }
        });

        return () => {
            ComparisonChart.destroy();
        };
    }, [values, highSchools]);

    return <canvas id="StudentHighSchoolsChart" style={style}></canvas>;
});

export default HighSchoolsGraph;