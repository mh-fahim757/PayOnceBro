import { useState } from 'react';

/**
 * StarRating — Interactive 1-5 star rating input component
 * 
 * Props:
 *   - value: number (1-5, current rating)
 *   - onChange: function(score) - called when star is clicked
 *   - size: 'small' | 'medium' | 'large' - star size
 *   - interactive: boolean - whether rating is clickable
 */
const StarRating = ({ 
  value = 0, 
  onChange, 
  size = 'medium',
  interactive = true 
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeMap = {
    small: '16px',
    medium: '28px',
    large: '36px',
  };

  const starSize = sizeMap[size] || sizeMap.medium;
  const displayValue = hoverValue || value;

  const handleClick = (score) => {
    if (interactive && onChange) {
      onChange(score);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      <div
        onMouseLeave={() => setHoverValue(0)}
        style={{ display: 'flex', gap: '4px' }}
      >
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClick(score);
            }}
            onMouseEnter={() => interactive && setHoverValue(score)}
            style={{
              background: 'none',
              border: 'none',
              cursor: interactive ? 'pointer' : 'default',
              fontSize: starSize,
              padding: '4px',
              lineHeight: '1',
              transition: 'filter 0.1s, transform 0.1s',
              transform: interactive && (hoverValue || value) >= score ? 'scale(1.15)' : 'scale(1)',
              filter: interactive && (hoverValue || value) >= score ? 'drop-shadow(0 0 4px rgba(255, 193, 7, 0.6))' : 'none',
              userSelect: 'none',
            }}
          >
            {displayValue >= score ? '⭐' : '☆'}
          </button>
        ))}
      </div>
      <span style={{ marginLeft: '12px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>
        {displayValue > 0 ? `${displayValue}/5` : 'Not rated'}
      </span>
    </div>
  );
};

export default StarRating;
