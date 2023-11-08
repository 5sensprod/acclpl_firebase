import React from 'react'

const ViewHeader = ({ icon: IconComponent, title }) => {
  return (
    <>
      <style>
        {`
          .inset-shadow {
            box-shadow: inset 0 0 15px 1px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>
      <h1 className="display-5 text-light mb-4 text-center inset-shadow rounded-top py-2 pb-3 d-flex align-items-baseline justify-content-center">
        <IconComponent size={32} className="me-5 bg-dark shadow" />
        {title}
      </h1>
    </>
  )
}

export default ViewHeader
