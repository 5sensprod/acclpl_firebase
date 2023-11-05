import React, { useContext } from 'react'
import { UserContext } from '../context/userContext'
import FormWizard from '../components/form/wizard'
import GoogleSignInButton from '../components/GoogleSignInButton'
import FacebookSignInButton from '../components/FacebookSignInButton'
import EmailSignInDropdown from '../components/EmailSignInDropdown'
import logo from '../assets/images/logo.png'
import styles from './Home.module.css'

export default function Home() {
  const { currentUser } = useContext(UserContext)

  return (
    <div className="container p-3">
      <div className="row ">
        <div className="col-12 col-lg-6 mt-5 text-center w-75 mx-auto">
          <h1 className="display-3 text-light mb-5">
            {currentUser
              ? 'Éco-veille: Signalement'
              : 'Ensemble contre la pollution lumineuse'}
          </h1>

          {/* Si aucun utilisateur n'est connecté, afficher les boutons de connexion */}
          {!currentUser && (
            <>
              <div className="d-flex flex-column gap-3 mx-auto">
                <GoogleSignInButton />
                <FacebookSignInButton />
                <EmailSignInDropdown />
              </div>{' '}
              <div
                className="mt-5 text-center"
                style={{
                  marginTop: '25px',
                }}
              >
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                    marginTop: '80px',
                    width: '25%',
                    boxShadow: '0 0 25px 5px rgba(255, 255, 255, 0.7)',
                    borderRadius: '50%',
                  }}
                  className={`${styles.glowEffect} ${styles.logoImage}`}
                />
              </div>
            </>
          )}

          {/* Si un utilisateur est connecté, afficher le formulaire */}
          {currentUser && <FormWizard />}
        </div>
      </div>
    </div>
  )
}
