import React from 'react'
import { Facebook } from 'react-bootstrap-icons'
import styles from './styles/Footer.module.css'

const Footer = () => {
  const currentYear = new Date().getFullYear() // Obtient l'année en cours

  return (
    <footer
      className={`bg-dark text-light shadow-lg p-0 ${styles.absoluteBottom} p-3 text-center`}
    >
      <small>
        <a
          href="https://www.facebook.com/profile.php?id=61552019534082"
          target="_blank"
          rel="noopener noreferrer"
          className={`text-light ${styles.hoverEffect} ${styles.noUnderline}`}
        >
          <Facebook className="me-2" /> {/* Icône Facebook */}
          Acclpl™
        </a>
      </small>{' '}
      <small className="text-light">
        &copy; {currentYear} Tous droits réservés.
      </small>
    </footer>
  )
}

export default Footer
