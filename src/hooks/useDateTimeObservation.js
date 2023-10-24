// src/hooks/useDateTimeObservation.js

import { useReducer } from 'react'

export const dateTimeObservationInitialState = {
  dateOfObservation: '',
  timeOfObservation: '',
  isDateTimeValidated: false,
}

export function dateTimeObservationReducer(state, action) {
  switch (action.type) {
    case 'SET_DATE':
      return {
        ...state,
        dateOfObservation: action.payload,
      }
    case 'SET_TIME':
      return {
        ...state,
        timeOfObservation: action.payload,
      }
    case 'VALIDATE_DATETIME':
      return {
        ...state,
        isDateTimeValidated: true,
      }
    case 'MODIFY_DATETIME':
      return {
        ...state,
        isDateTimeValidated: false,
      }
    default:
      throw new Error(`Unsupported action type: ${action.type}`)
  }
}

function useDateTimeObservation(moveToNextStep) {
  const [state, dispatch] = useReducer(
    dateTimeObservationReducer,
    dateTimeObservationInitialState,
  )

  const handleDateChange = (e) => {
    dispatch({ type: 'SET_DATE', payload: e.target.value })
  }

  const handleTimeChange = (e) => {
    dispatch({ type: 'SET_TIME', payload: e.target.value })
  }

  const handleDateTimeValidation = () => {
    dispatch({ type: 'VALIDATE_DATETIME' })
    if (moveToNextStep) moveToNextStep()
  }

  const handleDateTimeModification = () => {
    dispatch({ type: 'MODIFY_DATETIME' })
  }

  return {
    ...state,
    handleDateChange,
    handleTimeChange,
    handleDateTimeValidation,
    handleDateTimeModification,
  }
}

export default useDateTimeObservation
