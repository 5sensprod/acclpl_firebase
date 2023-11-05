import React, { useContext } from 'react'
import { UserContext } from '../context/userContext'
import FormWizard from '../components/form/wizard'
import GoogleSignInButton from '../components/GoogleSignInButton'
import FacebookSignInButton from '../components/FacebookSignInButton'

export default function Home() {
  const { currentUser } = useContext(UserContext)

  return (
    <div className="container p-3">
      <div className="row">
        <div className="col-12 col-lg-6 mx-auto">
          <h1 className="display-3 text-light mb-5">
            {currentUser
              ? 'Éco-veille: Signalement'
              : "Bonjour, S'inscrire ou se connecter"}
          </h1>

          {/* Affiche le bouton de connexion Google uniquement si aucun utilisateur n'est actuellement connecté */}
          {!currentUser && (
            <>
              <GoogleSignInButton />
              <FacebookSignInButton />
            </>
          )}

          {/* Affiche le formulaire si un utilisateur est connecté */}
          {currentUser && <FormWizard />}
        </div>
      </div>
    </div>
  )
}
