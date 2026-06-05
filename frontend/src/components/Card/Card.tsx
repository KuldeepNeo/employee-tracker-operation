import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  interactive = false, 
  onClick 
}) => {
  const cardClassName = `${styles.card} ${interactive ? styles.interactive : ''} ${className}`;
  
  return (
    <div className={cardClassName} onClick={onClick}>
      {children}
    </div>
  );
};
