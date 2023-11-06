import React, { useState, useContext } from 'react'
import { Offcanvas, Nav } from 'react-bootstrap'
import {
  Megaphone,
  Person,
  Map,
  BoxArrowRight,
  List,
} from 'react-bootstrap-icons'
import { UserContext } from '../../context/userContext'
import { useNavigate } from 'react-router-dom'
import '../styles/sidebarStyles.css'
import { motion } from 'framer-motion'

export default function SidebarMenu() {
  const [show, setShow] = useState(false)
  const { currentUser, signOut, setActiveView, activeView } =
    useContext(UserContext)
  const navigate = useNavigate()

  const menuItems = [
    { name: 'profile', icon: <Person size={24} />, label: 'Profil' },
    { name: 'announcements', icon: <Megaphone size={24} />, label: 'Annonces' },
    { name: 'map', icon: <Map size={24} />, label: 'Carte' },
  ]

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const logOut = async () => {
    try {
      await signOut()
      handleClose()
      navigate('/')
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error)
    }
  }

  const changeView = (viewName) => {
    setActiveView(viewName)
    handleClose()
  }

  const listVariants = {
    visible: { x: -20 },
    hidden: {
      x: 8,
      transition: {
        delay: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { x: -50 },
    visible: (index) => ({
      x: 0,
      transition: {
        delay: 0.1 + index * 0.04,
      },
    }),
  }

  return (
    <>
      <motion.div
        onClick={handleShow}
        className="d-inline-flex align-items-center btn-dark clickable"
        style={{ cursor: 'pointer' }}
        initial="visible"
        animate={show ? 'visible' : 'hidden'}
        variants={listVariants}
      >
        <List size={32} color="white" />
      </motion.div>

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        className="bg-dark"
        style={{ width: '80px' }}
      >
        <Offcanvas.Header
          closeButton
          className="bg-dark text-secondary mx-auto"
        />
        <Offcanvas.Body className="bg-dark text-light d-flex flex-column align-items-center justify-content-center p-0">
          <Nav className="flex-column gap-4 p-0 shadow rounded py-3">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.name}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Nav.Link onClick={() => changeView(item.name)}>
                  {React.cloneElement(item.icon, {
                    className:
                      activeView === item.name
                        ? 'active-link'
                        : 'text-secondary',
                  })}
                </Nav.Link>
              </motion.div>
            ))}
            {currentUser && (
              <motion.div
                variants={itemVariants}
                custom={menuItems.length}
                initial="hidden"
                animate="visible"
              >
                <Nav.Link onClick={logOut} className="mt-5">
                  <BoxArrowRight
                    size={24}
                    className={
                      activeView === 'logout' ? 'active-link' : 'text-secondary'
                    }
                  />
                </Nav.Link>
              </motion.div>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}
