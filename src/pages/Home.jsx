import React, { useContext } from 'react'
import { UserContext } from '../context/userContext'
import HeaderTitle from '../components/ui/HeaderTitle'
import AuthenticationButtons from '../components/ui/AuthenticationButtons'
import LogoImage from '../components/ui/LogoImage'
import FormWizard from '../components/form/wizard'
import Footer from '../components/Footer'

const Home = () => {
  const { currentUser } = useContext(UserContext)
  const isUserLoggedIn = Boolean(currentUser)

  return (
    <>
      <div className="container p-3">
        <div className="row">
          <div className="col-12 col-lg-6 mt-5 text-center w-75 mx-auto">
            <HeaderTitle isUserLoggedIn={isUserLoggedIn} />
            {!isUserLoggedIn && (
              <>
                <AuthenticationButtons />
                <LogoImage />
              </>
            )}
            {isUserLoggedIn && <FormWizard />}
          </div>
        </div>
      </div>{' '}
      <Footer />
    </>
  )
}

export default Home
