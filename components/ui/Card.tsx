
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-surface-variant/50 rounded-3xl p-4 sm:p-6 shadow-lg backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
};

export default React.memo(Card);
