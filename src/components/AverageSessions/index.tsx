import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styles from './AverageSessions.module.css';

export const AverageSessions = ({ timeInfoData }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (!timeInfoData || !timeInfoData.sessions) return;

        const data = timeInfoData.sessions;

        const width = 300;//TODO BIND TO REAL SIZE
        const height = 200;
        const margin = {
            top: 20, right: 20, bottom: 20, left: 20,
        };

        //define scale
        const x = d3
            .scaleLinear()
            .domain([1, 7])
            .range([margin.left, width - margin.right]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.sessionLength)])
            .range([height - margin.bottom, margin.top]);

        //define curve
        const curve = d3
            .line()
            .x((d) => x(d.day))
            .y((d) => y(d.sessionLength))
            .curve(d3.curveCatmullRom.alpha(0.5));

        //use the curve in a svg
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 2)
            .attr('d', curve);

        svg.selectAll('circle')
            .data(data)
            .join('circle')
            .attr('cx', (d) => x(d.day))
            .attr('cy', (d) => y(d.sessionLength))
            .attr('r', 4)
            .attr('fill', '#ffffff');
    }, [timeInfoData]);

    return (
        <div className={styles.averageSessionsContainer}>
            <span className={styles.title}>Durée moyenne des sessions</span>
            <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 300 200" />
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
