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
      {/* Control eliminado según lo solicitado */}
    </div>
  );
};

export default Controls;