
import React from 'react';

export const LoanIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M8 16v-4a4 4 0 1 1 8 0v4"></path>
    <path d="M7 12h10"></path>
    <path d="M12 16v4"></path>
    <path d="M12 2v2"></path>
    <path d="M4 12H2"></path>
    <path d="M22 12h-2"></path>
    <path d="m18.36 5.64-.82.82"></path>
    <path d="m6.46 17.54-.82.82"></path>
    <path d="m18.36 18.36-.82-.82"></path>
    <path d="m6.46 6.46-.82-.82"></path>
  </svg>
);