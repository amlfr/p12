import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import styles from './DailyActivity.module.css';

interface DailyActivityProps {
    activityInfoData: ActivityInfoData;
}

//TODO naming across app can use following terms  https://openclassrooms.notion.site/Tableau-de-bord-SportSee-6686aa4b5f44417881a4884c9af5669e?p=7ee3d83fa4944dfca5d61ffde8483d44&pm=s

export const DailyActivity: React.FC<DailyActivityProps> = ({ activityInfoData }) => {
    const graphRef = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [widthState, setWidth] = useState<number>(0);
    const [heightState, setHeight] = useState<number>(0);
    const [kgValuesState, setKgValues] = useState<number[]>([]);

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

        const parseDate = d3.timeParse('%Y-%m-%d');

        const xScale = d3
            .scaleTime()
            .domain(d3.extent(data, (d) => parseDate(d.day)) as [Date, Date])
            .range([0, widthState * 0.85]);

        const yMaxKg = d3.max(data, (d) => d.kilogram || 0);
        const yScaleKg = d3.scaleLinear().domain([yMaxKg - 8, yMaxKg + 1]).range([heightState * 0.65, 0]);
        const kgValues = yScaleKg.ticks(10);
        setKgValues(kgValues);
        const yMaxKcal = d3.max(data, (d) => d.calories || 0);
        const yScaleKcal = d3.scaleLinear().domain([0, yMaxKcal + 200]).range([heightState * 0.65, 0]);

        chart.append('g').attr('transform', `translate(0, ${heightState * 0.65})`).call(d3.axisBottom(xScale));
        chart.append('g').attr('transform', `translate(${widthState * 0.85}, 0)`).call(d3.axisRight(yScaleKg));

        svg.selectAll('.tick').remove();

        const xAxis = d3.axisBottom(xScale);

        const yAxisKg = d3.axisRight(yScaleKg);

        chart.append('g')
            .attr('transform', `translate(0, ${heightState * 0.65})`).attr('class', styles.xAxis)
            .call(xAxis)
            .attr('class', styles.xAxisTrue)
            .selectAll('text')
            .attr('class', styles.xAxisLabel);

        chart.append('g')
            .attr('transform', `translate(${widthState * 0.85}, 0)`)
            .call(yAxisKg)
            .attr('class', styles.yAxisKg)
            .selectAll('text')
            .attr('class', styles.yAxisKgLabel);

        chart.append('line')
            .attr('x1', 0)
            .attr('x2', widthState * 0.85)
            .attr('y1', yScaleKg((yMaxKg - 8 + yMaxKg + 1) / 2))
            .attr('y2', yScaleKg((yMaxKg - 8 + yMaxKg + 1) / 2))
            .attr('stroke', '#DEDEDE')
            .attr('stroke-dasharray', '4')
            .attr('class', 'dotted-line');

        chart.append('line')
            .attr('x1', 0)
            .attr('x2', widthState * 0.85)
            .attr('y1', yScaleKg(yMaxKg + 1))
            .attr('y2', yScaleKg(yMaxKg + 1))
            .attr('stroke', '#DEDEDE')
            .attr('stroke-dasharray', '4')
            .attr('class', 'dotted-line');

        const barWidth = (widthState * 0.01);

        chart
            .selectAll('.bar-kilogram')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', (d, i) => `bar-kilogram${i}`)
            .attr('x', (d) => (xScale(parseDate(d.day)) || 0) - barWidth / 2)
            .attr('y', (d) => yScaleKg(d.kilogram))
            .attr('width', barWidth)
            .attr('height', (d) => heightState * 0.65 - yScaleKg(d.kilogram))
            .attr('fill', '#282D30')
            .attr('rx', 5)
            .style('pointer-events', 'none');

        chart
            .selectAll('.bar-calories')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', (d, i) => `bar-calories${i}`)
            .attr('x', (d) => (xScale(parseDate(d.day)) || 0) + barWidth / 2)
            .attr('y', (d) => yScaleKcal(d.calories))
            .attr('width', barWidth)
            .attr('height', (d) => heightState * 0.65 - yScaleKcal(d.calories))
            .attr('fill', 'red')
            .attr('rx', 5)
            .style('pointer-events', 'none');

        const hoverGroup = chart.append('g').attr('class', styles.hoverGroup).lower();

        hoverGroup
            .selectAll('.hover-rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', (d, i) => `hover-rect hover-rect${i} ${styles.hoverRect}`)
            .attr('x', (d) => xScale(parseDate(d.day)) - barWidth * 2.5)
            .attr('y', 0)
            .attr('width', barWidth * 5)
            .attr('height', heightState * 0.65)
            .attr('fill', '#c4c4c4')
            .on('mouseover', (event, d, i) => {
                /*   const targetClass = event.target.classList[0];
                console.log('check params', event, d, i, targetClass);
                d3.select(event.target).attr('opacity', 0.2); */

                const targetElement = d3.select(event.target);
                console.log('check params', event, d, targetElement);

                targetElement.classed(styles.hoverRectActive, true); // Apply opacity correctly

                const tooltipX = xScale(parseDate(d.day)) + 50;
                const tooltipY = Math.min(yScaleKg(d.kilogram), yScaleKcal(d.calories));

                hoverGroup
                    .append('rect')
                    .attr('class', 'tooltip-rect tooltipToDelete')
                    .attr('x', tooltipX)
                    .attr('y', tooltipY)
                    .attr('width', 50)
                    .attr('height', 40)
                    .attr('rx', 5)
                    .attr('fill', '#E60000');

                hoverGroup
                    .append('text')
                    .attr('class', `${styles.tooltipText} tooltipToDelete`)
                    .attr('x', tooltipX + 25)
                    .attr('y', tooltipY + 15)
                    .attr('fill', 'white')
                    .attr('font-size', '10px')
                    .attr('text-anchor', 'middle')
                    .text(`${d.kilogram}kg`);

                hoverGroup
                    .append('text')
                    .attr('class', `${styles.tooltipText} tooltipToDelete`)
                    .attr('x', tooltipX + 25)
                    .attr('y', tooltipY + 30)
                    .attr('fill', 'white')
                    .attr('font-size', '10px')
                    .attr('text-anchor', 'middle')
                    .text(`${d.calories}kcal`);
            })
            .on('mouseout', () => {
                hoverGroup.selectAll('.tooltipToDelete').remove();

                console.log('test arget all hover rect', hoverGroup.selectAll('.targetHoverRect'));
                hoverGroup.selectAll('.hover-rect').classed(styles.hoverRectActive, false);
            });

        chart.selectAll('.bar-kilogram, .bar-calories').on('mouseover', (event, d) => {
            const hoverRect = hoverGroup.select('.hover-rect').filter((dd) => dd === d);
            hoverRect.attr('fill-opacity', 0.2);
        });

        chart.selectAll('.domain')
            .style('display', 'none');
        chart.selectAll('.tick')
            .style('display', 'none');
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
            <div
                className={styles.dayLegend}
                style={{
                    width: widthState * 0.855,
                    marginLeft: 60,
                    bottom: '13%',
                    position: 'relative',
                }}
            >
                <span className={styles.dayLegendText}>1</span>
                <span className={styles.dayLegendText}>2</span>
                <span className={styles.dayLegendText}>3</span>
                <span className={styles.dayLegendText}>4</span>
                <span className={styles.dayLegendText}>5</span>
                <span className={styles.dayLegendText}>6</span>
                <span className={styles.dayLegendText}>7</span>
            </div>
            <div
                className={styles.kgLegend}
                style={{
                    height: heightState * 0.68,
                }}
            >
                {kgValuesState.map((value, index) => (
                    <span key={index} className={styles.dayLegendText}>{value}</span>
                ))}
            </div>
        </div>
    );
};
