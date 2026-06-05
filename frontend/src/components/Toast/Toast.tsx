import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  duration = 4000, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} color="var(--color-success)" />;
      case 'error':
        return <AlertCircle size={18} color="var(--color-danger)" />;
      case 'info':
      default:
        return <Info size={18} color="var(--color-primary)" />;
    }
  };

  const toastClass = `${styles.toast} ${styles[type]}`;

  return (
    <div className={toastClass}>
      <div className={styles.iconContainer}>{getIcon()}</div>
      <div className={styles.message}>{message}</div>
      <button className={styles.closeButton} onClick={onClose} aria-label="Close message">
        <X size={16} />
      </button>
    </div>
  );
};
