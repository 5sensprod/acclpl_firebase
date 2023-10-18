import React from 'react'
import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <nav className="navbar navbar-light bg-light px-4">
      <Link to="/" className="navbar-brand">
        Authjs
      </Link>
      <div>
        <button className="btn btn-primary btn-sm">S'inscrire</button>
        <button className="btn btn-primary btn-sm ms-2">Connexion</button>
        <button className="btn btn-danger btn-sm ms-2">Déconnexion</button>
      </div>
    </nav>
  )
}
