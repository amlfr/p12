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
        // Create a group for hover effects, now placed behind the bars but above the axis
        const hoverGroup = chart
            .append('g')
            .attr('class', 'hover-group')
            .lower(); // Moves the hover group behind the bars but above the axis

        // Bind data and create transparent hover rectangles
        hoverGroup
            .selectAll('.hover-rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'hover-rect')
            .attr('x', (d) => (xScale(d.day) || 0) + (xScale.bandwidth() - barWidth * 3) / 2) // 🟢 Centered with larger width
            .attr('y', (d) => Math.min(yScaleKg(d.kilogram), yScaleKcal(d.calories)) - 50) // 🟢 More height above
            .attr('width', barWidth * 3) // 🟢 Wider hover rectangle
            .attr('height', (d) => (heightState * 0.7) - Math.min(yScaleKg(d.kilogram), yScaleKcal(d.calories)) + 50)
            .attr('fill', 'rgba(196, 196, 196, 1)')
            .attr('fill-opacity', 0) // 🟢 Initially invisible
            .attr('rx', 5)
            .on('mouseover', function (event, d) {
                // Change opacity to show the hover rectangle
                d3.select(this).attr('fill-opacity', 0.4);

                // Red tooltip rectangle, taller and more left-aligned
                hoverGroup
                    .append('rect')
                    .attr('class', 'tooltip-rect')
                    .attr('x', (xScale(d.day) || 0) - barWidth * 2) // 🟢 Shifted left
                    .attr('y', Math.min(yScaleKg(d.kilogram), yScaleKcal(d.calories)) - 80) // 🟢 Taller rectangle
                    .attr('width', 30)
                    .attr('height', 80)
                    .attr('fill', 'red')
                    .attr('rx', 5);

                // Tooltip text
                hoverGroup
                    .append('text')
                    .attr('class', 'tooltip-text')
                    .attr('x', (xScale(d.day) || 0) - barWidth * 1.5) // 🟢 Matching left alignment
                    .attr('y', Math.min(yScaleKg(d.kilogram), yScaleKcal(d.calories)) - 50)
                    .attr('fill', 'white')
                    .attr('font-size', '10px')
                    .attr('text-anchor', 'middle')
                    .text(`${d.kilogram}kg / ${d.calories}kcal`);
            })
            .on('mouseout', function () {
                // Revert opacity and remove tooltip
                d3.select(this).attr('fill-opacity', 0);
                hoverGroup.selectAll('.tooltip-rect').remove();
                hoverGroup.selectAll('.tooltip-text').remove();
            });

        // Now handle bar hover to trigger the hover rect
        chart
            .selectAll('.bar-kilogram, .bar-calories') // Add hover effect to both bars
            .on('mouseover', (event, d) => {
                const hoverRect = hoverGroup
                    .select('.hover-rect')
                    .filter((dd) => dd === d);

                hoverRect.attr('fill-opacity', 0.4);

                // Add red tooltip rectangle on hover
                hoverGroup
                    .append('rect')
                    .attr('class', 'tooltip-rect')
                    .attr('x', (xScale(d.day) || 0) - barWidth * 2) // 🟢 Shifted left
                    .attr('y', Math.min(yScaleKg(d.kilogram), yScaleKcal(d.calories)) - 80) // 🟢 Taller rectangle
                    .attr('width', 30)
                    .attr('height', 80)
                    .attr('fill', 'red')
                    .attr('rx', 5);

                // Tooltip text
                hoverGroup
                    .append('text')
                    .attr('class', 'tooltip-text')
                    .attr('x', (xScale(d.day) || 0) - barWidth * 1.5) // 🟢 Matching left alignment
                    .attr('y', Math.min(yScaleKg(d.kilogram), yScaleKcal(d.calories)) - 50)
                    .attr('fill', 'white')
                    .attr('font-size', '10px')
                    .attr('text-anchor', 'middle')
                    .text(`${d.kilogram}kg / ${d.calories}kcal`);
            })
            .on('mouseout', () => {
                hoverGroup.selectAll('.tooltip-rect').remove();
                hoverGroup.selectAll('.tooltip-text').remove();
            });

        console.log('check data ', data);
    }, [activityInfoData, widthState]);

    return (
        <div ref={containerRef} className={styles.container}>
            <svg ref={graphRef} />
        </div>
    );
};
