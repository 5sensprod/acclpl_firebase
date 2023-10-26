import formatCompanyName from '../../../utils/formatCompanyName'
import normalizedCompanyName from '../../../utils/normalizedCompanyName'

export const formatCompanyAction = (state, action) => {
  // Si action.payload est null ou undefined, retournez l'état actuel sans modifications
  if (action.payload == null) {
    return state
  }

  const formattedName = formatCompanyName(action.payload)
  const normalized = normalizedCompanyName(formattedName)

  return {
    ...state,
    formData: {
      ...state.formData,
      companyName: formattedName,
      normalizedCompanyName: normalized,
    },
  }
}
