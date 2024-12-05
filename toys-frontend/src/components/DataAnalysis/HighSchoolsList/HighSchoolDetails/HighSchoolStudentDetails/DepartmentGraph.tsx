import React from "react";
import {Chart} from "chart.js/auto";

interface DepartmentGraphProps {
    // Data to be displayed on the graph.
    data: {[department: string]: number};
    // Additional graph styling (used for setting the margin).
    style: React.CSSProperties;
}

/**
 * Pie chart graph for comparing student count over departments.
 * @param data data to be displayed on the graph.
 * @param style additional graph styling (used for setting the margin).
 */
const DepartmentGraph: React.FC<DepartmentGraphProps> = ({data, style}) => {
    // Extracting department names:
    const departments = Object.keys(data);

    // Extracting values:
    const values = Object.values(data);

    // I don't know what this does.
    React.useEffect(() => {
        const ctx = document.getElementById('HighschoolStudentChart') as HTMLCanvasElement;
        const ComparisonChart = new Chart(ctx, {
            type: 'pie',
            data: {
                datasets: [{
                    data: values
                }],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: departments
            }
        });

        // Destroy the chart when the component is unmounted. Otherwise, it won't load with error.
        return () => {
            ComparisonChart.destroy()
        }
    });

    return <canvas id="HighschoolStudentChart" style={style}></canvas>
}

export default DepartmentGraph;