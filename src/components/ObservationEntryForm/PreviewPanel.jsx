export function PreviewPanel({
  companyName,
  address,
  dateOfObservation,
  timeOfObservation,
  croppedImageUrl,
}) {
  return (
    <div className="preview-panel">
      <h3>Prévisualisation de votre soumission</h3>

      <div className="company-name">
        <strong>Nom de l'entreprise:</strong>
        <p>{companyName}</p>
      </div>

      <div className="address">
        <strong>Adresse:</strong>
        <p>{address}</p>
        {/* Si vous avez une carte, vous pouvez l'intégrer ici pour afficher l'adresse sélectionnée */}
      </div>

      <div className="date-time">
        <strong>Date et heure de l'observation:</strong>
        <p>{`${dateOfObservation} à ${timeOfObservation}`}</p>
      </div>

      <div className="image-preview">
        <strong>Image:</strong>
        {croppedImageUrl && <img src={croppedImageUrl} alt="" />}
      </div>
    </div>
  )
}
