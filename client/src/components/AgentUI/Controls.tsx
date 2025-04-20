import React from 'react';
import styles from './Controls.module.css';

interface ControlsProps {
  onStartSpeaking: () => void | Promise<void>;
  isListening: boolean;
  isProcessing: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onStartSpeaking, isListening, isProcessing }) => {
  return (
    <div className={styles.controls}>
      <button 
        className={`${styles.primaryButton} ${isListening ? styles.listening : ''} ${isProcessing ? styles.processing : ''}`} 
        onClick={onStartSpeaking}
        disabled={isProcessing}
      >
        <div className={styles.micIcon}>
          {isProcessing ? (
            <div className={styles.loadingIndicator}></div>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M12 1C14.2091 1 16 2.79086 16 5V12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12V5C8 2.79086 9.79086 1 12 1Z" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M19 10V12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12V10" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M12 19V23" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <span>{isProcessing ? 'Procesando...' : isListening ? 'Detener' : 'Hablar ahora'}</span>
      </button>
      
      <div className={styles.additionalControls}>
        <div className={styles.avatarCircle}></div>
        <div className={styles.microphoneCircle}></div>
      </div>
    </div>
  );
};

export default Controls;