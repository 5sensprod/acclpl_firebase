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

export default function SidebarMenu() {
  const [show, setShow] = useState(false)
  const { currentUser, signOut, setActiveView } = useContext(UserContext)
  const navigate = useNavigate()

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
    setActiveView(viewName) // Mettez à jour la vue active
    handleClose() // Fermez le menu Offcanvas
  }

  return (
    <>
      <style>
        {`.btn-close {
          filter: invert(1) grayscale(1) brightness(.7);
        }`}
      </style>
      <div
        onClick={handleShow}
        className="d-inline-flex align-items-center btn-dark clickable ms-2 mt-1"
        style={{ cursor: 'pointer' }}
      >
        <List size={32} color="white" />{' '}
      </div>

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        className="bg-dark"
        style={{ width: '80px' }}
      >
        <Offcanvas.Header
          closeButton
          className="bg-dark text-light mx-auto"
        ></Offcanvas.Header>
        <Offcanvas.Body className="bg-dark text-light">
          <Nav className="flex-column text-center gap-3">
            <Nav.Link onClick={() => changeView('profile')}>
              <Person size={24} style={{ color: 'white' }} />
              {/* Profil */}
            </Nav.Link>
            <Nav.Link onClick={() => changeView('announcements')}>
              <Megaphone size={24} style={{ color: 'white' }} />
              {/* Annonces */}
            </Nav.Link>
            <Nav.Link onClick={() => changeView('map')}>
              <Map size={24} style={{ color: 'white' }} />
              {/* Carte */}
            </Nav.Link>
            {currentUser && (
              <Nav.Link onClick={logOut} className="mt-5">
                <BoxArrowRight size={24} style={{ color: 'white' }} />
                {/* Déconnexion */}
              </Nav.Link>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}
