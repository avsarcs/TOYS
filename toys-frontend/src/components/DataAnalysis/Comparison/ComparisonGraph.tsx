import React from "react";
import {Chart} from "chart.js/auto";

interface ComparisonGraphProps {
    // Data to be displayed on the graph.
    data: {[year: string]: {title: string, school1Name: string, school1Min: string, school1Max: string, school2Name: string, school2Min: string, school2Max: string}[]};
    // Additional graph styling (used for setting the margin).
    style: React.CSSProperties;
}

/**
 * Bar chart graph for comparing ranking data of universities over years.
 * @param data: data to be displayed on the graph.
 */
const ComparisonGraph: React.FC<ComparisonGraphProps> = ({data, style}) => {
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

    // List of dataset groups (in this case, years).
    const years = Object.keys(data);

    // Converting the data to a format that can be used by the chart.
    const result: {title: string, data: (string | number)[], color: string}[] = [];

    // Extracting titles (university name + scholarship type) from the data.
    const titles = new Set<string>();
    for (const year in data) {
        data[year].forEach(entry => {
            titles.add(`${entry.school1Name} ${entry.title}`);
            titles.add(`${entry.school2Name} ${entry.title}`);
        });
    }

    // For each extracted title, find out the ranking.
    let i = 0; // is used for color selection.
    titles.forEach(title => {
        const dataArray: (string | number)[] = []; // Grouping all rankings of a title together.
        for (const year in data) {
            const entry = data[year].find(e => `${e.school1Name} ${e.title}` === title || `${e.school2Name} ${e.title}` === title); // Find the ranking for the title.
            if (entry) {
                if (`${entry.school1Name} ${entry.title}` === title) {
                    dataArray.push(entry.school1Min);
                } else if (`${entry.school2Name} ${entry.title}` === title) {
                    dataArray.push(entry.school2Min);
                }
            } else {
                dataArray.push("-");
            }
        }
        // dataArray: group of rankings for a title.
        // result: group of titles with their rankings, and an associated color.
        result.push({ title, data: dataArray, color: colors[i % colors.length] });
        i++;
    });

    // Preparing the chart
    const labels = years;

    const datasets = result.map(r => {
        return {
            label: r.title,
            data: r.data,
            backgroundColor: r.color
        }
    });

    // I don't know what this does.
    React.useEffect(() => {
        const ctx = document.getElementById('UniversityComparisonChart') as HTMLCanvasElement;
        const ComparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets
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
            ComparisonChart.destroy()
        }
    }, [data]); // and I don't know why there is a warning here. TODO: Find out why.

    return <canvas id="UniversityComparisonChart" style={style}></canvas>
}

export default ComparisonGraph;