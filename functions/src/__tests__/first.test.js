const firebase = require('@firebase/testing');
const admin = require('firebase-admin');

const projectId = "poultry101-6b1ed";
process.env.GCLOUD_PROJECT = projectId;
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8081";
admin.initializeApp({projectId});

beforeAll(async ()=>{
    await firebase.clearFirestoreData({projectId});
});

test('should be 1', () => {
    expect(1).toBe(1)
});
