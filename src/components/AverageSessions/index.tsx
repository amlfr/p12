import {
    useEffect, useRef, useLayoutEffect, useState,
} from 'react';
import * as d3 from 'd3';
import styles from './AverageSessions.module.css';

export const AverageSessions = ({ timeInfoData }) => {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    //const tooltipRef = useRef(null);
    const shadowRef = useRef(null);

    // Use useLayoutEffect to dynamically adjust the component's size
    useLayoutEffect(() => {
        if (containerRef.current) {
            const { width, height } = svgRef.current.getBoundingClientRect();
            setSize({ width, height });
        }
    }, [containerRef.current]);

    useEffect(() => {
        if (!timeInfoData || !timeInfoData.sessions || size.width === 0 || size.height === 0) return;

        const data = timeInfoData.sessions;
        const margin = {
            top: size.width < 180 ? 40 : 20, right: size.width < 180 ? 40 : 20, bottom: size.width < 180 ? 40 : 20, left: size.width < 180 ? 40 : 20,
        };

        // Define scales
        const x = d3.scaleLinear()
            .domain([0.5, 7.5])
            .range([margin.left, size.width - margin.right]);

        const maxSessionLength = d3.max(data, (d) => d.sessionLength);

        const y = d3.scaleLinear()
            .domain([
                0,
                maxSessionLength,
            ])
            .range([size.height - margin.bottom, margin.top]);

        // Define curve
        const curve = d3.line()
            .x((d) => x(d.day))
            .y((d) => y(d.sessionLength))
            .curve(d3.curveCatmullRom.alpha(0.0));

        // Use the curve in the svg
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 2)
            .attr('d', curve)
            .attr('class', styles.svgGraph);

        // Add data points in the graph
        svg.selectAll('circle')
            .data(data)
            .join('circle')
            .attr('cx', (d) => x(d.day))
            .attr('cy', (d) => y(d.sessionLength))
            .attr('r', 4)
            .attr('fill', 'transparent')
            .attr('class', styles.circle)
            //mouseover tooltip
            .on('mouseover', (event, d) => {
                const tooltipWidth = 40;
                const tooltipHeight = 25;
                const xPos = x(d.day) + 10;
                const yPos = y(d.sessionLength) - tooltipHeight;

                svg.append('rect')
                    .attr('class', `${styles.tooltip} tooltipToDelete`)
                    .attr('x', xPos)
                    .attr('y', yPos)
                    .attr('width', tooltipWidth)
                    .attr('height', tooltipHeight)
                    .attr('fill', '#FFFFFF');

                const tooltipTarget = svg.selectAll('.tooltipToDelete');
                console.log('test tooltiptarget', tooltipTarget);

                svg.append('text')
                    .attr('class', `${styles.tooltipText} tooltipToDelete`)
                    .attr('x', xPos + tooltipWidth / 2)
                    .attr('y', yPos + tooltipHeight / 2)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .attr('font-size', '10px')
                    .text(`${d.sessionLength} min`);
            })
            .on('mouseout', () => {
                console.log('check average target event', svg.selectAll('.tootipToDelete'));

                svg.selectAll('.tooltipToDelete').remove();
            });
    }, [timeInfoData, size]);

    return (
        <div
            ref={containerRef}
            className={styles.averageSessionsContainer}
            onMouseMove={(e) => {
                if (shadowRef.current && containerRef.current) {
                    const { left, width } = containerRef.current.getBoundingClientRect();
                    const mouseX = e.clientX - left;
                    const shadowWidth = width - mouseX;
                    shadowRef.current.style.width = `${shadowWidth}px`;
                }
            }}
            onMouseLeave={() => {
                if (shadowRef.current) {
                    shadowRef.current.style.width = '0';
                }
            }}
        >
            <div ref={shadowRef} className={styles.shadowOverlay} />
            <span className={styles.title}>Durée moyenne des sessions</span>
            <svg ref={svgRef} className={styles.svgContainer} />
            <div className={styles.daysList}>
                <span className={styles.daysItem}>L</span>
                <span className={styles.daysItem}>M</span>
                <span className={styles.daysItem}>M</span>
                <span className={styles.daysItem}>J</span>
                <span className={styles.daysItem}>V</span>
                <span className={styles.daysItem}>S</span>
                <span className={styles.daysItem}>D</span>
            </div>
        </div>
    );
};
