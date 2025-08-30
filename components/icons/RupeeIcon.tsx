import React from 'react';

export const RupeeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 3h8a4 4 0 0 1 4 4v2a2 2 0 0 1-2 2H8" />
    <path d="M6 11h10" />
    <path d="M12 21L8 11" />
  </svg>
);
