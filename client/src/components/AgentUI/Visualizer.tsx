import React from 'react';
import styles from './Visualizer.module.css';
import beeIcon from '@/assets/bee.gif';

interface VisualizerProps {
  message: string;
  isProcessing: boolean;
  isListening: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ message, isProcessing, isListening }) => {
  return (
    <div className={styles.visualizer}>
      <div className={`${styles.circleContainer} ${isListening ? styles.listening : ''} ${isProcessing ? styles.processing : ''}`}>
        <img src={beeIcon} alt="Bee Assistant" className={styles.beeIcon} />
      </div>
      <p className={styles.helpText}>
        {isProcessing ? 'Procesando...' : 
         isListening ? 'Escuchando...' : 
         message ? message : '¿En qué puedo ayudarte hoy?'}
      </p>
    </div>
  );
};

export default Visualizer;