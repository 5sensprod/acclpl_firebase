import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/userContext'
import HeaderTitle from '../components/ui/HeaderTitle'
import AuthenticationButtons from '../components/ui/AuthenticationButtons'
import LogoImage from '../components/ui/LogoImage'
// import SidebarMenu from '../components/ui/SidebarMenu';

const Home = () => {
  const { currentUser } = useContext(UserContext)
  const navigate = useNavigate()

  // Redirigez l'utilisateur s'il est déjà connecté
  useEffect(() => {
    if (currentUser) {
      navigate('/private/private-home')
    }
  }, [currentUser, navigate])

  return (
    <>
      <div
        className="container p-3 shadow pt-5 rounded-bottom"
        style={{ maxWidth: '800px' }}
      >
        <div className="row">
          <div className="col-12 col-lg-6 mt-2 pb-5 text-center w-75 mx-auto">
            <HeaderTitle isUserLoggedIn={Boolean(currentUser)} />
            {!currentUser && (
              <>
                <AuthenticationButtons />
                <LogoImage />
              </>
            )}
          </div>
          {/* {currentUser && <SidebarMenu />} */}
        </div>
      </div>
    </>
  )
}

export default Home
