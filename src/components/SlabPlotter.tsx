import type { Data } from 'plotly.js';
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

interface SlabPlotterProps {
    slabsNeeded: number;
    rectangles: { width: number, height: number, bottomLeft: { x: number, y: number } }[];
}

const SlabPlotter: React.FC<SlabPlotterProps> = ({ slabsNeeded, rectangles }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    const SLAB_WIDTH = 100;
    const SLAB_HEIGHT = 200;

    const traces: Data[] = [];

    for (let i = 0; i < slabsNeeded; i++) {
        const slabX = i * SLAB_WIDTH;
        const slabY = 0;

        // Draw the slab
        traces.push({
            x: [slabX, slabX + SLAB_WIDTH, slabX + SLAB_WIDTH, slabX, slabX],
            y: [slabY, slabY, slabY + SLAB_HEIGHT, slabY + SLAB_HEIGHT, slabY],
            fill: 'toself',
            type: 'scatter',
            mode: 'lines',
            line: { color: 'black' },
            fillcolor: 'rgba(0, 0, 0, 0.1)',
            name: `Slab ${i}`
        });
    }

    // Draw the rectangles
    rectangles.forEach((rect, rectIndex) => {
        const rectX = rect.bottomLeft.x;
        const rectY = rect.bottomLeft.y;

        traces.push({
            x: [rectX, rectX + rect.width, rectX + rect.width, rectX, rectX],
            y: [rectY, rectY, rectY + rect.height, rectY + rect.height, rectY],
            fill: 'toself',
            type: 'scatter',
            mode: 'lines',
            line: { color: 'blue' },
            fillcolor: 'rgba(0, 0, 255, 0.5)',
            name: `Rectangle ${rectIndex}`
        });
    });

    return (
        <Plot
            data={traces}
            layout={{ title: 'Slab Plotter', showlegend: true }}
        />
    );
};

export default SlabPlotter;