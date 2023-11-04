import React, { useEffect } from 'react'
import { useFormWizardState } from '../context/FormWizardContext'
import NameCompany from '../inputs/NameCompany'
import GeolocateAddress from '../inputs/GeolocateAddress'
import DateTimeInput from '../inputs/DateTimeInput'
import PhotoCapture from '../PhotoCapture'
import { motion } from 'framer-motion'
import { formatAddress } from '../../../utils/addressUtils'
import Notes from '../inputs/Notes'

const slideVariants = {
  initial: { opacity: 0, x: '-100vw' },
  enter: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: '100vw' },
}

const AnimatedWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="enter"
    exit="exit"
    variants={slideVariants}
  >
    {children}
  </motion.div>
)

export const Step1Component = (props) => {
  const { state, dispatch } = useFormWizardState()

  const handleCompanyNameChange = (event) => {
    const value = event.target.value

    // Mettre à jour le nom de l'entreprise dans l'état global
    dispatch({
      type: 'UPDATE_FORM_DATA',
      payload: { companyName: value },
    })

    // Réinitialiser l'état hasClosedModal
    dispatch({ type: 'RESET_HAS_CLOSED_MODAL' })
  }

  return (
    <AnimatedWrapper>
      <NameCompany
        value={state.formData.companyName}
        onChange={handleCompanyNameChange}
        {...props}
      />
    </AnimatedWrapper>
  )
}

export const Step2Component = (props) => {
  const { state, dispatch } = useFormWizardState()

  useEffect(() => {
    // Effectuer l'opération de formatage de l'adresse
    if (state.formData.companyAddress) {
      try {
        const addressComponents = formatAddress(state.formData.companyAddress)
        dispatch({
          type: 'FORMAT_ADDRESS',
          payload: addressComponents,
        })
      } catch (error) {
        console.error("Erreur lors du formatage de l'adresse:", error)
      }
    }
  }, [state.formData.companyAddress, dispatch])

  const handleSelectAddress = (coords) => {
    if (!state.hasCoordinatesFromDuplicateModal) {
      dispatch({
        type: 'UPDATE_FORM_DATA',
        payload: {
          companyCoordinates: coords,
        },
      })
    }
  }

  return (
    <AnimatedWrapper>
      <GeolocateAddress
        onSelectAddress={handleSelectAddress}
        currentCoords={state.formData.companyCoordinates}
        moveToNextStep={() => dispatch({ type: 'NEXT_STEP' })}
      />
    </AnimatedWrapper>
  )
}

export const Step3Component = () => (
  <AnimatedWrapper>
    <DateTimeInput />
  </AnimatedWrapper>
)

export const Step4Component = () => {
  return (
    <AnimatedWrapper>
      <div className="d-flex flex-column gap-1">
        <PhotoCapture />
        <Notes />
      </div>
    </AnimatedWrapper>
  )
}
