// FirestoreSync.jsx
import { useEffect } from 'react'
import { initializeDBFromFirestore, cleanup } from './db/sync'

export function FirestoreSync() {
  useEffect(() => {
    initializeDBFromFirestore()
    return () => cleanup()
  }, [])

  return null
}
