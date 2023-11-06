import React, { useContext } from 'react'
import { UserContext } from '../context/userContext'
import HeaderTitle from '../components/ui/HeaderTitle'
import AuthenticationButtons from '../components/ui/AuthenticationButtons'
import LogoImage from '../components/ui/LogoImage'

const Home = () => {
  const { currentUser } = useContext(UserContext)
  const isUserLoggedIn = Boolean(currentUser)

  return (
    <>
      <div
        className="container p-3 shadow pt-5  rounded-bottom"
        style={{ maxWidth: '800px' }}
      >
        <div className="row">
          <div className="col-12 col-lg-6 mt-2 pb-5 text-center w-75 mx-auto">
            <HeaderTitle isUserLoggedIn={isUserLoggedIn} />
            {!isUserLoggedIn && (
              <>
                <AuthenticationButtons />
                <LogoImage />
              </>
            )}
          </div>
          {/* {isUserLoggedIn && <FormWizard />} */}
        </div>
      </div>{' '}
    </>
  )
}

export default Home
