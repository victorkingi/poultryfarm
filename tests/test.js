const assert = require('assert');
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

describe("Unit tests for poultryfarm web app", () => {

    describe("Every user token has correct amount of permissions", () => {
        /*
        admins:
            read: users, oweJeff, profit, latestNews, deadSick, chickenDetails, otherDebt
                borrow, bags, trays, current, buys, latePayment, notifyToken, tokens, sales,
                eggs, notifications
            create: users, oweJeff, deadSick, otherDebt, borrow, userLogs/logs, buys, latePayment,
                notifyToken/tokens, sales, eggs, notifications
            delete: latePayment, borrow, oweJeff
            update: sales, chickenDetails, bags, trays, current, oweJeff
         */
        /*
         changer:
            read: users, chickenDetails, borrow, bags, trays, current, buys, latePayment, notifyToken/tokens,
                sales, eggs, notifications
            create: users, borrow, userLogs/logs, buys, latePayment, notifyTokens/tokens, sales, eggs,
                notifications
            delete: borrow, latePayment
            update: chickenDetails, bags, trays, current, sales
         */
        /*
        moderator:
            read: NONE
            create: latestNews
            delete: latestNews
            update: latestNews
         */
        it("Assert users collection is safe", async () => {
            const testDocAdmin = dbAdmin.collection("users").doc("user_xyz");
            const testDocChanger = dbChanger.collection("users").doc("user_xyz");
            const testDocModerator = dbModerator.collection("users").doc("user_xyz");
            const testDoc = db.collection("users").doc("user_xyz");
            const testDocNoAuth = dbNoAuth.collection("users").doc("user_xyz");

            //create tests
            await firebase.assertSucceeds(testDocAdmin.set({foo: "bar"}));
            await firebase.assertSucceeds(testDocChanger.set({foo: "bar"}));
            await firebase.assertSucceeds(testDocModerator.set({foo: "bar"}));
            await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
            await firebase.assertFails(testDocNoAuth.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDocAdmin.get());
            await firebase.assertSucceeds(testDocChanger.get());
            await firebase.assertSucceeds(testDocModerator.get());
            await firebase.assertSucceeds(testDoc.get());
            await firebase.assertFails(testDocNoAuth.get());

            //update tests
            await firebase.assertFails(testDocAdmin.update({foo: 'faz'}));
            await firebase.assertFails(testDocChanger.update({foo: 'faz'}));
            await firebase.assertFails(testDocModerator.update({foo: 'faz'}));
            await firebase.assertFails(testDoc.update({foo: 'faz'}));
            await firebase.assertFails(testDocNoAuth.update({foo: "faz"}));

            //delete tests
            await firebase.assertFails(testDocAdmin.delete());
            await firebase.assertFails(testDocChanger.delete());
            await firebase.assertFails(testDocModerator.delete());
            await firebase.assertFails(testDoc.delete());
            await firebase.assertFails(testDocNoAuth.delete());

        });

        it("Assert oweJeff collection is safe", async () => {
            const testDocAdmin = dbAdmin.collection("oweJeff").doc("user_xyz");
            const testDocChanger = dbChanger.collection("oweJeff").doc("user_xyz");
            const testDocModerator = dbModerator.collection("oweJeff").doc("user_xyz");
            const testDoc = db.collection("oweJeff").doc("user_xyz");
            const testDocNoAuth = dbNoAuth.collection("oweJeff").doc("user_xyz");

            //create tests
            await firebase.assertSucceeds(testDocAdmin.set({foo: "bar"}));
            await firebase.assertFails(testDocChanger.set({foo: "bar"}));
            await firebase.assertFails(testDocModerator.set({foo: "bar"}));
            await firebase.assertFails(testDoc.set({foo: "bar"}));
            await firebase.assertFails(testDocNoAuth.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDocAdmin.get());
            await firebase.assertFails(testDocChanger.get());
            await firebase.assertFails(testDocModerator.get());
            await firebase.assertFails(testDoc.get());
            await firebase.assertFails(testDocNoAuth.get());

            //update tests
            await firebase.assertSucceeds(testDocAdmin.update({foo: 'faz'}));
            await firebase.assertFails(testDocChanger.update({foo: 'faz'}));
            await firebase.assertFails(testDocModerator.update({foo: 'faz'}));
            await firebase.assertFails(testDoc.update({foo: 'faz'}));
            await firebase.assertFails(testDocNoAuth.update({foo: "faz"}));

            //delete tests
            await firebase.assertSucceeds(testDocAdmin.delete());
            await firebase.assertFails(testDocChanger.delete());
            await firebase.assertFails(testDocModerator.delete());
            await firebase.assertFails(testDoc.delete());
            await firebase.assertFails(testDocNoAuth.delete());

        });

        it("Assert Profit collection is safe", async () => {
            const testDocAdmin = dbAdmin.collection("profit").doc("user_xyz");
            const testDocChanger = dbChanger.collection("profit").doc("user_xyz");
            const testDocModerator = dbModerator.collection("profit").doc("user_xyz");
            const testDoc = db.collection("profit").doc("user_xyz");
            const testDocNoAuth = dbNoAuth.collection("profit").doc("user_xyz");

            //create tests
            await firebase.assertSucceeds(testDocAdmin.set({foo: "bar"}));
            await firebase.assertFails(testDocChanger.set({foo: "bar"}));
            await firebase.assertFails(testDocModerator.set({foo: "bar"}));
            await firebase.assertFails(testDoc.set({foo: "bar"}));
            await firebase.assertFails(testDocNoAuth.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDocAdmin.get());
            await firebase.assertFails(testDocChanger.get());
            await firebase.assertFails(testDocModerator.get());
            await firebase.assertFails(testDoc.get());
            await firebase.assertFails(testDocNoAuth.get());

            //update tests
            await firebase.assertFails(testDocAdmin.update({foo: 'faz'}));
            await firebase.assertFails(testDocChanger.update({foo: 'faz'}));
            await firebase.assertFails(testDocModerator.update({foo: 'faz'}));
            await firebase.assertFails(testDoc.update({foo: 'faz'}));
            await firebase.assertFails(testDocNoAuth.update({foo: "faz"}));

            //delete tests
            await firebase.assertFails(testDocAdmin.delete());
            await firebase.assertFails(testDocChanger.delete());
            await firebase.assertFails(testDocModerator.delete());
            await firebase.assertFails(testDoc.delete());
            await firebase.assertFails(testDocNoAuth.delete());

        });

        it("Assert Latest News collection is safe", async () => {
            const testDocAdmin = dbAdmin.collection("latestNews").doc("user_xyz");
            const testDocChanger = dbChanger.collection("latestNews").doc("user_xyz");
            const testDocModerator = dbModerator.collection("latestNews").doc("user_xyz");
            const testDoc = db.collection("latestNews").doc("user_xyz");
            const testDocNoAuth = dbNoAuth.collection("latestNews").doc("user_xyz");

            //create tests
            await firebase.assertSucceeds(testDocAdmin.set({foo: "bar"}));
            await firebase.assertFails(testDocChanger.set({foo: "bar"}));
            await firebase.assertSucceeds(testDocModerator.set({foo: "bar"}));
            await firebase.assertFails(testDoc.set({foo: "bar"}));
            await firebase.assertFails(testDocNoAuth.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDocAdmin.get());
            await firebase.assertFails(testDocChanger.get());
            await firebase.assertFails(testDocModerator.get());
            await firebase.assertFails(testDoc.get());
            await firebase.assertFails(testDocNoAuth.get());

            //update tests
            await firebase.assertFails(testDocAdmin.update({foo: 'faz'}));
            await firebase.assertFails(testDocChanger.update({foo: 'faz'}));
            await firebase.assertSucceeds(testDocModerator.update({foo: 'faz'}));
            await firebase.assertFails(testDoc.update({foo: 'faz'}));
            await firebase.assertFails(testDocNoAuth.update({foo: "faz"}));

            //delete tests
            await firebase.assertFails(testDocAdmin.delete());
            await firebase.assertFails(testDocChanger.delete());
            await firebase.assertSucceeds(testDocModerator.delete());
            await firebase.assertFails(testDoc.delete());
            await firebase.assertFails(testDocNoAuth.delete());

        });

        it("Assert deadSick collection is safe", async () => {
            const testDocAdmin = dbAdmin.collection("deadSick").doc("user_xyz");
            const testDocChanger = dbChanger.collection("deadSick").doc("user_xyz");
            const testDocModerator = dbModerator.collection("deadSick").doc("user_xyz");
            const testDoc = db.collection("deadSick").doc("user_xyz");
            const testDocNoAuth = dbNoAuth.collection("deadSick").doc("user_xyz");

            //create tests
            await firebase.assertSucceeds(testDocAdmin.set({foo: "bar"}));
            await firebase.assertFails(testDocChanger.set({foo: "bar"}));
            await firebase.assertFails(testDocModerator.set({foo: "bar"}));
            await firebase.assertFails(testDoc.set({foo: "bar"}));
            await firebase.assertFails(testDocNoAuth.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDocAdmin.get());
            await firebase.assertFails(testDocChanger.get());
            await firebase.assertFails(testDocModerator.get());
            await firebase.assertFails(testDoc.get());
            await firebase.assertFails(testDocNoAuth.get());

            //update tests
            await firebase.assertFails(testDocAdmin.update({foo: 'faz'}));
            await firebase.assertFails(testDocChanger.update({foo: 'faz'}));
            await firebase.assertFails(testDocModerator.update({foo: 'faz'}));
            await firebase.assertFails(testDoc.update({foo: 'faz'}));
            await firebase.assertFails(testDocNoAuth.update({foo: "faz"}));

            //delete tests
            await firebase.assertFails(testDocAdmin.delete());
            await firebase.assertFails(testDocChanger.delete());
            await firebase.assertFails(testDocModerator.delete());
            await firebase.assertFails(testDoc.delete());
            await firebase.assertFails(testDocNoAuth.delete());

        });

        it("Assert chickenDetails collection is safe", async () => {
            const testDocAdmin = dbAdmin.collection("chickenDetails").doc("user_xyz");
            const testDocChanger = dbChanger.collection("chickenDetails").doc("user_xyz");
            const testDocModerator = dbModerator.collection("chickenDetails").doc("user_xyz");
            const testDoc = db.collection("chickenDetails").doc("user_xyz");
            const testDocNoAuth = dbNoAuth.collection("chickenDetails").doc("user_xyz");

            //create tests
            await firebase.assertSucceeds(testDocAdmin.set({foo: "bar"}));
            await firebase.assertSucceeds(testDocChanger.set({foo: "bar"}));
            await firebase.assertFails(testDocModerator.set({foo: "bar"}));
            await firebase.assertFails(testDoc.set({foo: "bar"}));
            await firebase.assertFails(testDocNoAuth.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDocAdmin.get());
            await firebase.assertSucceeds(testDocChanger.get());
            await firebase.assertFails(testDocModerator.get());
            await firebase.assertFails(testDoc.get());
            await firebase.assertFails(testDocNoAuth.get());

            //update tests
            await firebase.assertSucceeds(testDocAdmin.update({foo: 'faz'}));
            await firebase.assertSucceeds(testDocChanger.update({foo: 'faz'}));
            await firebase.assertFails(testDocModerator.update({foo: 'faz'}));
            await firebase.assertFails(testDoc.update({foo: 'faz'}));
            await firebase.assertFails(testDocNoAuth.update({foo: "faz"}));

            //delete tests
            await firebase.assertFails(testDocAdmin.delete());
            await firebase.assertFails(testDocChanger.delete());
            await firebase.assertFails(testDocModerator.delete());
            await firebase.assertFails(testDoc.delete());
            await firebase.assertFails(testDocNoAuth.delete());

        });

        it("Assert otherDebt collection is safe", async () => {
            const testDocAdmin = dbAdmin.collection("otherDebt").doc("user_xyz");
            const testDocChanger = dbChanger.collection("otherDebt").doc("user_xyz");
            const testDocModerator = dbModerator.collection("otherDebt").doc("user_xyz");
            const testDoc = db.collection("otherDebt").doc("user_xyz");
            const testDocNoAuth = dbNoAuth.collection("otherDebt").doc("user_xyz");

            //create tests
            await firebase.assertSucceeds(testDocAdmin.set({foo: "bar"}));
            await firebase.assertFails(testDocChanger.set({foo: "bar"}));
            await firebase.assertFails(testDocModerator.set({foo: "bar"}));
            await firebase.assertFails(testDoc.set({foo: "bar"}));
            await firebase.assertFails(testDocNoAuth.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDocAdmin.get());
            await firebase.assertFails(testDocChanger.get());
            await firebase.assertFails(testDocModerator.get());
            await firebase.assertFails(testDoc.get());
            await firebase.assertFails(testDocNoAuth.get());

            //update tests
            await firebase.assertFails(testDocAdmin.update({foo: 'faz'}));
            await firebase.assertFails(testDocChanger.update({foo: 'faz'}));
            await firebase.assertFails(testDocModerator.update({foo: 'faz'}));
            await firebase.assertFails(testDoc.update({foo: 'faz'}));
            await firebase.assertFails(testDocNoAuth.update({foo: "faz"}));

            //delete tests
            await firebase.assertFails(testDocAdmin.delete());
            await firebase.assertFails(testDocChanger.delete());
            await firebase.assertFails(testDocModerator.delete());
            await firebase.assertFails(testDoc.delete());
            await firebase.assertFails(testDocNoAuth.delete());

        });

        it("Assert Borrow collection is safe", async () => {
            const testDocAdmin = dbAdmin.collection("borrow").doc("user_xyz");
            const testDocChanger = dbChanger.collection("borrow").doc("user_xyz");
            const testDocModerator = dbModerator.collection("borrow").doc("user_xyz");
            const testDoc = db.collection("borrow").doc("user_xyz");
            const testDocNoAuth = dbNoAuth.collection("borrow").doc("user_xyz");

            //create tests
            await firebase.assertSucceeds(testDocAdmin.set({foo: "bar"}));
            await firebase.assertSucceeds(testDocChanger.set({foo: "bar"}));
            await firebase.assertFails(testDocModerator.set({foo: "bar"}));
            await firebase.assertFails(testDoc.set({foo: "bar"}));
            await firebase.assertFails(testDocNoAuth.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDocAdmin.get());
            await firebase.assertSucceeds(testDocChanger.get());
            await firebase.assertFails(testDocModerator.get());
            await firebase.assertFails(testDoc.get());
            await firebase.assertFails(testDocNoAuth.get());

            //update tests
            await firebase.assertFails(testDocAdmin.update({foo: 'faz'}));
            await firebase.assertFails(testDocChanger.update({foo: 'faz'}));
            await firebase.assertFails(testDocModerator.update({foo: 'faz'}));
            await firebase.assertFails(testDoc.update({foo: 'faz'}));
            await firebase.assertFails(testDocNoAuth.update({foo: "faz"}));

            //delete tests
            await firebase.assertSucceeds(testDocAdmin.delete());
            await firebase.assertSucceeds(testDocChanger.delete());
            await firebase.assertFails(testDocModerator.delete());
            await firebase.assertFails(testDoc.delete());
            await firebase.assertFails(testDocNoAuth.delete());

        });

        it("Assert bags collection is safe", async () => {
            const testDocAdmin = dbAdmin.collection("bags").doc("user_xyz");
            const testDocChanger = dbChanger.collection("bags").doc("user_xyz");
            const testDocModerator = dbModerator.collection("bags").doc("user_xyz");
            const testDoc = db.collection("bags").doc("user_xyz");
            const testDocNoAuth = dbNoAuth.collection("bags").doc("user_xyz");

            //create tests
            await firebase.assertSucceeds(testDocAdmin.set({foo: "bar"}));
            await firebase.assertSucceeds(testDocChanger.set({foo: "bar"}));
            await firebase.assertFails(testDocModerator.set({foo: "bar"}));
            await firebase.assertFails(testDoc.set({foo: "bar"}));
            await firebase.assertFails(testDocNoAuth.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDocAdmin.get());
            await firebase.assertSucceeds(testDocChanger.get());
            await firebase.assertFails(testDocModerator.get());
            await firebase.assertFails(testDoc.get());
            await firebase.assertFails(testDocNoAuth.get());

            //update tests
            await firebase.assertSucceeds(testDocAdmin.update({foo: 'faz'}));
            await firebase.assertSucceeds(testDocChanger.update({foo: 'faz'}));
            await firebase.assertFails(testDocModerator.update({foo: 'faz'}));
            await firebase.assertFails(testDoc.update({foo: 'faz'}));
            await firebase.assertFails(testDocNoAuth.update({foo: "faz"}));

            //delete tests
            await firebase.assertFails(testDocAdmin.delete());
            await firebase.assertFails(testDocChanger.delete());
            await firebase.assertFails(testDocModerator.delete());
            await firebase.assertFails(testDoc.delete());
            await firebase.assertFails(testDocNoAuth.delete());

        });

        it("Assert trays collection is safe", async () => {
            const testDocAdmin = dbAdmin.collection("trays").doc("user_xyz");
            const testDocChanger = dbChanger.collection("trays").doc("user_xyz");
            const testDocModerator = dbModerator.collection("trays").doc("user_xyz");
            const testDoc = db.collection("trays").doc("user_xyz");
            const testDocNoAuth = dbNoAuth.collection("trays").doc("user_xyz");

            //create tests
            await firebase.assertSucceeds(testDocAdmin.set({foo: "bar"}));
            await firebase.assertSucceeds(testDocChanger.set({foo: "bar"}));
            await firebase.assertFails(testDocModerator.set({foo: "bar"}));
            await firebase.assertFails(testDoc.set({foo: "bar"}));
            await firebase.assertFails(testDocNoAuth.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDocAdmin.get());
            await firebase.assertSucceeds(testDocChanger.get());
            await firebase.assertFails(testDocModerator.get());
            await firebase.assertFails(testDoc.get());
            await firebase.assertFails(testDocNoAuth.get());

            //update tests
            await firebase.assertSucceeds(testDocAdmin.update({foo: 'faz'}));
            await firebase.assertSucceeds(testDocChanger.update({foo: 'faz'}));
            await firebase.assertFails(testDocModerator.update({foo: 'faz'}));
            await firebase.assertFails(testDoc.update({foo: 'faz'}));
            await firebase.assertFails(testDocNoAuth.update({foo: "faz"}));

            //delete tests
            await firebase.assertFails(testDocAdmin.delete());
            await firebase.assertFails(testDocChanger.delete());
            await firebase.assertFails(testDocModerator.delete());
            await firebase.assertFails(testDoc.delete());
            await firebase.assertFails(testDocNoAuth.delete());

        });

        it("Assert current collection is safe", async () => {
            const testDocAdmin = dbAdmin.collection("current").doc("user_xyz");
            const testDocChanger = dbChanger.collection("current").doc("user_xyz");
            const testDocModerator = dbModerator.collection("current").doc("user_xyz");
            const testDoc = db.collection("current").doc("user_xyz");
            const testDocNoAuth = dbNoAuth.collection("current").doc("user_xyz");

            //create tests
            await firebase.assertSucceeds(testDocAdmin.set({foo: "bar"}));
            await firebase.assertSucceeds(testDocChanger.set({foo: "bar"}));
            await firebase.assertFails(testDocModerator.set({foo: "bar"}));
            await firebase.assertFails(testDoc.set({foo: "bar"}));
            await firebase.assertFails(testDocNoAuth.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDocAdmin.get());
            await firebase.assertSucceeds(testDocChanger.get());
            await firebase.assertFails(testDocModerator.get());
            await firebase.assertFails(testDoc.get());
            await firebase.assertFails(testDocNoAuth.get());

            //update tests
            await firebase.assertSucceeds(testDocAdmin.update({foo: 'faz'}));
            await firebase.assertSucceeds(testDocChanger.update({foo: 'faz'}));
            await firebase.assertFails(testDocModerator.update({foo: 'faz'}));
            await firebase.assertFails(testDoc.update({foo: 'faz'}));
            await firebase.assertFails(testDocNoAuth.update({foo: "faz"}));

            //delete tests
            await firebase.assertFails(testDocAdmin.delete());
            await firebase.assertFails(testDocChanger.delete());
            await firebase.assertFails(testDocModerator.delete());
            await firebase.assertFails(testDoc.delete());
            await firebase.assertFails(testDocNoAuth.delete());

        });

        it("Assert userLogs collection is safe", async () => {
            const testDocAdmin = dbAdmin.collection("userLogs").doc("user_xyz");
            const testDocChanger = dbChanger.collection("userLogs").doc("user_xyz");
            const testDocModerator = dbModerator.collection("userLogs").doc("user_xyz");
            const testDoc = db.collection("userLogs").doc("user_xyz");
            const testDocNoAuth = dbNoAuth.collection("userLogs").doc("user_xyz");

            const testInnerDocAdmin = dbAdmin.collection("userLogs").doc("user_xyz")
                .collection("logs").doc("user_abc");
            const testInnerDocChanger = dbChanger.collection("userLogs").doc("user_xyz")
                .collection("logs").doc("user_abc");
            const testInnerDocModerator = dbModerator.collection("userLogs").doc("user_xyz")
                .collection("logs").doc("user_abc");
            const testInnerDoc = db.collection("userLogs").doc("user_xyz")
                .collection("logs").doc("user_abc");
            const testInnerDocNoAuth = dbNoAuth.collection("userLogs").doc("user_xyz")
                .collection("logs").doc("user_abc");

            /*
            Inner doc tests first
             */
            //create
            await firebase.assertSucceeds(testInnerDocAdmin.set({foo: "bar"}));
            await firebase.assertSucceeds(testInnerDocChanger.set({foo: "bar"}));
            await firebase.assertFails(testInnerDocModerator.set({foo: "bar"}));
            await firebase.assertFails(testInnerDoc.set({foo: "bar"}));
            await firebase.assertFails(testInnerDocNoAuth.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testInnerDocAdmin.get());
            await firebase.assertFails(testInnerDocChanger.get());
            await firebase.assertFails(testInnerDocModerator.get());
            await firebase.assertFails(testInnerDoc.get());
            await firebase.assertFails(testInnerDocNoAuth.get());

            //update tests
            await firebase.assertFails(testInnerDocAdmin.update({foo: 'faz'}));
            await firebase.assertFails(testInnerDocChanger.update({foo: 'faz'}));
            await firebase.assertFails(testInnerDocModerator.update({foo: 'faz'}));
            await firebase.assertFails(testInnerDoc.update({foo: 'faz'}));
            await firebase.assertFails(testInnerDocNoAuth.update({foo: "faz"}));

            //delete tests
            await firebase.assertFails(testInnerDocAdmin.delete());
            await firebase.assertFails(testInnerDocChanger.delete());
            await firebase.assertFails(testInnerDocModerator.delete());
            await firebase.assertFails(testInnerDoc.delete());
            await firebase.assertFails(testInnerDocNoAuth.delete());

            /*
             Outer doc tests
             */
            //create tests
            await firebase.assertFails(testDocAdmin.set({foo: "bar"}));
            await firebase.assertFails(testDocChanger.set({foo: "bar"}));
            await firebase.assertFails(testDocModerator.set({foo: "bar"}));
            await firebase.assertFails(testDoc.set({foo: "bar"}));
            await firebase.assertFails(testDocNoAuth.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDocAdmin.get());
            await firebase.assertFails(testDocChanger.get());
            await firebase.assertFails(testDocModerator.get());
            await firebase.assertFails(testDoc.get());
            await firebase.assertFails(testDocNoAuth.get());

            //update tests
            await firebase.assertFails(testDocAdmin.update({foo: 'faz'}));
            await firebase.assertFails(testDocChanger.update({foo: 'faz'}));
            await firebase.assertFails(testDocModerator.update({foo: 'faz'}));
            await firebase.assertFails(testDoc.update({foo: 'faz'}));
            await firebase.assertFails(testDocNoAuth.update({foo: "faz"}));

            //delete tests
            await firebase.assertFails(testDocAdmin.delete());
            await firebase.assertFails(testDocChanger.delete());
            await firebase.assertFails(testDocModerator.delete());
            await firebase.assertFails(testDoc.delete());
            await firebase.assertFails(testDocNoAuth.delete());

        });

        it("Assert buys collection is safe", async () => {
            const testDocAdmin = dbAdmin.collection("buys").doc("user_xyz");
            const testDocChanger = dbChanger.collection("buys").doc("user_xyz");
            const testDocModerator = dbModerator.collection("buys").doc("user_xyz");
            const testDoc = db.collection("buys").doc("user_xyz");
            const testDocNoAuth = dbNoAuth.collection("buys").doc("user_xyz");

            //create tests
            await firebase.assertSucceeds(testDocAdmin.set({foo: "bar"}));
            await firebase.assertSucceeds(testDocChanger.set({foo: "bar"}));
            await firebase.assertFails(testDocModerator.set({foo: "bar"}));
            await firebase.assertFails(testDoc.set({foo: "bar"}));
            await firebase.assertFails(testDocNoAuth.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDocAdmin.get());
            await firebase.assertSucceeds(testDocChanger.get());
            await firebase.assertFails(testDocModerator.get());
            await firebase.assertFails(testDoc.get());
            await firebase.assertFails(testDocNoAuth.get());

            //update tests
            await firebase.assertFails(testDocAdmin.update({foo: 'faz'}));
            await firebase.assertFails(testDocChanger.update({foo: 'faz'}));
            await firebase.assertFails(testDocModerator.update({foo: 'faz'}));
            await firebase.assertFails(testDoc.update({foo: 'faz'}));
            await firebase.assertFails(testDocNoAuth.update({foo: "faz"}));

            //delete tests
            await firebase.assertFails(testDocAdmin.delete());
            await firebase.assertFails(testDocChanger.delete());
            await firebase.assertFails(testDocModerator.delete());
            await firebase.assertFails(testDoc.delete());
            await firebase.assertFails(testDocNoAuth.delete());

        });

        it("Assert latePayment collection is safe", async () => {
            const testDocAdmin = dbAdmin.collection("latePayment").doc("user_xyz");
            const testDocChanger = dbChanger.collection("latePayment").doc("user_xyz");
            const testDocModerator = dbModerator.collection("latePayment").doc("user_xyz");
            const testDoc = db.collection("latePayment").doc("user_xyz");
            const testDocNoAuth = dbNoAuth.collection("latePayment").doc("user_xyz");

            //create tests
            await firebase.assertSucceeds(testDocAdmin.set({foo: "bar"}));
            await firebase.assertSucceeds(testDocChanger.set({foo: "bar"}));
            await firebase.assertFails(testDocModerator.set({foo: "bar"}));
            await firebase.assertFails(testDoc.set({foo: "bar"}));
            await firebase.assertFails(testDocNoAuth.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testDocAdmin.get());
            await firebase.assertSucceeds(testDocChanger.get());
            await firebase.assertFails(testDocModerator.get());
            await firebase.assertFails(testDoc.get());
            await firebase.assertFails(testDocNoAuth.get());

            //update tests
            await firebase.assertFails(testDocAdmin.update({foo: 'faz'}));
            await firebase.assertFails(testDocChanger.update({foo: 'faz'}));
            await firebase.assertFails(testDocModerator.update({foo: 'faz'}));
            await firebase.assertFails(testDoc.update({foo: 'faz'}));
            await firebase.assertFails(testDocNoAuth.update({foo: "faz"}));

            //delete tests
            await firebase.assertSucceeds(testDocAdmin.delete());
            await firebase.assertSucceeds(testDocChanger.delete());
            await firebase.assertFails(testDocModerator.delete());
            await firebase.assertFails(testDoc.delete());
            await firebase.assertFails(testDocNoAuth.delete());

        });

        it("Assert notifyToken collection is safe", async () => {
            const testDocAdmin = dbAdmin.collection("notifyToken").doc("user_xyz");
            const testDocChanger = dbChanger.collection("notifyToken").doc("user_xyz");
            const testDocModerator = dbModerator.collection("notifyToken").doc("user_xyz");
            const testDoc = db.collection("notifyToken").doc("user_xyz");
            const testDocNoAuth = dbNoAuth.collection("notifyToken").doc("user_xyz");

            const testInnerDocAdmin = dbAdmin.collection("notifyToken").doc("user_xyz")
                .collection("tokens").doc("user_abc");
            const testInnerDocChanger = dbChanger.collection("notifyToken").doc("user_xyz")
                .collection("tokens").doc("user_abc");
            const testInnerDocModerator = dbModerator.collection("notifyToken").doc("user_xyz")
                .collection("tokens").doc("user_abc");
            const testInnerDoc = db.collection("notifyToken").doc("user_xyz")
                .collection("tokens").doc("user_abc");
            const testInnerDocNoAuth = dbNoAuth.collection("notifyToken").doc("user_xyz")
                .collection("tokens").doc("user_abc");

            /*
             Inner doc first tests
             */
            //create tests
            await firebase.assertSucceeds(testInnerDocAdmin.set({foo: "bar"}));
            await firebase.assertSucceeds(testInnerDocChanger.set({foo: "bar"}));
            await firebase.assertFails(testInnerDocModerator.set({foo: "bar"}));
            await firebase.assertFails(testInnerDoc.set({foo: "bar"}));
            await firebase.assertFails(testInnerDocNoAuth.set({foo: "bar"}));

            //read tests
            await firebase.assertSucceeds(testInnerDocAdmin.get());
            await firebase.assertSucceeds(testInnerDocChanger.get());
            await firebase.assertFails(testInnerDocModerator.get());
            await firebase.assertFails(testInnerDoc.get());
            await firebase.assertFails(testInnerDocNoAuth.get());

            //update tests
            await firebase.assertFails(testInnerDocAdmin.update({foo: 'faz'}));
            await firebase.assertFails(testInnerDocChanger.update({foo: 'faz'}));
            await firebase.assertFails(testInnerDocModerator.update({foo: 'faz'}));
            await firebase.assertFails(testInnerDoc.update({foo: 'faz'}));
            await firebase.assertFails(testInnerDocNoAuth.update({foo: "faz"}));

            //delete tests
            await firebase.assertFails(testInnerDocAdmin.delete());
            await firebase.assertFails(testInnerDocChanger.delete());
            await firebase.assertFails(testInnerDocModerator.delete());
            await firebase.assertFails(testInnerDoc.delete());
            await firebase.assertFails(testInnerDocNoAuth.delete());

            /*
             Outer doc tests
             */
            //create tests
            await firebase.assertFails(testDocAdmin.set({foo: "bar"}));
            await firebase.assertFails(testDocChanger.set({foo: "bar"}));
            await firebase.assertFails(testDocModerator.set({foo: "bar"}));
            await firebase.assertFails(testDoc.set({foo: "bar"}));
            await firebase.assertFails(testDocNoAuth.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDocAdmin.get());
            await firebase.assertFails(testDocChanger.get());
            await firebase.assertFails(testDocModerator.get());
            await firebase.assertFails(testDoc.get());
            await firebase.assertFails(testDocNoAuth.get());

            //update tests
            await firebase.assertFails(testDocAdmin.update({foo: 'faz'}));
            await firebase.assertFails(testDocChanger.update({foo: 'faz'}));
            await firebase.assertFails(testDocModerator.update({foo: 'faz'}));
            await firebase.assertFails(testDoc.update({foo: 'faz'}));
            await firebase.assertFails(testDocNoAuth.update({foo: "faz"}));

            //delete tests
            await firebase.assertFails(testDocAdmin.delete());
            await firebase.assertFails(testDocChanger.delete());
            await firebase.assertFails(testDocModerator.delete());
            await firebase.assertFails(testDoc.delete());
            await firebase.assertFails(testDocNoAuth.delete());

        });

        it("Assert sales collection is safe", async () => {
            const testDocAdmin = dbAdmin.collection("sales").doc("user_xyz");
            const testDocChanger = dbChanger.collection("sales").doc("user_xyz");
            const testDocModerator = dbModerator.collection("sales").doc("user_xyz");
            const testDoc = db.collection("sales").doc("user_xyz");
            const testDocNoAuth = dbNoAuth.collection("sales").doc("user_xyz");

            //create tests
            await firebase.assertSucceeds(testDocAdmin.set({foo: "bar", buyerName: "Dummy", weeklyTotal: 500 }));
            await firebase.assertSucceeds(testDocChanger.set({foo: "bar", buyerName: "Dummy", weeklyTotal: 500 }));
            await firebase.assertFails(testDocModerator.set({foo: "bar", buyerName: "Dummy", weeklyTotal: 500 }));
            await firebase.assertFails(testDoc.set({foo: "bar", buyerName: "Dummy", weeklyTotal: 500 }));
            await firebase.assertFails(testDocNoAuth.set({foo: "bar", buyerName: "Dummy", weeklyTotal: 500 }));

            //read tests
            await firebase.assertSucceeds(testDocAdmin.get());
            await firebase.assertSucceeds(testDocChanger.get());
            await firebase.assertFails(testDocModerator.get());
            await firebase.assertFails(testDoc.get());
            await firebase.assertFails(testDocNoAuth.get());

            //update tests
            await firebase.assertSucceeds(testDocAdmin.update({foo: 'faz'}));
            await firebase.assertSucceeds(testDocChanger.update({foo: 'faz'}));
            await firebase.assertFails(testDocModerator.update({foo: 'faz'}));
            await firebase.assertFails(testDoc.update({foo: 'faz'}));
            await firebase.assertFails(testDocNoAuth.update({foo: "faz"}));

            //delete tests
            await firebase.assertFails(testDocAdmin.delete());
            await firebase.assertFails(testDocChanger.delete());
            await firebase.assertFails(testDocModerator.delete());
            await firebase.assertFails(testDoc.delete());
            await firebase.assertFails(testDocNoAuth.delete());

        });

        it("Assert eggs collection is safe", async () => {
            const testDocAdmin = dbAdmin.collection("eggs").doc("Month 10 Date 01");
            const testDocChanger = dbChanger.collection("eggs").doc("Month 10 Date 01");
            const testDocModerator = dbModerator.collection("eggs").doc("Month 10 Date 01");
            const testDoc = db.collection("eggs").doc("Month 10 Date 01");
            const testDocNoAuth = dbNoAuth.collection("eggs").doc("Month 10 Date 01");

            //create tests
            await firebase.assertSucceeds(testDocAdmin.set({foo: "bar", date: "Sun Nov 01 2020 00:00:00 GMT+0000 (Greenwich Mean Time)"}));
            await firebase.assertSucceeds(testDocChanger.set({foo: "bar", date: "Sun Nov 01 2020 00:00:00 GMT+0000 (Greenwich Mean Time)"}));
            await firebase.assertFails(testDocModerator.set({foo: "bar", date: "Sun Nov 01 2020 00:00:00 GMT+0000 (Greenwich Mean Time)"}));
            await firebase.assertFails(testDoc.set({foo: "bar", date: "Sun Nov 01 2020 00:00:00 GMT+0000 (Greenwich Mean Time)"}));
            await firebase.assertFails(testDocNoAuth.set({foo: "bar", date: "Sun Nov 01 2020 00:00:00 GMT+0000 (Greenwich Mean Time)"}));

            //read tests
            await firebase.assertSucceeds(testDocAdmin.get());
            await firebase.assertSucceeds(testDocChanger.get());
            await firebase.assertFails(testDocModerator.get());
            await firebase.assertFails(testDoc.get());
            await firebase.assertFails(testDocNoAuth.get());

            //update tests
            await firebase.assertFails(testDocAdmin.update({foo: 'faz'}));
            await firebase.assertFails(testDocChanger.update({foo: 'faz'}));
            await firebase.assertFails(testDocModerator.update({foo: 'faz'}));
            await firebase.assertFails(testDoc.update({foo: 'faz'}));
            await firebase.assertFails(testDocNoAuth.update({foo: "faz"}));

            //delete tests
            await firebase.assertFails(testDocAdmin.delete());
            await firebase.assertFails(testDocChanger.delete());
            await firebase.assertFails(testDocModerator.delete());
            await firebase.assertFails(testDoc.delete());
            await firebase.assertFails(testDocNoAuth.delete());

        });

        it("Assert notifications collection is safe", async () => {
            const testDocAdmin = dbAdmin.collection("notifications").doc("user_xyz");
            const testDocChanger = dbChanger.collection("notifications").doc("user_xyz");
            const testDocModerator = dbModerator.collection("notifications").doc("user_xyz");
            const testDoc = db.collection("notifications").doc("user_xyz");
            const testDocNoAuth = dbNoAuth.collection("notifications").doc("user_xyz");

            //create tests
            await firebase.assertSucceeds(testDocAdmin.set({foo: "bar"}));
            await firebase.assertSucceeds(testDocChanger.set({foo: "bar"}));
            await firebase.assertFails(testDocModerator.set({foo: "bar"}));
            await firebase.assertFails(testDoc.set({foo: "bar"}));
            await firebase.assertFails(testDocNoAuth.set({foo: "bar"}));

            //read tests
            await firebase.assertFails(testDocAdmin.get());
            await firebase.assertFails(testDocChanger.get());
            await firebase.assertFails(testDocModerator.get());
            await firebase.assertFails(testDoc.get());
            await firebase.assertFails(testDocNoAuth.get());

            //update tests
            await firebase.assertFails(testDocAdmin.update({foo: 'faz'}));
            await firebase.assertFails(testDocChanger.update({foo: 'faz'}));
            await firebase.assertFails(testDocModerator.update({foo: 'faz'}));
            await firebase.assertFails(testDoc.update({foo: 'faz'}));
            await firebase.assertFails(testDocNoAuth.update({foo: "faz"}));

            //delete tests
            await firebase.assertFails(testDocAdmin.delete());
            await firebase.assertFails(testDocChanger.delete());
            await firebase.assertFails(testDocModerator.delete());
            await firebase.assertFails(testDoc.delete());
            await firebase.assertFails(testDocNoAuth.delete());

        });

    })
});

after(async() => {
    await firebase.clearFirestoreData({projectId: MY_PROJECT_ID});
});
