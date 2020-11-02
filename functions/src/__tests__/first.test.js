const firebase = require('@firebase/testing') //<--- You want this to be the top guy!!!
const admin = require('firebase-admin')

const projectId = "poultry101-6b1ed"
process.env.GCLOUD_PROJECT = projectId
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
admin.initializeApp({projectId})

beforeAll(async ()=>{
    await firebase.clearFirestoreData({projectId});
})

test('should be 1', () => {
    expect(1).toBe(1)
});
