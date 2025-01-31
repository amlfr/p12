import {
    useEffect, useRef, useLayoutEffect, useState,
} from 'react';
import * as d3 from 'd3';

export const OverallScore = ({ score }) => {
    const progressBarRef = useRef(null);
    const containerRef = useRef(null);
    const [size, setSize] = useState(0);

    // Dynamically get the size of the container
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

        // Background Circle (Grey Track)
        svgGroup.append('circle')
            .attr('r', radius)
            .attr('fill', 'none')
            .attr('stroke', '#ddd')
            .attr('stroke-width', thickness);

        // Arc generator (starting from the top)
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
            style={{
                width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
        >
            <svg ref={progressBarRef} />
            <div style={{ position: 'absolute', fontSize: '24px', fontWeight: 'bold' }}>
                {Math.round(score * 100)}
                %
            </div>
        </div>
    );
};
