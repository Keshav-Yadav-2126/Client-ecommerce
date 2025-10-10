import React from 'react';
import { Star } from 'lucide-react';

const StarRatingComponent = ({ rating, handleRatingChange, readonly = false }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && handleRatingChange && handleRatingChange(star)}
          disabled={readonly}
          className={`transition-all duration-200 ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          }`}
        >
          <Star
            className={`w-6 h-6 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRatingComponent;