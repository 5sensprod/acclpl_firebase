import React from 'react'
import GoogleSignInButton from './GoogleSignInButton'
import FacebookSignInButton from './FacebookSignInButton'
import EmailSignInButton from './EmailSignInButton'

const AuthenticationButtons = () => (
  <div
    className="d-flex flex-column gap-3 mx-auto mw-100"
    style={{ maxWidth: '300px', marginTop: '75px' }}
  >
    <GoogleSignInButton />
    <FacebookSignInButton />
    <EmailSignInButton />
  </div>
)

export default AuthenticationButtons
