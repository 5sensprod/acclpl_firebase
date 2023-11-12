import React from 'react'
import { motion } from 'framer-motion'

const AnimatedDiv = ({ children, variants, ...props }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedDiv
