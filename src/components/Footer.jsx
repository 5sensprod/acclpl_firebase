import React from 'react'
import { Facebook } from 'react-bootstrap-icons'
import styles from './styles/Footer.module.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark text-light fixed-bottom shadow p-0 p-3 text-center">
      <small>
        <a
          href="https://www.facebook.com/profile.php?id=61552019534082"
          target="_blank"
          rel="noopener noreferrer"
          className={`text-light ${styles.link} ${styles.noUnderline}`}
        >
          <Facebook className="me-2" />
          Acclpl™
        </a>
      </small>{' '}
      <small className={`text-light ${styles.tradeMark}`}>
        &copy; {currentYear} Tous droits réservés.
      </small>
    </footer>
  )
}

export default Footer
