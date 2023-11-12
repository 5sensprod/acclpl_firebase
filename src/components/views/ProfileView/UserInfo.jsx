// src/components/UserInfo.jsx
import React from 'react'
import { userInfoVariants } from '../../../animations/motionVariants'
import AnimatedDiv from '../../../animations/AnimatedDiv'

const UserInfo = ({ icon: Icon, label, value, index }) => {
  return (
    <AnimatedDiv
      variants={userInfoVariants}
      className="d-flex align-items-center py-2"
    >
      <Icon size={28} className="me-2 bg-primary rounded p-1" />
      {label}: {value}
    </AnimatedDiv>
  )
}

export default UserInfo
