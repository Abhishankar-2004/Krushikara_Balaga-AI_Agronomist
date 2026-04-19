import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      {...(props as any)}
      className="bg-secondary text-white font-bold py-3 px-8 text-base rounded-full hover:bg-secondary-dark focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none disabled:opacity-60 flex items-center justify-center shadow-md hover:shadow-lg disabled:shadow-none"
    >
      {children}
    </motion.button>
  );
};

export default Button;