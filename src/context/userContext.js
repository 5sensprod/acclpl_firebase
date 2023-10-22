import { createContext, useState, useEffect } from 'react'

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../firebaseConfig'

export const UserContext = createContext()

export function UserContextProvider(props) {
  const signUp = (email, pwd) =>
    createUserWithEmailAndPassword(auth, email, pwd)
  const signIn = (email, pwd) => signInWithEmailAndPassword(auth, email, pwd)

  const [currentUser, setCurrentUser] = useState()
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setCurrentUser(currentUser)
      setLoadingData(false)

      // Log the user ID to the console
      if (currentUser) {
        console.log('User ID:', currentUser.uid)
      } else {
        console.log('No user is signed in.')
      }
    })

    return unsubscribe
  }, [])

  // modal
  const [modalState, setModalState] = useState({
    signUpModal: false,
    signInModal: false,
  })

  const toggleModals = (modal) => {
    const modalMapping = {
      signIn: { signUpModal: false, signInModal: true },
      signUp: { signUpModal: true, signInModal: false },
      close: { signUpModal: false, signInModal: false },
    }

    setModalState(
      modalMapping[modal] || { signUpModal: false, signInModal: false },
    )
  }
  return (
    <UserContext.Provider
      value={{ modalState, toggleModals, signUp, currentUser, signIn }}
    >
      {!loadingData && props.children}
    </UserContext.Provider>
  )
}
