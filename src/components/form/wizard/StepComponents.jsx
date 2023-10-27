import React from 'react'
import { useFormWizardState } from './FormWizardContext'
import NameCompany from '../inputs/NameCompany'
import GeolocateAddress from '../inputs/GeolocateAddress'
import DateTimeInput from '../inputs/DateTimeInput'
import { motion } from 'framer-motion'

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
    dispatch({
      type: 'UPDATE_FORM_DATA',
      payload: { companyName: value },
    })
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

  const handleSelectAddress = (coords) => {
    dispatch({
      type: 'UPDATE_FORM_DATA',
      payload: {
        companyCoordinates: coords,
      },
    })
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
