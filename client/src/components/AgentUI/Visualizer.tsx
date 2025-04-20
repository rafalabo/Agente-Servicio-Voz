import React from 'react';
import styles from './Visualizer.module.css';

const Visualizer: React.FC = () => {
  return (
    <div className={styles.visualizer}>
      <div className={styles.circleContainer}>
        <div className={styles.bubbleIcon}>
          {/* SVG chat bubble icon */}
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M21 12C21 16.9706 16.9706 21 12 21C10.2289 21 8.5735 20.5151 7.1572 19.6669L3 21L4.3331 16.8428C3.4849 15.4265 3 13.7711 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
              stroke="#ADD8E6" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <p className={styles.helpText}>¿En qué puedo ayudarte hoy?</p>
    </div>
  );
};

export default Visualizer;