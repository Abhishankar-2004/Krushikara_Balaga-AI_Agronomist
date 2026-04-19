import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-xl dark:shadow-none dark:border dark:border-slate-800 p-6 sm:p-8 md:p-10 w-full max-w-4xl mx-auto transition-shadow duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;