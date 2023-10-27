// NameCompany.jsx
import React from 'react'
import { InputWrapper, StyledInput } from './InputWrapper'
import { Button } from 'react-bootstrap'

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
      <Button
        variant="link"
        className="btn text-light mt-1 p-0"
        style={{ textDecoration: 'none' }}
        onClick={() => {
          const defaultValue = 'Entreprise X'
          if (onChange) {
            onChange({
              target: {
                value: defaultValue,
                name: 'companyName',
              },
            })
          }
        }}
      >
        Je ne sais pas
      </Button>
    </InputWrapper>
  )
}

export default NameCompany
