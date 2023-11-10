import Dexie from 'dexie'

const db = new Dexie('AcclplDatabase')

db.version(1).stores({
  establishments:
    '++id, address, coordinates, establishmentName, normalizedEstablishmentName, observationCount, observationRefs',
  observations:
    '++id, additionalNotes, date, establishmentRef, photoURLs, time, userID',
})

export default db
