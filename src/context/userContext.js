import React, { createContext, useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  signOut as firebaseSignOut, // Importez la méthode signOut
} from 'firebase/auth'
import { auth } from '../firebaseConfig'

export const UserContext = createContext()

export function UserContextProvider(props) {
  const [currentUser, setCurrentUser] = useState()
  const [loadingData, setLoadingData] = useState(true)
  const [activeView, setActiveView] = useState('profile')

  // Inscrivez un utilisateur avec email et mot de passe
  const signUp = (email, pwd) =>
    createUserWithEmailAndPassword(auth, email, pwd)

  // Connectez un utilisateur avec email et mot de passe
  const signIn = (email, pwd) => signInWithEmailAndPassword(auth, email, pwd)

  // Connectez un utilisateur avec Google
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  // Connectez un utilisateur avec Facebook
  const facebookSignIn = () => {
    const provider = new FacebookAuthProvider()
    return signInWithPopup(auth, provider)
  }

  // Déconnectez l'utilisateur
  const signOut = () => firebaseSignOut(auth)

  // Suivez l'état d'authentification de l'utilisateur
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoadingData(false)
    })
    return unsubscribe // Assurez-vous de désabonner lors du démontage
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

  // La valeur passée au Provider
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
        activeView, // Ajoutez activeView dans la valeur du contexte
        setActiveView, // Ajoutez setActiveView dans la valeur du contexte pour permettre aux composants de le mettre à jour
      }}
    >
      {!loadingData && props.children}
    </UserContext.Provider>
  )
}
