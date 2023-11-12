// src/components/CustomToggle.jsx
import React from 'react'
import { Button, useAccordionButton } from 'react-bootstrap'
import { ChevronDown } from 'react-bootstrap-icons'
import styles from './ReportingsView.module.css'

const CustomToggle = ({ children, eventKey, activeKey, setActiveKey }) => {
  const decoratedOnClick = useAccordionButton(eventKey, () => {
    setActiveKey((prevKey) => (prevKey === eventKey ? null : eventKey))
  })

  const isCurrentEventKeyActive = activeKey === eventKey

  const chevronStyle = {
    transform: isCurrentEventKeyActive ? 'rotate(180deg)' : 'none',
    transition: 'transform 0.3s ease',
  }

  return (
    <Button
      variant="link"
      onClick={decoratedOnClick}
      className={`text-start ${styles.customToggle}`}
      aria-expanded={isCurrentEventKeyActive}
    >
      <span>{children}</span>
      <ChevronDown
        size={24}
        className="bg-primary rounded p-1"
        style={chevronStyle}
      />
    </Button>
  )
}

export default CustomToggle
