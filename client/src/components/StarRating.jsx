import React from 'react';

//maybe change to look more like stars
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 fill-current text-yellow-500"
          viewBox="0 0 20 20"
          style={{ filter: index < rating ? 'drop-shadow(0 2px 2px rgba(0, 0, 0, 0.5))' : 'none' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 3.16l1.9 4.75H18l-3.25 2.5.95 5.75L10 14.24l-4.7 3.22.95-5.75L2 7.91h5.1L10 3.16z"
            className={index < rating ? 'text-yellow-500' : 'text-gray-400'}
          />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;


