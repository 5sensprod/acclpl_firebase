import React, { createContext, useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { addUser } from '../services/userService'

export const UserContext = createContext()

export function UserContextProvider(props) {
  const [currentUser, setCurrentUser] = useState()
  const [loadingData, setLoadingData] = useState(true)
  const [activeView, setActiveView] = useState('profile')

  const signUp = async (email, pwd, displayName) => {
    const response = await createUserWithEmailAndPassword(auth, email, pwd)
    const user = response.user
    // Créez l'objet utilisateur pour Firestore en utilisant les informations de l'utilisateur Firebase Auth
    const newUser = {
      userID: user.uid, // L'UID fourni par Firebase Auth
      displayName, // Le displayName fourni dans le formulaire d'inscription
      email: user.email, // L'email de l'utilisateur
      joinedDate: new Date().toISOString(), // La date actuelle formatée en ISO
    }
    // Utilisez addUser pour créer le document utilisateur dans Firestore
    await addUser(newUser)
    return user
  }

  const signIn = (email, pwd) => signInWithEmailAndPassword(auth, email, pwd)

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  const facebookSignIn = () => {
    const provider = new FacebookAuthProvider()
    return signInWithPopup(auth, provider)
  }

  const signOut = () => firebaseSignOut(auth)

  // Suivez l'état d'authentification de l'utilisateur
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoadingData(false)
    })
    return unsubscribe
  }, [])

  // Gestion des modals
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
      value={{
        currentUser,
        loadingData,
        modalState,
        toggleModals,
        signUp,
        signIn,
        googleSignIn,
        facebookSignIn,
        signOut,
        activeView,
        setActiveView,
      }}
    >
      {!loadingData && props.children}
    </UserContext.Provider>
  )
}
