import React from 'react'
import { Button } from 'react-bootstrap'

function ValidatedToggleButton({
  isValidated,
  onValidation,
  onModification,
  disabled,
}) {
  const buttonProps = isValidated
    ? {
        variant: 'warning',
        size: 'sm',
        onClick: onModification,
        children: 'Modifier',
      }
    : {
        variant: 'success',
        onClick: onValidation,
        disabled,
        children: 'Valider',
      }

  return (
    <Button
      {...buttonProps}
      style={{ boxShadow: 'none', outline: 'none' }}
      className="mt-2"
    />
  )
}

export default ValidatedToggleButton
