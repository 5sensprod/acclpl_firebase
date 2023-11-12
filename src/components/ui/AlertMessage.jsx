import React from 'react'
import { Alert } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'

const AlertMessage = ({ message, onClose }) => {
  const animationVariants = {
    initial: { y: -100, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring', // Utilise un effet de ressort pour le rebond
        stiffness: 260,
        damping: 20,
      },
    },
    exit: {
      y: -100,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  }

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={animationVariants}
        >
          <Alert
            // variant={variant}
            onClose={onClose}
            dismissible
            className="alert-dark text-dark"
          >
            {message}
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AlertMessage
