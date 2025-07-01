'use client';
import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
}

export const Button = ({
  label,
  onClick,
  variant,
  className = '',
  disabled = false,
}: ButtonProps) => {
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 
        rounded-md 
        transition-colors 
        duration-200 
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {label}
    </button>
  );
};
