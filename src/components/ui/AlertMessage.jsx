import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './AlertStyles.css'

const AlertMessage = ({ variant = 'danger', message }) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (message) {
      setShow(true) // Affiche l'alerte quand message est mis à jour
      const timer = setTimeout(() => {
        setShow(false) // Cache l'alerte après 3 secondes
      }, 3000)
      return () => clearTimeout(timer) // Nettoie le timer si le composant est démonté ou si le message change
    }
  }, [message])

  const animationVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -100, opacity: 0 },
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={animationVariants}
          className="alertStyle"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AlertMessage
