import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseClasses = 'px-6 py-3 rounded-md transition-colors duration-300 font-medium';
  const variantClasses = {
    primary: 'bg-amber-600 text-white hover:bg-amber-700',
    secondary: 'bg-white text-amber-600 border border-amber-600 hover:bg-amber-50',
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
};

export default Button;