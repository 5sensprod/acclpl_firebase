import React from 'react'

const HeaderTitle = ({ isUserLoggedIn }) => (
  <h1 className="display-3 text-light mb-5">
    {isUserLoggedIn
      ? 'Vous êtes déjà connecté'
      : 'Ensemble contre la pollution lumineuse'}
  </h1>
)

export default HeaderTitle
