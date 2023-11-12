// src/components/UserInfo.jsx
import React from 'react'
import { motion } from 'framer-motion'

const UserInfo = ({ icon: Icon, label, value, index }) => {
  const variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.15,
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className="d-flex align-items-center py-2"
    >
      <Icon size={28} className="me-2 bg-primary rounded p-1" />
      {label}: {value}
    </motion.div>
  )
}

export default UserInfo
