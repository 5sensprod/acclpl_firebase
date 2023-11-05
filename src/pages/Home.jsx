import React, { useContext } from 'react'
import { UserContext } from '../context/userContext'
import FormWizard from '../components/form/wizard'
import GoogleSignInButton from '../components/GoogleSignInButton'
import FacebookSignInButton from '../components/FacebookSignInButton'
import EmailSignInDropdown from '../components/EmailSignInDropdown'

export default function Home() {
  const { currentUser } = useContext(UserContext)

  return (
    <div className="container p-3">
      <div className="row ">
        <div className="col-12 col-lg-6 mx-auto ">
          <h1 className="display-3 text-light mb-5">
            {currentUser
              ? 'Éco-veille: Signalement'
              : "Bonjour, S'inscrire ou se connecter"}
          </h1>

          {/* Si aucun utilisateur n'est connecté, afficher les boutons de connexion */}
          {!currentUser && (
            <>
              <div className="d-flex flex-column mt-3 gap-3 w-75 mx-auto">
                <GoogleSignInButton />
                <FacebookSignInButton />
                <EmailSignInDropdown />
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
