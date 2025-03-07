import {
    useEffect, useRef, useLayoutEffect, useState,
} from 'react';
import * as d3 from 'd3';
import styles from './SkillChart.module.css';

// French translations for skill names
const translations = {
    cardio: 'Cardio',
    energy: 'Énergie',
    endurance: 'Endurance',
    strength: 'Force',
    speed: 'Vitesse',
    intensity: 'Intensité',
};

export const SkillChart = ({ performanceInfoData }) => {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const [size, setSize] = useState(0);

    // Custom order of skills at the vertices
    const skillOrder = ['intensity', 'speed', 'strength', 'endurance', 'energy', 'cardio'];

    useEffect(() => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setSize(Math.min(width, height));
        }
    }, []);

    useEffect(() => {
        if (!performanceInfoData || !performanceInfoData.data || size === 0) return;

        const { data, kind } = performanceInfoData;
        const numSides = 6;
        const levels = 5;
        //TODO CHANGE THE MAX TO BE FIXED I THINK
        const maxSkillValue = 250;
        const radius = size / 3;
        const angleSlice = (Math.PI * 2) / numSides;
        const scale = d3.scaleLinear().domain([0, maxSkillValue]).range([0, radius]);

        // Custom order
        const skillMap = {};
        data.forEach((d) => {
            skillMap[kind[d.kind]] = d.value;
        });

        const skills = skillOrder.map((skillName) => ({
            name: translations[skillName],
            value: skillMap[skillName] || 0,
        }));

        const svg = d3.select(svgRef.current)
            .attr('width', size)
            .attr('height', size);

        svg.selectAll('*').remove();

        const g = svg.append('g')
            .attr('transform', `translate(${size / 2}, ${size / 2})`);

        // Draw hexagon grid
        for (let i = 1; i <= levels; i++) {
            const levelRadius = (i / levels) * radius;
            const points = Array.from({ length: numSides }, (_, j) => [
                Math.cos(angleSlice * j - Math.PI / 2) * levelRadius,
                Math.sin(angleSlice * j - Math.PI / 2) * levelRadius,
            ]);

            g.append('polygon')
                .attr('points', points.map((p) => p.join(',')).join(' '))
                .attr('fill', 'none')
                .attr('stroke', '#ddd')
                .attr('stroke-width', 1);
        }

        // Draw the red skill area
        const skillPoints = skills.map((skill, i) => [
            Math.cos(angleSlice * i - Math.PI / 2) * scale(skill.value),
            Math.sin(angleSlice * i - Math.PI / 2) * scale(skill.value),
        ]);

        g.append('polygon')
            .attr('points', skillPoints.map((p) => p.join(',')).join(' '))
            .attr('fill', 'red')
            .attr('opacity', 0.5)
            .attr('stroke', 'red')
            .attr('stroke-width', 2);

        // Add skill labels at each vertex
        skills.forEach((skill, i) => {
            const x = Math.cos(angleSlice * i - Math.PI / 2) * (radius + 20);
            const y = Math.sin(angleSlice * i - Math.PI / 2) * (radius + 20);

            g.append('text')
                .attr('x', x)
                .attr('y', y)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('fill', 'white')
                .style('font-size', '12px')
                .text(skill.name);
        });
    }, [performanceInfoData, size]);

    return (
        <div
            ref={containerRef}
            className={styles.skillContainer}
        >
            <svg ref={svgRef} />
        </div>
    );
};
