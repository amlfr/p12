import {
    useEffect, useRef, useLayoutEffect, useState,
} from 'react';
import * as d3 from 'd3';
import styles from './AverageSessions.module.css';

export const AverageSessions = ({ timeInfoData }) => {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    // Use useLayoutEffect to dynamically adjust the component's size
    useLayoutEffect(() => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setSize({ width, height });
        }
    }, []);

    useEffect(() => {
        if (!timeInfoData || !timeInfoData.sessions || size.width === 0 || size.height === 0) return;

        const data = timeInfoData.sessions;
        const margin = {
            top: 20, right: 20, bottom: 20, left: 20,
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
            .curve(d3.curveCatmullRom.alpha(0.2));

        // Use the curve in the svg
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 2)
            .attr('d', curve)
            .attr('class', styles.path)
            .attr('transform', 'translate(0, -20)');

        svg.selectAll('circle')
            .data(data)
            .join('circle')
            .attr('cx', (d) => x(d.day))
            .attr('cy', (d) => y(d.sessionLength))
            .attr('r', 4)
            .attr('fill', 'transparent')
            .attr('class', styles.circle);

        console.log('check circles', svg.selectAll('circle'));
    }, [timeInfoData, size]);

    return (
        <div ref={containerRef} className={styles.averageSessionsContainer}>
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
