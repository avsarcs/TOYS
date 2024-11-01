import React from "react";
import {Chart} from "chart.js/auto";

interface ComparisonGraphProps {
    data: {[year: string]: {title: string, school1Name: string, school1Min: string, school1Max: string, school2Name: string, school2Min: string, school2Max: string}[]};
    style: React.CSSProperties;
}

const ComparisonGraph: React.FC<ComparisonGraphProps> = ({data, style}) => {
    const colors = ['rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)']

    const years = Object.keys(data);

    const result: {title: string, data: (string | number)[], color: string}[] = [];

    const titles = new Set<string>();
    for (const year in data) {
        data[year].forEach(entry => {
            titles.add(`${entry.school1Name} ${entry.title}`);
            titles.add(`${entry.school2Name} ${entry.title}`);
        });
    }
    let i = 0;
    titles.forEach(title => {
        const dataArray: (string | number)[] = [];
        for (const year in data) {
            const entry = data[year].find(e => `${e.school1Name} ${e.title}` === title || `${e.school2Name} ${e.title}` === title);
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
    }, [data]);

    return <canvas id="UniversityComparisonChart" style={style}></canvas>
}

export default ComparisonGraph;