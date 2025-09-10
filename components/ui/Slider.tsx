
import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: number | string;
  unit: string;
}

const Slider: React.FC<SliderProps> = ({ label, value, unit, ...props }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-on-surface-variant mb-1">{label}: <span className="font-bold text-primary">{value} {unit}</span></label>
      <input
        type="range"
        className="w-full h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary"
        {...props}
      />
    </div>
  );
};

export default React.memo(Slider);
