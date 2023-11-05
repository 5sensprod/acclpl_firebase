import React from 'react'
import GoogleSignInButton from './GoogleSignInButton'
import FacebookSignInButton from './FacebookSignInButton'
import EmailSignInButton from './EmailSignInButton'

const AuthenticationButtons = () => (
  <div className="d-flex flex-column gap-3 mx-auto">
    <GoogleSignInButton />
    <FacebookSignInButton />
    <EmailSignInButton />
  </div>
)

export default AuthenticationButtons
