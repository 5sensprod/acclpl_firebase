import React from 'react'
import logo from '../../assets/images/logo.png'
import styles from '../styles/LogoImage.module.css' // Ajustez le chemin d'accès selon la structure de votre projet

const LogoImage = () => (
  <div className="mt-5 text-center">
    <img
      src={logo}
      alt="Logo"
      style={{
        marginTop: '20px',
        width: '25%',
        boxShadow: '0 0 25px 5px rgba(255, 255, 255, 0.7)',
        borderRadius: '50%',
      }}
      className={`${styles.glowEffect} ${styles.logoImage}`}
    />
  </div>
)

export default LogoImage
