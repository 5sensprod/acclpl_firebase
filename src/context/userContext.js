import React, { createContext, useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  signOut as firebaseSignOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential as firebaseReauthenticateWithCredential,
} from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { addUser, getUser } from '../services/userService'

export const UserContext = createContext()

export function UserContextProvider(props) {
  const [currentUser, setCurrentUser] = useState()
  const [userProfile, setUserProfile] = useState(null)
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

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const response = await signInWithPopup(auth, provider)
      const user = response.user

      let userProfile = await getUser(user.uid).catch(async () => {
        // Si getUser échoue, créez un nouvel utilisateur dans Firestore
        const newUser = {
          userID: user.uid,
          displayName: user.displayName || 'Nouvel Utilisateur', // Utilisez le nom fourni ou un nom par défaut
          email: user.email,
          joinedDate: new Date().toISOString(),
        }
        await addUser(newUser) // Créez l'utilisateur dans Firestore
        return newUser // Retourne le nouvel utilisateur pour mise à jour de l'état
      })

      setUserProfile(userProfile) // Mettez à jour l'état du profil utilisateur
      return user
    } catch (error) {
      console.error('Erreur lors de la connexion avec Google', error)
      throw error
    }
  }

  const facebookSignIn = async () => {
    const provider = new FacebookAuthProvider()
    try {
      const response = await signInWithPopup(auth, provider)
      const user = response.user

      let userProfile = await getUser(user.uid).catch(async () => {
        // Si getUser échoue, créez un nouvel utilisateur dans Firestore
        const newUser = {
          userID: user.uid,
          displayName: user.displayName || 'Nouvel Utilisateur',
          email: user.email,
          joinedDate: new Date().toISOString(),
        }
        await addUser(newUser) // Créez l'utilisateur dans Firestore
        return newUser // Retourne le nouvel utilisateur pour mise à jour de l'état
      })

      setUserProfile(userProfile) // Mettez à jour l'état du profil utilisateur
      return user
    } catch (error) {
      console.error('Erreur lors de la connexion avec Facebook', error)
      throw error
    }
  }

  const signOut = () => firebaseSignOut(auth)

  const changePassword = async (newPassword) => {
    if (!currentUser) {
      throw new Error(
        'Aucun utilisateur connecté pour changer le mot de passe.',
      )
    }
    // currentUser est l'objet utilisateur renvoyé par Firebase Authentication
    return updatePassword(currentUser, newPassword)
  }

  const reauthenticateWithCredential = async (currentPassword) => {
    if (!currentUser) {
      throw new Error('Aucun utilisateur connecté pour la réauthentification.')
    }
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      currentPassword,
    )
    return firebaseReauthenticateWithCredential(currentUser, credential)
  }

  const [isPasswordSignIn, setIsPasswordSignIn] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      setLoadingData(true)
      if (user) {
        setIsPasswordSignIn(
          user.providerData.some((p) => p.providerId === 'password'),
        )
        try {
          let profileData = await getUser(user.uid)
          setUserProfile(profileData)
        } catch (error) {
          if (!error.message.includes('No user found with userID')) {
          }
        } finally {
          setLoadingData(false)
        }
      } else {
        setIsPasswordSignIn(false)
        setUserProfile({})
        setLoadingData(false)
      }
    })
    return unsubscribe
  }, [])

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
        userProfile,
        setUserProfile,
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
        changePassword,
        reauthenticateWithCredential,
        isPasswordSignIn,
      }}
    >
      {!loadingData && props.children}
    </UserContext.Provider>
  )
}
