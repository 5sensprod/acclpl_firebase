// src/pages/Home.jsx

import React, { useContext } from 'react'
import { UserContext } from '../context/userContext'
import WizardStepsContainer from '../components/Wizard/WizardStepsContainer'

export default function Home() {
  const { currentUser } = useContext(UserContext)

  return (
    <div className="container p-3">
      <h1 className="display-3 text-light">
        {currentUser
          ? 'Bienvenue, Gros !'
          : "Bonjour, S'inscrire ou se connecter"}
      </h1>

      <WizardStepsContainer />
    </div>
  )
}
