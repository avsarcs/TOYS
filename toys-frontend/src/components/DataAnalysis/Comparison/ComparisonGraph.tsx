import React from "react";
//import {BarChart} from '@mantine/charts';

interface ComparisonGraphProps {
    data: {[year: string]: {title: string, school1Name: string, school1Min: string, school1Max: string, school2Name: string, school2Min: string, school2Max: string}[]};
}

const ComparisonGraph: React.FC<ComparisonGraphProps> = ({data}) => {
    return "There will be a bar chart here";
    <BarChart
        h={300}
        data={data}
        dataKey="month"
        series={[
            { name: 'Smartphones', color: 'violet.6' },
            { name: 'Laptops', color: 'blue.6' },
            { name: 'Tablets', color: 'teal.6' },
        ]}
        tickLine="x"
    />

}

export default ComparisonGraph;