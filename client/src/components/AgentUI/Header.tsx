import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.agentName}>
        <span>Sofía | Asistente</span>
      </div>
      <div className={styles.statusIndicator}>
        <div className={styles.statusDot}></div>
        <span>Disponible</span>
      </div>
    </header>
  );
};

export default Header;