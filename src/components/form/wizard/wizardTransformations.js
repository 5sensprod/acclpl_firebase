import formatCompanyName from '../../../utils/formatCompanyName'
import normalizedCompanyName from '../../../utils/normalizedCompanyName'

export const formatCompanyAction = (state, action) => {
  if (!action.payload || !action.payload.companyName) {
    return state
  }

  const formattedName = formatCompanyName(action.payload.companyName)
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
