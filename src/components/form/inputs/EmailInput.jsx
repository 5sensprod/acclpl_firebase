// src\components\form\inputs\EmailInput.jsx
import React from 'react'
import { InputWrapper, StyledInput } from './InputWrapper'

const EmailInput = ({ value, onChange }) => {
  return (
    <InputWrapper label="Adresse e-mail" id="email-input">
      <StyledInput
        id="email-input"
        name="email"
        type="email"
        value={value}
        onChange={onChange}
        placeholder="Entrez votre adresse e-mail"
      />
    </InputWrapper>
  )
}

export default EmailInput
