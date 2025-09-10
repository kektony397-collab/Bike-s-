
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "px-6 py-3 font-semibold rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] transition-transform duration-150";

  const variantClasses = {
    primary: 'bg-primary text-on-primary hover:bg-opacity-90 focus:ring-primary',
    secondary: 'bg-secondary text-on-secondary hover:bg-opacity-90 focus:ring-secondary',
    tertiary: 'bg-tertiary text-on-tertiary hover:bg-opacity-90 focus:ring-tertiary',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Fab: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
    return (
        <button className={`w-14 h-14 bg-tertiary-container text-on-tertiary-container rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-tertiary ${className}`} {...props}>
            {children}
        </button>
    );
}

export default React.memo(Button);
