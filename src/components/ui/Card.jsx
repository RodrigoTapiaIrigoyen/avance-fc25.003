import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-game-secondary rounded-lg shadow-lg p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;