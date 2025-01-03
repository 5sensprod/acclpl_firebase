// db.js
import Dexie from 'dexie'

const db = new Dexie('AcclplDatabase')

db.version(2).stores({
  // Incrémenté à version 2
  establishments:
    '++id, address, coordinates, establishmentName, normalizedEstablishmentName, observationCount, observationRefs',
  observations:
    '++id, additionalNotes, date, establishmentRef, photoURLs, time, userID',
  streets: '++id, name, city, coordinates',
  users: '++id, displayName, email, observationRefs, joinedDate',
})

export default db
