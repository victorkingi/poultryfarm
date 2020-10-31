const assert = require('assert');
const firebase = require('@firebase/testing');

const MY_PROJECT_ID = "poultry101-6b1ed";
const myId = "user_abc";
const theirId = "user_xyz";
const myAuth = {uid:myId, email: "abc@gmail.com"};

function getFirestore(auth) {
    return firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: auth}).firestore();
}

beforeEach(async() => {
    await firebase.clearFirestoreData({projectId: MY_PROJECT_ID});
})

describe("social app", () => {

    it("understands maths", () => {
        assert.strictEqual(2+2, 4);
    });

    it("Can read items in the read-only collection", async() => {
        const db = getFirestore(null);
        const testDoc = db.collection("notifyToken").doc("2020");
        await firebase.assertFails(testDoc.get());
    })

    it("Can't write items in the read-only collection", async() => {
        const db = getFirestore(null);
        const testDoc = db.collection("readonly").doc("testDoc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    })

    it("can write user doc", async() => {
        const myAuth = {uid: "user_abc", email: "abc@gmail.com"};
        const db = getFirestore(myAuth);
        const testDoc = db.collection("users").doc("user_xyz");
        await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
 
    })
});

after(async() => {
    await firebase.clearFirestoreData({projectId: MY_PROJECT_ID});
})
