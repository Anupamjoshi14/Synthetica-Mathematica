import React from 'react';

interface GeometricVisualizerProps {
  svgString: string;
}

const GeometricVisualizer = ({ svgString }: GeometricVisualizerProps) => {
  if (!svgString) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 italic">
        No diagram available.
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
};

export default GeometricVisualizer;
