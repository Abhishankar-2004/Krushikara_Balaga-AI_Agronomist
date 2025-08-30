
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="bg-secondary text-white font-bold py-3 px-8 text-base rounded-full hover:bg-secondary-dark focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all transform hover:-translate-y-0.5 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none disabled:opacity-60 flex items-center justify-center shadow-md hover:shadow-lg disabled:shadow-none"
    >
      {children}
    </button>
  );
};

export default Button;
