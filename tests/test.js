const firebase = require('@firebase/testing');

const MY_PROJECT_ID = "poultry101-6b1ed";
const adminId = "user_admin";
const changerId = "user_changer";
const moderatorId = "user_moderator";
const normalId = "user";

const adminAuth = {uid: adminId, email: "abc_admin@gmail.com", admin: true};
const changerAuth = {uid: changerId, email: "abc_changer@gmail.com", changer: true};
const moderatorAuth = {uid: moderatorId, email: "abc_moderator@gmail.com", moderator: true};
const auth = {uid: normalId, email: "abc@gmail.com"};

function getFirestore(auth) {
    return firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: auth}).firestore();
}

const dbAdmin = getFirestore(adminAuth);
const dbChanger = getFirestore(changerAuth);
const dbModerator = getFirestore(moderatorAuth);
const db = getFirestore(auth);
const dbNoAuth = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();

beforeEach(async() => {
    await firebase.clearFirestoreData({projectId: MY_PROJECT_ID});
})

describe("Unit Tests For Firestore security rules", () => {
    //different authentications

    describe("with admin privileges", () => {

        it("Assert users collection is safe", async () => {
            const testDoc = dbAdmin.collection("users").doc("user_admin");
            //create tests
            await firebase.assertSucceeds(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
           });

           it("Assert oweJeff collection is safe", async () => {
               const testDoc = dbAdmin.collection("oweJeff").doc("user_xyz");

               //create tests
               await firebase.assertSucceeds(testDoc.set({foo: "bar"}));

               //read tests
               await firebase.assertSucceeds(testDoc.get());

               //update tests
               await firebase.assertSucceeds(testDoc.update({foo: 'faz'}));

               //delete tests
               await firebase.assertSucceeds(testDoc.delete());
           });

           it("Assert Profit collection is safe", async () => {
               const testDoc = dbAdmin.collection("profit").doc("wer");

               //create tests
               await firebase.assertFails(testDoc.set({foo: "bar"}));

               //read tests
               await firebase.assertSucceeds(testDoc.get());

               //update tests
               await firebase.assertFails(testDoc.update({foo: 'faz'}));

               //delete tests
               await firebase.assertFails(testDoc.delete());

           });

           it("Assert Latest News collection is safe", async () => {
               const testDoc = dbAdmin.collection("latestNews").doc("user_xyz");

               //create tests
               await firebase.assertFails(testDoc.set({foo: "bar"}));

               //read tests
               await firebase.assertSucceeds(testDoc.get());

               //update tests
               await firebase.assertFails(testDoc.update({foo: 'faz'}));

               //delete tests
               await firebase.assertFails(testDoc.delete());
           });

           it("Assert deadSick collection is safe", async () => {
               const testDoc = dbAdmin.collection("deadSick").doc("user_xyz");

               //create tests
               await firebase.assertSucceeds(testDoc.set({foo: "bar"}));

               //read tests
               await firebase.assertSucceeds(testDoc.get());

               //update tests
               await firebase.assertFails(testDoc.update({foo: 'faz'}));

               //delete tests
               await firebase.assertFails(testDoc.delete());

           });

           it("Assert chickenDetails collection is safe", async () => {
               const testDoc = dbAdmin.collection("chickenDetails").doc("user_xyz");

               //create tests
               await firebase.assertFails(testDoc.set({foo: "bar"}));

               //read tests
               await firebase.assertSucceeds(testDoc.get());

               //update tests
               await firebase.assertSucceeds(testDoc.update({foo: 'faz'}));

               //delete tests
               await firebase.assertFails(testDoc.delete());

           });

           it("Assert otherDebt collection is safe", async () => {
               const testDoc = dbAdmin.collection("otherDebt").doc("user_xyz");

               //create tests
               await firebase.assertSucceeds(testDoc.set({foo: "bar"}));

               //read tests
               await firebase.assertSucceeds(testDoc.get());

               //update tests
               await firebase.assertFails(testDoc.update({foo: 'faz'}));

               //delete tests
               await firebase.assertFails(testDoc.delete());
           });

           it("Assert Borrow collection is safe", async () => {
               const testDoc = dbAdmin.collection("borrow").doc("user_xyz");

               //create tests
               await firebase.assertSucceeds(testDoc.set({foo: "bar"}));

               //read tests
               await firebase.assertSucceeds(testDoc.get());

               //update tests
               await firebase.assertFails(testDoc.update({foo: 'faz'}));

               //delete tests
               await firebase.assertSucceeds(testDoc.delete());

           });

           it("Assert bags collection is safe", async () => {
               const testDoc = dbAdmin.collection("bags").doc("user_xyz");

               //create tests
               await firebase.assertFails(testDoc.set({foo: "bar"}));

               //read tests
               await firebase.assertSucceeds(testDoc.get());

               //update tests
               await firebase.assertSucceeds(testDoc.update({foo: 'faz'}));

               //delete tests
               await firebase.assertFails(testDoc.delete());

           });

           it("Assert trays collection is safe", async () => {
               const testDoc = dbAdmin.collection("trays").doc("user_xyz");

               //create tests
               await firebase.assertFails(testDoc.set({foo: "bar"}));

               //read tests
               await firebase.assertSucceeds(testDoc.get());

               //update tests
               await firebase.assertSucceeds(testDoc.update({foo: 'faz'}));

               //delete tests
               await firebase.assertFails(testDoc.delete());

           });

           it("Assert current collection is safe", async () => {
               const testDoc = dbAdmin.collection("current").doc("user_xyz");

               //create tests
               await firebase.assertFails(testDoc.set({foo: "bar"}));

               //read tests
               await firebase.assertSucceeds(testDoc.get());

               //update tests
               await firebase.assertSucceeds(testDoc.update({foo: 'faz'}));

               //delete tests
               await firebase.assertFails(testDoc.delete());
           });

           it("Assert userLogs collection is safe", async () => {
               const testDoc = dbAdmin.collection("userLogs").doc("user_xyz");

               const testInnerDoc = dbAdmin.collection("userLogs").doc("user_xyz")
                   .collection("logs").doc("user_abc");

               //Inner doc tests first

               //create
               await firebase.assertSucceeds(testInnerDoc.set({foo: "bar"}));

               //read tests
               await firebase.assertFails(testInnerDoc.get());

               //update tests
               await firebase.assertFails(testInnerDoc.update({foo: 'faz'}));

               //delete tests
               await firebase.assertFails(testInnerDoc.delete());

               // Outer doc tests
               //create tests
               await firebase.assertFails(testDoc.set({foo: "bar"}));

               //read tests
               await firebase.assertFails(testDoc.get());

               //update tests
               await firebase.assertFails(testDoc.update({foo: 'faz'}));

               //delete tests
               await firebase.assertFails(testDoc.delete());
           });

           it("Assert buys collection is safe", async () => {
               const testDoc = dbAdmin.collection("buys").doc("user_xyz");

               //create tests
               await firebase.assertSucceeds(testDoc.set({foo: "bar"}));

               //read tests
               await firebase.assertSucceeds(testDoc.get());

               //update tests
               await firebase.assertSucceeds(testDoc.update({foo: 'faz'}));

               //delete tests
               await firebase.assertFails(testDoc.delete());

           });

           it("Assert latePayment collection is safe", async () => {
               const testDoc = dbAdmin.collection("latePayment").doc("user_xyz");

               //create tests
               await firebase.assertSucceeds(testDoc.set({foo: "bar"}));

               //read tests
               await firebase.assertSucceeds(testDoc.get());

               //update tests
               await firebase.assertFails(testDoc.update({foo: 'faz'}));

               //delete tests
               await firebase.assertSucceeds(testDoc.delete());
           });

           it("Assert notifyToken collection is safe", async () => {
               const testDoc = dbAdmin.collection("notifyToken").doc("user_xyz");

               const testInnerDoc = dbAdmin.collection("notifyToken").doc("user_xyz")
                   .collection("tokens").doc("user_abc");

               // Inner doc first tests
               //create tests
               await firebase.assertSucceeds(testInnerDoc.set({foo: "bar"}));

               //read tests
               await firebase.assertFails(testInnerDoc.get());

               //update tests
               await firebase.assertFails(testInnerDoc.update({foo: 'faz'}));

               //delete tests
               await firebase.assertFails(testInnerDoc.delete());

               //Outer doc tests
               //create tests
               await firebase.assertFails(testDoc.set({foo: "bar"}));

               //read tests
               await firebase.assertFails(testDoc.get());

               //update tests
               await firebase.assertFails(testDoc.update({foo: 'faz'}));

               //delete tests
               await firebase.assertFails(testDoc.delete());
           });

           it("Assert sales collection is safe", async () => {
               const testDoc = dbAdmin.collection("sales").doc("user_xyz");

               //create test
               await firebase.assertSucceeds(testDoc.set({foo: "bar", buyerName: "Dummy", weeklyTotal: 500 }));

               //read test
               await firebase.assertSucceeds(testDoc.get());

               //update test
               await firebase.assertSucceeds(testDoc.update({foo: 'faz'}));

               //delete test
               await firebase.assertFails(testDoc.delete());

           });

           it("Assert eggs collection is safe", async () => {
               const testDoc = dbAdmin.collection("eggs").doc("Month 10 Date 01");

               //create tests
               await firebase.assertSucceeds(testDoc.set({foo: "bar", date: "Sun Nov 01 2020 00:00:00 GMT+0000 (Greenwich Mean Time)"}));

               //read tests
               await firebase.assertSucceeds(testDoc.get());

               //update tests
               await firebase.assertFails(testDoc.update({foo: 'faz'}));

               //delete tests
               await firebase.assertFails(testDoc.delete());

           });

           it("Assert notifications collection is safe", async () => {
               const testDoc = dbAdmin.collection("notifications").doc("user_xyz");

               //create tests
               await firebase.assertSucceeds(testDoc.set({foo: "bar"}));

               //read tests
               await firebase.assertSucceeds(testDoc.get());

               //update tests
               await firebase.assertFails(testDoc.update({foo: 'faz'}));

               //delete tests
               await firebase.assertFails(testDoc.delete());
           });

       });

    describe("with changer privileges", () => {

        it("Assert users collection is safe", async () => {
            const testDoc = dbChanger.collection("users").doc("user_changer");

            //create test
            await firebase.assertSucceeds(testDoc.set({foo: "bar"}));

            //read test
            await firebase.assertSucceeds(testDoc.get());

            //update test
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete test
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert oweJeff collection is safe", async () => {
            const testDoc = dbChanger.collection("oweJeff").doc("user_xyz");

            //create test
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read test
            await firebase.assertFails(testDoc.get());

            //update test
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete test
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert Profit collection is safe", async () => {
            const testDoc = dbChanger.collection("profit").doc("wer");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert Latest News collection is safe", async () => {
            const testDoc = dbChanger.collection("latestNews").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert deadSick collection is safe", async () => {
            const testDoc = dbChanger.collection("deadSick").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert chickenDetails collection is safe", async () => {
            const testDoc = dbChanger.collection("chickenDetails").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDoc.get());

            //update tests
            await firebase.assertSucceeds(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert otherDebt collection is safe", async () => {
            const testDoc = dbChanger.collection("otherDebt").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert Borrow collection is safe", async () => {
            const testDoc = dbChanger.collection("borrow").doc("user_xyz");

            //create tests
            await firebase.assertSucceeds(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertSucceeds(testDoc.delete());

        });

        it("Assert bags collection is safe", async () => {
            const testDoc = dbChanger.collection("bags").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDoc.get());

            //update tests
            await firebase.assertSucceeds(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert trays collection is safe", async () => {
            const testDoc = dbChanger.collection("trays").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDoc.get());

            //update tests
            await firebase.assertSucceeds(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert current collection is safe", async () => {
            const testDoc = dbChanger.collection("current").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDoc.get());

            //update tests
            await firebase.assertSucceeds(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert userLogs collection is safe", async () => {
            const testDoc = dbChanger.collection("userLogs").doc("user_xyz");

            const testInnerDoc = dbChanger.collection("userLogs").doc("user_xyz")
                .collection("logs").doc("user_abc");

            //Inner doc tests first

            //create
            await firebase.assertSucceeds(testInnerDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testInnerDoc.get());

            //update tests
            await firebase.assertFails(testInnerDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testInnerDoc.delete());

            // Outer doc tests
            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert buys collection is safe", async () => {
            const testDoc = dbChanger.collection("buys").doc("user_xyz");

            //create tests
            await firebase.assertSucceeds(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDoc.get());

            //update tests
            await firebase.assertSucceeds(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert latePayment collection is safe", async () => {
            const testDoc = dbChanger.collection("latePayment").doc("user_xyz");

            //create tests
            await firebase.assertSucceeds(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertSucceeds(testDoc.delete());
        });

        it("Assert notifyToken collection is safe", async () => {
            const testDoc = dbChanger.collection("notifyToken").doc("user_xyz");

            const testInnerDoc = dbAdmin.collection("notifyToken").doc("user_xyz")
                .collection("tokens").doc("user_abc");

            // Inner doc first tests
            //create tests
            await firebase.assertSucceeds(testInnerDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testInnerDoc.get());

            //update tests
            await firebase.assertFails(testInnerDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testInnerDoc.delete());

            //Outer doc tests
            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert sales collection is safe", async () => {
            const testDoc = dbChanger.collection("sales").doc("user_xyz");

            //create test
            await firebase.assertSucceeds(testDoc.set({foo: "bar", buyerName: "Dummy", weeklyTotal: 500 }));

            //read test
            await firebase.assertSucceeds(testDoc.get());

            //update test
            await firebase.assertSucceeds(testDoc.update({foo: 'faz'}));

            //delete test
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert eggs collection is safe", async () => {
            const testDoc = dbChanger.collection("eggs").doc("Month 10 Date 01");

            //create tests
            await firebase.assertSucceeds(testDoc.set({foo: "bar", date: "Sun Nov 01 2020 00:00:00 GMT+0000 (Greenwich Mean Time)"}));

            //read tests
            await firebase.assertSucceeds(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert notifications collection is safe", async () => {
            const testDoc = dbChanger.collection("notifications").doc("user_xyz");

            //create tests
            await firebase.assertSucceeds(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

    });

    describe("with moderator privileges", () => {

        it("Assert users collection is safe", async () => {
            const testDoc = dbModerator.collection("users").doc("user_xyz");
            //create tests
            await firebase.assertSucceeds(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert oweJeff collection is safe", async () => {
            const testDoc = dbModerator.collection("oweJeff").doc("user_moderator");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert Profit collection is safe", async () => {
            const testDoc = dbModerator.collection("profit").doc("wer");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert Latest News collection is safe", async () => {
            const testDoc = dbModerator.collection("latestNews").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertSucceeds(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert deadSick collection is safe", async () => {
            const testDoc = dbModerator.collection("deadSick").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert chickenDetails collection is safe", async () => {
            const testDoc = dbModerator.collection("chickenDetails").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert otherDebt collection is safe", async () => {
            const testDoc = dbModerator.collection("otherDebt").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert Borrow collection is safe", async () => {
            const testDoc = dbModerator.collection("borrow").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert bags collection is safe", async () => {
            const testDoc = dbModerator.collection("bags").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert trays collection is safe", async () => {
            const testDoc = dbModerator.collection("trays").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert current collection is safe", async () => {
            const testDoc = dbModerator.collection("current").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert userLogs collection is safe", async () => {
            const testDoc = dbModerator.collection("userLogs").doc("user_xyz");

            const testInnerDoc = dbModerator.collection("userLogs").doc("user_xyz")
                .collection("logs").doc("user_abc");

            //Inner doc tests first

            //create
            await firebase.assertFails(testInnerDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testInnerDoc.get());

            //update tests
            await firebase.assertFails(testInnerDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testInnerDoc.delete());

            // Outer doc tests
            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert buys collection is safe", async () => {
            const testDoc = dbModerator.collection("buys").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert latePayment collection is safe", async () => {
            const testDoc = dbModerator.collection("latePayment").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert notifyToken collection is safe", async () => {
            const testDoc = dbModerator.collection("notifyToken").doc("user_xyz");

            const testInnerDoc = dbModerator.collection("notifyToken").doc("user_xyz")
                .collection("tokens").doc("user_abc");

            // Inner doc first tests
            //create tests
            await firebase.assertFails(testInnerDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testInnerDoc.get());

            //update tests
            await firebase.assertFails(testInnerDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testInnerDoc.delete());

            //Outer doc tests
            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert sales collection is safe", async () => {
            const testDoc = dbModerator.collection("sales").doc("user_xyz");

            //create test
            await firebase.assertFails(testDoc.set({foo: "bar", buyerName: "Dummy", weeklyTotal: 500 }));

            //read test
            await firebase.assertFails(testDoc.get());

            //update test
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete test
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert eggs collection is safe", async () => {
            const testDoc = dbModerator.collection("eggs").doc("Month 10 Date 01");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar", date: "Sun Nov 01 2020 00:00:00 GMT+0000 (Greenwich Mean Time)"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert notifications collection is safe", async () => {
            const testDoc = dbModerator.collection("notifications").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

    });

    describe("with auth privileges", () => {

        it("Assert users collection is safe", async () => {
            const testDoc = db.collection("users").doc("user");

            //create tests
            await firebase.assertSucceeds(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert oweJeff collection is safe", async () => {
            const testDoc = db.collection("oweJeff").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert Profit collection is safe", async () => {
            const testDoc = db.collection("profit").doc("wer");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert Latest News collection is safe", async () => {
            const testDoc = db.collection("latestNews").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert deadSick collection is safe", async () => {
            const testDoc = db.collection("deadSick").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert chickenDetails collection is safe", async () => {
            const testDoc = db.collection("chickenDetails").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert otherDebt collection is safe", async () => {
            const testDoc = db.collection("otherDebt").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert Borrow collection is safe", async () => {
            const testDoc = db.collection("borrow").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert bags collection is safe", async () => {
            const testDoc = db.collection("bags").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert trays collection is safe", async () => {
            const testDoc = db.collection("trays").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert current collection is safe", async () => {
            const testDoc = db.collection("current").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert userLogs collection is safe", async () => {
            const testDoc = db.collection("userLogs").doc("user_xyz");

            const testInnerDoc = db.collection("userLogs").doc("user_xyz")
                .collection("logs").doc("user_abc");

            //Inner doc tests first

            //create
            await firebase.assertFails(testInnerDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testInnerDoc.get());

            //update tests
            await firebase.assertFails(testInnerDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testInnerDoc.delete());

            // Outer doc tests
            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert buys collection is safe", async () => {
            const testDoc = db.collection("buys").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert latePayment collection is safe", async () => {
            const testDoc = db.collection("latePayment").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert notifyToken collection is safe", async () => {
            const testDoc = db.collection("notifyToken").doc("user_xyz");

            const testInnerDoc = db.collection("notifyToken").doc("user_xyz")
                .collection("tokens").doc("user_abc");

            // Inner doc first tests
            //create tests
            await firebase.assertFails(testInnerDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testInnerDoc.get());

            //update tests
            await firebase.assertFails(testInnerDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testInnerDoc.delete());

            //Outer doc tests
            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert sales collection is safe", async () => {
            const testDoc = db.collection("sales").doc("user_xyz");

            //create test
            await firebase.assertFails(testDoc.set({foo: "bar", buyerName: "Dummy", weeklyTotal: 500 }));

            //read test
            await firebase.assertFails(testDoc.get());

            //update test
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete test
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert eggs collection is safe", async () => {
            const testDoc = db.collection("eggs").doc("Month 10 Date 01");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar", date: "Sun Nov 01 2020 00:00:00 GMT+0000 (Greenwich Mean Time)"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert notifications collection is safe", async () => {
            const testDoc = db.collection("notifications").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

    });

    describe("with no privileges", () => {

        it("Assert users collection is safe", async () => {
            const testDoc = dbNoAuth.collection("users").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert oweJeff collection is safe", async () => {
            const testDoc = dbNoAuth.collection("oweJeff").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert Profit collection is safe", async () => {
            const testDoc = dbNoAuth.collection("profit").doc("wer");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert Latest News collection is safe", async () => {
            const testDoc = dbNoAuth.collection("latestNews").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert deadSick collection is safe", async () => {
            const testDoc = dbNoAuth.collection("deadSick").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert chickenDetails collection is safe", async () => {
            const testDoc = dbNoAuth.collection("chickenDetails").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert otherDebt collection is safe", async () => {
            const testDoc = dbNoAuth.collection("otherDebt").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert Borrow collection is safe", async () => {
            const testDoc = dbNoAuth.collection("borrow").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert bags collection is safe", async () => {
            const testDoc = dbNoAuth.collection("bags").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert trays collection is safe", async () => {
            const testDoc = dbNoAuth.collection("trays").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert current collection is safe", async () => {
            const testDoc = dbNoAuth.collection("current").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert userLogs collection is safe", async () => {
            const testDoc = dbNoAuth.collection("userLogs").doc("user_xyz");

            const testInnerDoc = dbNoAuth.collection("userLogs").doc("user_xyz")
                .collection("logs").doc("user_abc");

            //Inner doc tests first

            //create
            await firebase.assertFails(testInnerDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testInnerDoc.get());

            //update tests
            await firebase.assertFails(testInnerDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testInnerDoc.delete());

            // Outer doc tests
            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert buys collection is safe", async () => {
            const testDoc = dbNoAuth.collection("buys").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert latePayment collection is safe", async () => {
            const testDoc = dbNoAuth.collection("latePayment").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert notifyToken collection is safe", async () => {
            const testDoc = dbNoAuth.collection("notifyToken").doc("user_xyz");

            const testInnerDoc = dbNoAuth.collection("notifyToken").doc("user_xyz")
                .collection("tokens").doc("user_abc");

            // Inner doc first tests
            //create tests
            await firebase.assertFails(testInnerDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testInnerDoc.get());

            //update tests
            await firebase.assertFails(testInnerDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testInnerDoc.delete());

            //Outer doc tests
            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });

        it("Assert sales collection is safe", async () => {
            const testDoc = dbNoAuth.collection("sales").doc("user_xyz");

            //create test
            await firebase.assertFails(testDoc.set({foo: "bar", buyerName: "Dummy", weeklyTotal: 500 }));

            //read test
            await firebase.assertFails(testDoc.get());

            //update test
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete test
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert eggs collection is safe", async () => {
            const testDoc = dbNoAuth.collection("eggs").doc("Month 10 Date 01");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar", date: "Sun Nov 01 2020 00:00:00 GMT+0000 (Greenwich Mean Time)"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());

        });

        it("Assert notifications collection is safe", async () => {
            const testDoc = dbNoAuth.collection("notifications").doc("user_xyz");

            //create tests
            await firebase.assertFails(testDoc.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDoc.get());

            //update tests
            await firebase.assertFails(testDoc.update({foo: 'faz'}));

            //delete tests
            await firebase.assertFails(testDoc.delete());
        });
    });

    describe("test 2", () => {
        it("Assert users collection is safe", async () => {


            //create tests
            // await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
            await firebase.assertSucceeds(testDocChanger.set({foo: "bar"}));
            //     await firebase.assertSucceeds(testDocModerator.set({foo: "bar"}));
            //     await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
            // await firebase.assertFails(testDocNoAuth.set({foo: "bar"}));

            //read tests
            //   await firebase.assertSucceeds(testDoc.get());
            //    await firebase.assertSucceeds(testDocChanger.get());
            //  await firebase.assertSucceeds(testDocModerator.get());
            //   await firebase.assertSucceeds(testDoc.get());
            // await firebase.assertFails(testDocNoAuth.get());

            //update tests
            /*   await firebase.assertFails(testDoc.update({foo: 'faz'}));
               await firebase.assertFails(testDocChanger.update({foo: 'faz'}));
               await firebase.assertFails(testDocModerator.update({foo: 'faz'}));
               await firebase.assertFails(testDoc.update({foo: 'faz'}));
               await firebase.assertFails(testDocNoAuth.update({foo: "faz"}));

               //delete tests
               await firebase.assertFails(testDoc.delete());
               await firebase.assertFails(testDocChanger.delete());
               await firebase.assertFails(testDocModerator.delete());
               await firebase.assertFails(testDoc.delete());
               await firebase.assertFails(testDocNoAuth.delete()); */

        });
    })
});

after(async() => {
    await firebase.clearFirestoreData({projectId: MY_PROJECT_ID});
});
