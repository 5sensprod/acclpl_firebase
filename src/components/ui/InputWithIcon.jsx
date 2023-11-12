import React from 'react'
import { InputGroup, Form } from 'react-bootstrap'

const InputWithIcon = ({ icon, ...props }) => (
  <InputGroup className="mb-3">
    <InputGroup.Text>{icon}</InputGroup.Text>
    <Form.Control {...props} />
  </InputGroup>
)

export default InputWithIcon
