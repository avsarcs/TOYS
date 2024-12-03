import React from "react";
import {Chart} from "chart.js/auto";

interface DepartmentRankingGraphProps {
    // Data to be displayed on the graph.
    data: {[year: string]: {[scholarship: string]: number}};
    // Additional graph styling (used for setting the margin).
    style: React.CSSProperties;
}

/**
 * Bar chart graph for comparing ranking data of universities over years.
 * @param data: data to be displayed on the graph.
 */
const DepartmentRankingGraph: React.FC<DepartmentRankingGraphProps> = React.memo(({ data, style }) => {
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

    const years = React.useMemo(() => Object.keys(data), [data]);

    const scholarships = React.useMemo(() => {
        const allScholarships = new Set<string>();
        Object.values(data).forEach(yearData => {
            Object.keys(yearData).forEach(scholarship => allScholarships.add(scholarship));
        });
        return Array.from(allScholarships);
    }, [data]);

    const datasets = React.useMemo(() => {
        return scholarships.map((scholarship, index) => {
            const values = years.map(year => data[year][scholarship] || 0);
            return {
                label: scholarship,
                data: values,
                backgroundColor: colors[index % colors.length]
            };
        });
    }, [data, scholarships, years]);

    React.useEffect(() => {
        const ctx = document.getElementById('DepartmentRankingChart') as HTMLCanvasElement;
        const DepartmentRankingChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: datasets
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
            DepartmentRankingChart.destroy();
        };
    }, [datasets, years]);

    return <canvas id="DepartmentRankingChart" style={style}></canvas>;
});

export default DepartmentRankingGraph;