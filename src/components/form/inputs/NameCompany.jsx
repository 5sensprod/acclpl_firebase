// NameCompany.jsx
import React from 'react'
import { InputWrapper, StyledInput } from './InputWrapper'

const NameCompany = ({ value, onChange }) => {
  return (
    <InputWrapper label="Nom de l'entreprise" id="company-name-input">
      <StyledInput
        id="company-name-input"
        name="companyName"
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Entrez le nom de l'entreprise"
      />
    </InputWrapper>
  )
}

export default NameCompany
