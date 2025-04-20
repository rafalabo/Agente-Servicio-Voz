import React, { useState } from 'react';
import Header from './Header';
import Visualizer from './Visualizer';
import Controls from './Controls';
import styles from './AgentUI.module.css';

const AgentUI: React.FC = () => {
  const [isListening, setIsListening] = useState(false);

  const handleStartSpeaking = () => {
    setIsListening(true);
    // Aquí iría la lógica para iniciar la grabación de voz
    setTimeout(() => {
      setIsListening(false);
    }, 3000); // Simulación de grabación por 3 segundos
  };

  return (
    <div className={styles.container}>
      <Header />
      <Visualizer />
      <Controls onStartSpeaking={handleStartSpeaking} />
    </div>
  );
};

export default AgentUI;