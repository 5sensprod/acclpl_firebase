import formatCompanyName from '../../../utils/formatCompanyName'

export const formatCompanyAction = (state, action) => {
  // Si action.payload est null ou undefined, retournez l'état actuel sans modifications
  if (action.payload == null) {
    return state
  }

  const formattedName = formatCompanyName(action.payload)
  return {
    ...state,
    formData: {
      ...state.formData,
      companyName: formattedName,
    },
  }
}
