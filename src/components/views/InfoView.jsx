import React from 'react'

const InfoView = () => {
  return (
    <div className="info-view text-light p-3">
      <h2>Informations pertinentes à signaler</h2>
      <p>Voici les éléments pertinents à signaler :</p>
      <ul>
        <li>Problèmes de sécurité</li>
        <li>Problèmes de maintenance</li>
        <li>Comportements suspects</li>
        <li>Autres problèmes importants</li>
      </ul>
    </div>
  )
}

export default InfoView
