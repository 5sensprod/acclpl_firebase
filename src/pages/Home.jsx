import React, { useContext } from 'react'
import { UserContext } from '../context/userContext'

export default function Home() {
  const { currentUser } = useContext(UserContext)

  return (
    <div className="container p-5">
      <h1 className="display-3 text-light">
        {currentUser
          ? 'Bienvenue, Gros !'
          : "Bonjour, S'insrire ou se connecter"}
      </h1>
    </div>
  )
}
