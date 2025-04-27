import {
    useEffect, useRef, useLayoutEffect, useState,
} from 'react';
import * as d3 from 'd3';
import styles from './OverallScore.module.css';

export const OverallScore = ({ score }) => {
    const progressBarRef = useRef(null);
    const containerRef = useRef(null);
    const [size, setSize] = useState(0);

    useLayoutEffect(() => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setSize(Math.min(width, height));
        }
    }, []);

    useEffect(() => {
        if (!progressBarRef.current || size === 0) return;

        const radius = size / 2.5;
        const thickness = 14;

        const svg = d3
            .select(progressBarRef.current)
            .attr('width', size)
            .attr('height', size);

        svg.selectAll('*').remove();

        const svgGroup = svg.append('g').attr('transform', `translate(${size / 2}, ${size / 2})`);

        // Background Circle
        svgGroup.append('circle')
            .attr('r', radius)
            .attr('fill', 'white')
            .attr('stroke', '#FBFBFB')
            .attr('stroke-width', thickness);

        // Red circle
        const arc = d3
            .arc()
            .innerRadius(radius - thickness / 2)
            .outerRadius(radius + thickness / 2)
            .startAngle(0)
            .endAngle(0 - score * 2 * Math.PI)
            .cornerRadius(7);

        svgGroup.append('path')
            .attr('fill', 'red')
            .attr('d', arc());
    }, [score, size]);

    return (
        <div
            ref={containerRef}
            className={styles.container}
        >
            <svg ref={progressBarRef} />
            <div className={styles.textContainer}>
                {Math.round(score * 100)}
                %
                <br />
                <span className={styles.scoreText}>de votre objectif</span>
            </div>
        </div>
    );
};
