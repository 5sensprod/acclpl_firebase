import { useModal } from './ModalContext'

const useShowEstablishmentModal = (setIsLoading, dispatch) => {
  const { setModalConfig } = useModal()

  const showEstablishmentModal = (duplicateCheckResult) => {
    const {
      details: {
        establishmentName,
        streetName,
        city,
        postalCode,
        streetNumber,
        photoURL,
        coordinates,
      },
    } = duplicateCheckResult

    const fullAddress = streetNumber
      ? `${streetNumber} ${streetName}, ${postalCode} ${city}`
      : `${streetName}, ${postalCode} ${city}`

    const image = new Image()
    image.src = photoURL
    image.onload = () => {
      setModalConfig({
        isVisible: true,
        title: 'Etablissement existant',
        body: (
          <div>
            <div className="bg-dark text-light d-flex justify-content-around align-items-center p-3 mb-3 rounded">
              <div>
                <h3 className="mb-2">{establishmentName}</h3>
                <p className="mb-0">{fullAddress.split(',')[0]}</p>
                <p className="mb-2">{city}</p>
              </div>
              <div>
                <img
                  src={photoURL}
                  alt="Observation"
                  className="rounded"
                  style={{ width: '80px', height: '80px' }}
                />
              </div>
            </div>
            <h5 className="mb-2">Est-ce en lien avec votre signalement ?</h5>
          </div>
        ),
        buttons: [
          {
            text: 'Oui',
            onClick: () => {
              dispatch({
                type: 'UPDATE_FORM_DATA',
                payload: {
                  companyAddress: fullAddress,
                  companyCoordinates: coordinates,
                },
              })
              dispatch({ type: 'NEXT_STEP' })
              dispatch({ type: 'UPDATE_HAS_CLOSED_MODAL', payload: true })
              setModalConfig((prevConfig) => ({
                ...prevConfig,
                isVisible: false,
              }))
            },
          },
          {
            text: 'Non',
            onClick: () => {
              dispatch({ type: 'NEXT_STEP' })
              dispatch({ type: 'UPDATE_HAS_CLOSED_MODAL', payload: true })
              setModalConfig((prevConfig) => ({
                ...prevConfig,
                isVisible: false,
              }))
              dispatch({ type: 'CLOSE_MODAL' })
            },
          },
        ],
      })
      setIsLoading(false)
    }
  }

  return showEstablishmentModal
}

export default useShowEstablishmentModal
