import React from 'react';

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <svg
        className="w-16 h-16 animate-spin"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>{`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
            .spinner {
              animation: spin 1.5s linear infinite;
              transform-origin: center;
            }
          `}</style>
        </defs>
        <g className="spinner">
          {/* Outer circle */}
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2"
            opacity="0.3"
          />
          
          {/* Animated arc */}
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="url(#gradientSpinner)"
            strokeWidth="3"
            strokeDasharray="31.4 94.2"
            strokeLinecap="round"
          />
          
          <defs>
            <linearGradient id="gradientSpinner" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
          </defs>
        </g>
      </svg>
      <p className="text-white text-lg font-semibold tracking-wide">Loading...</p>
    </div>
  );
}

export default LoadingSpinner;
