import React from 'react'
import { Megaphone } from 'react-bootstrap-icons'
import FormWizard from '../../../components/form/wizard'

export default function PrivateHome() {
  return (
    <>
      <style>
        {`
          .inset-shadow {
            box-shadow: inset 0 0 15px 1px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>
      <div
        className="container shadow-sm pt-5 pb-5 rounded-bottom"
        style={{ maxWidth: '800px' }}
      >
        <h1 className="display-5 text-light mb-4 text-center inset-shadow rounded-top py-2">
          <Megaphone size={32} className="me-5 bg-dark shadow" />
          Éco-veille
        </h1>
        <FormWizard />
      </div>
    </>
  )
}
