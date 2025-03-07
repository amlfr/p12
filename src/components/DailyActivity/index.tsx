import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import styles from './DailyActivity.module.css';

interface DailyActivityProps {
    activityInfoData: ActivityInfoData;
}

export const DailyActivity: React.FC<DailyActivityProps> = ({ activityInfoData }) => {
    const graphRef = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [widthState, setWidth] = useState<number>(0);
    const [heightState, setHeight] = useState<number>(0);

    // Dynamically adjust size based on container dimensions
    useEffect(() => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setWidth(width);
            setHeight(height);
            console.log('check svg dimensions state ', widthState, heightState);
            console.log('check svg dimensions ', width, height);
        }
    }, []);

    useEffect(() => {
        if (!graphRef.current || widthState === 0) return;

        const data = activityInfoData.sessions;

        // Clear any existing graph
        const svg = d3.select(graphRef.current);
        svg.selectAll('*').remove();

        const chart = svg
            .attr('width', widthState)
            .attr('height', heightState)
            .append('g')
            .attr('transform', 'translate( 20 , 20 )'); // USE PERCENTAGES

        // X Scale
        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d.day))
            .range([0, widthState * 0.8]);

        // Y Scale kilogram
        const yMaxKg = d3.max(data, (d) => d.kilogram || 0);
        const yScaleKg = d3.scaleLinear().domain([0, yMaxKg]).range([heightState * 0.7, 0]);

        // Y Scale kcal
        const yMaxKcal = d3.max(data, (d) => d.calories || 0);
        const yScaleKcal = d3.scaleLinear().domain([0, yMaxKcal]).range([heightState * 0.7, 0]);

        // X Axis
        chart
            .append('g')
            .attr('transform', `translate(0, ${heightState * 0.7})`)
            .call(d3.axisBottom(xScale));

        // Y Axis Kg
        chart
            .append('g')
            .attr('transform', `translate(${widthState * 0.8}, 0)`)
            .call(d3.axisRight(yScaleKg));

        // Y Axis Kcal
        chart
            .append('g')
            .call(d3.axisLeft(yScaleKcal));

        // Add Bars
        const barWidth = xScale.bandwidth() * 0.1;

        //Add horizontal dashed lines at max and half
        chart
            .append('line')
            .attr('x1', 0)
            .attr('x2', widthState * 0.8)
            .attr('y1', yScaleKg(yMaxKg / 2))
            .attr('y2', yScaleKg(yMaxKg / 2))
            .attr('stroke', 'grey')
            .attr('stroke-dasharray', '4');

        chart
            .append('line')
            .attr('x1', 0)
            .attr('x2', widthState * 0.8)
            .attr('y1', yScaleKg(yMaxKg))
            .attr('y2', yScaleKg(yMaxKg))
            .attr('stroke', 'grey')
            .attr('stroke-dasharray', '4');

        // Grey Bars
        chart
            .selectAll('.bar-kilogram')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar-kilogram')
            .attr('x', (d) => (xScale(d.day) || 0) + (xScale.bandwidth() - barWidth) / 2 - barWidth / 2)
            .attr('y', (d) => yScaleKg(d.kilogram))
            .attr('width', barWidth)
            .attr('height', (d) => (heightState * 0.7) - yScaleKg(d.kilogram))
            .attr('fill', '#282D30')
            .attr('rx', 5);

        // Red Bars
        chart
            .selectAll('.bar-calories')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar-calories')
            .attr('x', (d) => (xScale(d.day) || 0) + (xScale.bandwidth() - barWidth) / 2 + barWidth / 2)
            .attr('y', (d) => yScaleKcal(d.calories))
            .attr('width', barWidth)
            .attr('height', (d) => (heightState * 0.7) - yScaleKcal(d.calories))
            .attr('fill', 'red')
            .attr('rx', 5);

        console.log('check data ', data);
    }, [activityInfoData, widthState]);

    return (
        <div ref={containerRef} className={styles.container}>
            <svg ref={graphRef} />
        </div>
    );
};
