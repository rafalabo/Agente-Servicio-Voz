import React from 'react';
import styles from './Header.module.css';
import watsonxLogo from '@/assets/watsonx.png';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img src={watsonxLogo} alt="Watsonx Logo" className={styles.logo} />
      </div>
      <div className={styles.agentName}>
        <span>Andrea</span>
      </div>
      <div className={styles.poweredBy}>
        <span>Powered by IBM Watsonx.ai</span>
      </div>
    </header>
  );
};

export default Header;