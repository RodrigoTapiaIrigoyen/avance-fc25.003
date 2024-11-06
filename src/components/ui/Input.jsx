import React from 'react';
import clsx from 'clsx';

const Input = ({ className, ...props }) => {
  return (
    <input
      className={clsx(
        'w-full bg-game-secondary border border-gray-700 rounded-md px-3 py-2',
        'focus:outline-none focus:ring-2 focus:ring-game-accent',
        'text-white placeholder-gray-400',
        className
      )}
      {...props}
    />
  );
};

export default Input;