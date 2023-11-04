// src/pages/Home.jsx

import React, { useContext } from 'react'
import { UserContext } from '../context/userContext'
import FormWizard from '../components/form/wizard'

export default function Home() {
  const { currentUser } = useContext(UserContext)

  return (
    <div className="container p-3">
      <div className="row">
        <div className="col-12 col-lg-6 mx-auto">
          <h1 className="display-3 text-light">
            {currentUser
              ? 'Éco-veille: Signalement'
              : "Bonjour, S'inscrire ou se connecter"}
          </h1>
          {currentUser && <FormWizard />}
        </div>
      </div>
    </div>
  )
}
