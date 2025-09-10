
import React, { useMemo } from 'react';

interface SpeedometerProps {
  speed: number;
}

const Speedometer: React.FC<SpeedometerProps> = ({ speed }) => {
  const optimalMin = 40;
  const optimalMax = 55;
  
  const color = useMemo(() => {
    if (speed >= optimalMin && speed <= optimalMax) return '#4caf50'; // Green
    if (speed > optimalMax && speed <= 70) return '#ffeb3b'; // Yellow
    if (speed > 70) return '#f44336'; // Red
    return '#60a5fa'; // Blue for low speeds
  }, [speed]);

  return (
    <div className="flex flex-col items-center justify-center bg-inverse-surface p-4 rounded-3xl shadow-inner">
      <div className="font-mono relative">
        <span className="text-7xl font-bold" style={{ color }}>
          {Math.round(speed).toString().padStart(3, '0')}
        </span>
        <span className="absolute bottom-2 -right-8 text-2xl text-inverse-on-surface/70">km/h</span>
      </div>
      <div className="text-sm text-inverse-on-surface/80 mt-2">
        Optimal Speed: {optimalMin}-{optimalMax} km/h
      </div>
    </div>
  );
};

export default React.memo(Speedometer);
