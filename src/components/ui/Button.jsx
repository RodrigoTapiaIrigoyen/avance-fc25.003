import React from 'react';
import clsx from 'clsx';

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  ...props 
}) => {
  return (
    <button
      className={clsx(
        'rounded-md font-semibold transition-all duration-200',
        {
          'bg-game-accent hover:bg-opacity-90 text-white': variant === 'primary',
          'bg-gray-700 hover:bg-gray-600 text-white': variant === 'secondary',
          'border-2 border-game-accent text-game-accent hover:bg-game-accent hover:text-white': variant === 'outline',
          'py-1 px-2 text-sm': size === 'sm',
          'py-2 px-4': size === 'md',
          'py-3 px-6 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;