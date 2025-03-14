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

    useEffect(() => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setWidth(width);
            setHeight(height);
        }
    }, []);

    useEffect(() => {
        if (!graphRef.current || widthState === 0) return;

        const data = activityInfoData.sessions;

        const svg = d3.select(graphRef.current);
        svg.selectAll('*').remove();

        const chart = svg
            .attr('width', widthState)
            .attr('height', heightState)
            .append('g')
            .attr('transform', 'translate(60, 60)');

        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d.day))
            .range([0, widthState * 0.85])
            .padding(0.2);

        const yMaxKg = d3.max(data, (d) => d.kilogram || 0);
        const yMinKg = d3.min(data, (d) => d.kilogram || 0);
        const yScaleKg = d3.scaleLinear().domain([yMinKg + 1, yMaxKg]).range([heightState * 0.7, 0]);

        const yMaxKcal = d3.max(data, (d) => d.calories || 0);
        const yScaleKcal = d3.scaleLinear().domain([0, yMaxKcal]).range([heightState * 0.7, 0]);

        chart.append('g').attr('transform', `translate(0, ${heightState * 0.7})`).call(d3.axisBottom(xScale));
        chart.append('g').attr('transform', `translate(${widthState * 0.8}, 0)`).call(d3.axisRight(yScaleKg));
        chart.append('g').call(d3.axisLeft(yScaleKcal));

        svg.selectAll('.tick').remove();

        const barWidth = xScale.bandwidth() * 0.1;

        chart
            .append('line')
            .attr('x1', 0)
            .attr('x2', widthState * 0.85)
            .attr('y1', yScaleKg(yMaxKg / 2))
            .attr('y2', yScaleKg(yMaxKg / 2))
            .attr('stroke', 'var(--chart-dotted-line)')
            .attr('stroke-dasharray', '4');

        /* chart
            .append('line')
            .attr('x1', 0)
            .attr('x2', widthState * 0.8)
            .attr('y1', yScaleKg(yMaxKg ))
            .attr('y2', yScaleKg(yMaxKg))
            .attr('stroke', 'grey')
            .attr('stroke-dasharray', '4'); */

        //TODO REPAIR MAX KG LINE

        // Grey Bars (Kilograms on left side)
        chart
            .selectAll('.bar-kilogram')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar-kilogram')
            .attr('x', (d) => (xScale(d.day) || 0) + (xScale.bandwidth() - barWidth) / 2 - barWidth / 2)
            .attr('y', (d) => yScaleKg(d.kilogram))
            .attr('width', barWidth)
            .attr('height', (d) => heightState * 0.7 - yScaleKg(d.kilogram))
            .attr('fill', '#282D30')
            .attr('rx', 5);

        // Red Bars (Calories on right side)
        chart
            .selectAll('.bar-calories')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar-calories')
            .attr('x', (d) => (xScale(d.day) || 0) + (xScale.bandwidth() - barWidth) / 2 + barWidth / 2)
            .attr('y', (d) => yScaleKcal(d.calories))
            .attr('width', barWidth)
            .attr('height', (d) => heightState * 0.7 - yScaleKcal(d.calories))
            .attr('fill', 'red')
            .attr('rx', 5);

        const hoverGroup = chart
            .append('g')
            .attr('class', 'hover-group')
            .lower();

        hoverGroup
            .selectAll('.hover-rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'hover-rect')
            .attr('x', (d) => (xScale(d.day) || 0) + (xScale.bandwidth() - barWidth * 5) / 2)
            .attr('y', (d) => Math.min(yScaleKg(d.kilogram), yScaleKcal(d.calories)) - 50)
            .attr('width', barWidth * 5)
            .attr('height', (d) => heightState * 0.7 - Math.min(yScaleKg(d.kilogram), yScaleKcal(d.calories)) + 50)
            .attr('fill', '#c4c4c4')
            .attr('fill-opacity', 0)
            .on('mouseover', function (event, d) {
                d3.select(this).attr('fill-opacity', 0.4);

                hoverGroup
                    .append('rect')
                    .attr('class', 'tooltip-rect')
                    .attr('x', (xScale(d.day) || 0) - barWidth * 2)
                    .attr('y', Math.min(yScaleKg(d.kilogram), yScaleKcal(d.calories)) - 80)
                    .attr('width', 30)
                    .attr('height', 80)
                    .attr('fill', 'red');

                hoverGroup
                    .append('text')
                    .attr('class', 'tooltip-text')
                    .attr('x', (xScale(d.day) || 0) - barWidth * 1.5)
                    .attr('y', Math.min(yScaleKg(d.kilogram), yScaleKcal(d.calories)) - 50)
                    .attr('fill', 'white')
                    .attr('font-size', '7px')
                    .attr('text-anchor', 'middle')
                    .text(`${d.kilogram}kg  ${d.calories}kcal`);
            })
            .on('mouseout', function () {
                d3.select(this).attr('fill-opacity', 0);
                hoverGroup.selectAll('.tooltip-rect').remove();
                hoverGroup.selectAll('.tooltip-text').remove();
            });

        chart
            .selectAll('.bar-kilogram, .bar-calories')
            .on('mouseover', (event, d) => {
                const hoverRect = hoverGroup
                    .select('.hover-rect')
                    .filter((dd) => dd === d);

                hoverRect.attr('fill-opacity', 0.4);

                hoverGroup
                    .append('rect')
                    .attr('class', 'tooltip-rect')
                    .attr('x', (xScale(d.day) || 0) - barWidth * 2)
                    .attr('y', Math.min(yScaleKg(d.kilogram), yScaleKcal(d.calories)) - 80)
                    .attr('width', 30)
                    .attr('height', 80)
                    .attr('fill', 'red');

                hoverGroup
                    .append('text')
                    .attr('class', 'tooltip-text')
                    .attr('x', (xScale(d.day) || 0) - barWidth * 1.5)
                    .attr('y', Math.min(yScaleKg(d.kilogram), yScaleKcal(d.calories)) - 50)
                    .attr('fill', 'white')
                    .attr('font-size', '7px')
                    .attr('text-anchor', 'middle')
                    .text(`${d.kilogram}kg  ${d.calories}kcal`);
            })
            .on('mouseout', () => {
                hoverGroup.selectAll('.tooltip-rect').remove();
                hoverGroup.selectAll('.tooltip-text').remove();
            });
    }, [activityInfoData, widthState]);

    return (
        <div ref={containerRef} className={styles.container}>
            <div className={styles.chartInfo}>
                <span className={styles.title}>Activité quotidienne</span>
                <div className={styles.legendContainer}>
                    <div className={styles.svgContainer}>
                        <svg height="8" width="8">
                            <circle r="4" cx="4" cy="4" fill="#282D30" />
                        </svg>
                    </div>
                    <span className={styles.legendText}>Poids (kg)</span>
                    <div className={styles.svgContainer}>
                        <svg height="8" width="8">
                            <circle r="4" cx="4" cy="4" fill="#E60000" />
                        </svg>
                    </div>
                    <span className={styles.legendText}>Calories brûlées (kCal)</span>
                </div>
            </div>
            <svg ref={graphRef} />
        </div>
    );
};
