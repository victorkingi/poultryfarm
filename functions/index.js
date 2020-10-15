const numeral = require('numeral');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const topic = 'ALL_USERS';
const adminTopic = 'ADMIN_USERS';
const vpbTopic = 'VPB_USERS';
const vpjTopic = 'VPJ_USERS';
const bpjTopic = 'VPJ_USERS';
const bvjTopic = 'BVJ_USERS';
const victorTopic = 'VICTOR';
const purityTopic = 'PURITY';
const jeffTopic = 'JEFF';
const babraTopic = 'BABRA';
const date = new Date();
const current = date.getDate();
const currentMonth = date.getMonth() + 1;
const getHour = date.getHours();
const getMinute = date.getMinutes();
const getSecond = date.getSeconds();
const year = date.getFullYear();
const chickenDocRef = admin.firestore().collection("chickenDetails").doc("2020");

function isLastDay(dt) {
    const test = new Date(dt.getTime());
    test.setDate(test.getDate() + 1);
    return test.getDate() === 1;
}

function sendAMessage(message) {
    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            return console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            return console.error('Error sending message:', error);
        });
}

function makeANotification(details) {
    let message;

    if (details.body) {
        message = {
            data: {
                title: details.title,
                body: details.body,
                icon: 'https://firebasestorage.googleapis.com/v0/b/poultry101-6b1ed.appspot.com/o/FCMImages%2Fchicken-symbol_318-10389.jpg?alt=media&token=03095d15-af9a-4678-b0c8-9b03d9a1c9cc'
            },
            topic: adminTopic
        }
    } else if (details.message) {
        if (details.name === "Jeff") {
            if (details.receive) {
                message = {
                    data: {
                        title: details.message,
                        body: 'Click to find out more',
                        icon: 'https://firebasestorage.googleapis.com/v0/b/poultry101-6b1ed.appspot.com/o/FCMImages%2Fchicken-symbol_318-10389.jpg?alt=media&token=03095d15-af9a-4678-b0c8-9b03d9a1c9cc'
                    },
                    topic: jeffTopic
                }
            } else if (details.except) {
                message = {
                    data: {
                        title: details.message,
                        body: 'Click to find out more',
                        icon: 'https://firebasestorage.googleapis.com/v0/b/poultry101-6b1ed.appspot.com/o/FCMImages%2Fchicken-symbol_318-10389.jpg?alt=media&token=03095d15-af9a-4678-b0c8-9b03d9a1c9cc'
                    },
                    topic: vpbTopic
                }
            }

        } else if (details.name === "Purity") {

            if (details.receive) {
                message = {
                    data: {
                        title: details.message,
                        body: 'Click to find out more',
                        icon: 'https://firebasestorage.googleapis.com/v0/b/poultry101-6b1ed.appspot.com/o/FCMImages%2Fchicken-symbol_318-10389.jpg?alt=media&token=03095d15-af9a-4678-b0c8-9b03d9a1c9cc'
                    },
                    topic: purityTopic
                }
            } else if (details.except) {
                message = {
                    data: {
                        title: details.message,
                        body: 'Click to find out more',
                        icon: 'https://firebasestorage.googleapis.com/v0/b/poultry101-6b1ed.appspot.com/o/FCMImages%2Fchicken-symbol_318-10389.jpg?alt=media&token=03095d15-af9a-4678-b0c8-9b03d9a1c9cc'
                    },
                    topic: bvjTopic
                }
            } else {
                message = {
                    data: {
                        title: details.message,
                        body: 'Click to find out more',
                        icon: 'https://firebasestorage.googleapis.com/v0/b/poultry101-6b1ed.appspot.com/o/FCMImages%2Fchicken-symbol_318-10389.jpg?alt=media&token=03095d15-af9a-4678-b0c8-9b03d9a1c9cc'
                    },
                    topic: topic
                }
            }

        } else if (details.name === "Victor") {
            if (details.receive) {
                message = {
                    data: {
                        title: details.message,
                        body: 'Click to find out more',
                        icon: 'https://firebasestorage.googleapis.com/v0/b/poultry101-6b1ed.appspot.com/o/FCMImages%2Fchicken-symbol_318-10389.jpg?alt=media&token=03095d15-af9a-4678-b0c8-9b03d9a1c9cc'
                    },
                    topic: victorTopic
                }
            } else if (details.except) {
                message = {
                    data: {
                        title: details.message,
                        body: 'Click to find out more',
                        icon: 'https://firebasestorage.googleapis.com/v0/b/poultry101-6b1ed.appspot.com/o/FCMImages%2Fchicken-symbol_318-10389.jpg?alt=media&token=03095d15-af9a-4678-b0c8-9b03d9a1c9cc'
                    },
                    topic: bpjTopic
                }
            }
        } else if (details.name === "Babra") {
            if (details.receive) {
                message = {
                    data: {
                        title: details.message,
                        body: 'Click to find out more',
                        icon: 'https://firebasestorage.googleapis.com/v0/b/poultry101-6b1ed.appspot.com/o/FCMImages%2Fchicken-symbol_318-10389.jpg?alt=media&token=03095d15-af9a-4678-b0c8-9b03d9a1c9cc'
                    },
                    topic: babraTopic
                }
            } else if (details.except) {
                message = {
                    data: {
                        title: details.message,
                        body: 'Click to find out more',
                        icon: 'https://firebasestorage.googleapis.com/v0/b/poultry101-6b1ed.appspot.com/o/FCMImages%2Fchicken-symbol_318-10389.jpg?alt=media&token=03095d15-af9a-4678-b0c8-9b03d9a1c9cc'
                    },
                    topic: vpjTopic
                }
            }
        }
    } else {
        message = {
            data: {
                title: details,
                body: 'Click to find out more',
                icon: 'https://firebasestorage.googleapis.com/v0/b/poultry101-6b1ed.appspot.com/o/FCMImages%2Fchicken-symbol_318-10389.jpg?alt=media&token=03095d15-af9a-4678-b0c8-9b03d9a1c9cc'
            },
            topic: adminTopic
        }
    }
    return sendAMessage(message);
}

const createNotification = (notification => {
    return admin.firestore().collection('notifications')
        .add(notification)
        .then(doc => console.log('notification added', doc));
});

function batchSalesWrite(profitDocRef, amount, saleDocRef, buyDocRef, batch, time) {
    if (time === 'Monthly') {
        batch.set(profitDocRef, {
            profit: amount,
            time,
            submittedOn: admin.firestore.FieldValue.serverTimestamp()
        });

        batch.update(chickenDocRef, {
            monthProfit: amount,
            submittedOn: admin.firestore.FieldValue.serverTimestamp()
        });

        batch.update(saleDocRef, {
            monthlyTotal: 0
        });

        if (buyDocRef) {
            batch.update(buyDocRef, {
                usedMonth: true,
                monthlySpend: 0
            });
        }
    } else if (time === 'Weekly') {
        batch.set(profitDocRef, {
            profit: amount,
            time: 'Weekly',
            submittedOn: admin.firestore.FieldValue.serverTimestamp()
        });

        batch.update(chickenDocRef, {
            weekProfit: amount,
            submittedOn: admin.firestore.FieldValue.serverTimestamp()
        });

        batch.update(saleDocRef, {
            weeklyTotal: 0
        });

        if (buyDocRef) {
            batch.update(buyDocRef, {
                usedWeek: true,
                weeklySpend: 0
            });
        }
    }
    return null;
}

//queries the most recent sales doc so as to calculate profit
function getLatestSales(buyDoc, profitDocRef, time) {
    return admin.firestore().collection("sales")
        .orderBy("submittedOn", "desc").limit(1).get()
        .then((query) => {
            query.forEach((saleDoc) => {
                if (saleDoc.exists) {
                    const saleDocRef = admin.firestore().collection("sales").doc(saleDoc.id);
                    const buyDocRef = admin.firestore().collection("buys").doc(buyDoc.id);
                    const batch = admin.firestore().batch();
                    const sales = saleDoc.data();
                    const buys = buyDoc.data();

                    if (time === 'Monthly') {
                        const used = buyDoc.data().usedMonth;
                        const monthlySales = parseInt(sales.monthlyTotal);

                        if (used) {
                            const details = `We made Ksh.${numeral(monthlySales).format("0,0")} last month!`;

                            batchSalesWrite(profitDocRef, monthlySales, saleDocRef, false, batch, time);
                            makeANotification(details);
                        } else {
                            const monthlySpend = parseInt(buys.monthlySpend);
                            const final = monthlySales - monthlySpend;

                            if (final < 0) {
                                const newFinal = final * -1;
                                const details = {
                                    title: `We made a loss last month of Ksh.${numeral(newFinal).format("0,0")}!`,
                                    body: 'Click to do some reviewing'
                                };
                                makeANotification(details);
                            } else if (final > 0) {
                                const details = `We made Ksh.${numeral(final).format("0,0")} last month!`;
                                makeANotification(details);
                            }
                            batchSalesWrite(profitDocRef, final, saleDocRef, buyDocRef, batch, time);
                        }
                    } else if (time === 'Weekly') {
                        const used = buyDoc.data().usedWeek;
                        const weeklySales = parseInt(sales.weeklyTotal);

                        if (used) {
                            const details = `We made Ksh.${numeral(weeklySales).format("0,0")} this week!`;

                            batchSalesWrite(profitDocRef, weeklySales, saleDocRef, false, batch, time)
                            makeANotification(details);
                        } else {
                            const weeklySpend = parseInt(buys.weeklySpend);
                            const final = weeklySales - weeklySpend;

                            if (final < 0) {
                                const newFinal = final * -1;
                                const details = {
                                    title: `We made a loss this week of Ksh.${numeral(newFinal).format("0,0")}!`,
                                    body: 'Click to do some reviewing'
                                };
                                makeANotification(details);
                            } else if (final > 0) {
                                const details = `We made Ksh.${numeral(final).format("0,0")} this week!`;
                                makeANotification(details);
                            }
                            batchSalesWrite(profitDocRef, final, saleDocRef, buyDocRef, batch, time);
                        }
                    } else {
                        return null;
                    }
                    batch.commit();

                }
                return null;
            })
            return null;
        });
}

function unsubscribeFromTopics(token, userName) {
    function unsubscribe(token, topic) {
        return admin.messaging().unsubscribeFromTopic(token, topic).then((response) => {
            return console.log('Successfully unsubscribed from topic: ', response);
        }).catch(err => {
            return console.error("error occurred unsubscribing, ", err)
        });

    }

    function adminSubscription() {
        return unsubscribe(token, adminTopic);
    }

    function repeatedJeffVictorSubscriptions() {
        unsubscribe(token, bvjTopic);

        unsubscribe(token, vpjTopic);

        return null;
    }

    function repeatedPurityBabraSubscriptions() {
        unsubscribe(token, vpbTopic);

        unsubscribe(token, bpjTopic);
    }

    //subscribe everyone to all users topic
    unsubscribe(token, topic);

    if (userName === "Purity Mukomaua") {
        unsubscribe(token, vpjTopic);

        unsubscribe(token, purityTopic);

        return repeatedPurityBabraSubscriptions();

    } else if (userName === "Jeff Karue") {
        unsubscribe(token, bpjTopic);

        unsubscribe(token, jeffTopic);

        repeatedJeffVictorSubscriptions();

        return adminSubscription();

    } else if (userName === "Victor Kingi") {
        unsubscribe(token, vpbTopic);

        unsubscribe(token, victorTopic);

        repeatedJeffVictorSubscriptions();
        return adminSubscription();

    } else if (userName === "Babra Kingi") {
        unsubscribe(token, bvjTopic);

        unsubscribe(token, babraTopic);

        repeatedPurityBabraSubscriptions();
        return adminSubscription();

    } else {
        return null;
    }

}

function subscribeToTopics(token, userName) {
    function subscribe(token, topic) {
        return admin.messaging().subscribeToTopic(token, topic).then((response) => {
            return console.log('Successfully subscribed to topic: ', response);
        }).catch(err => {
            return console.error("error occurred, ", err)
        });

    }

    function adminSubscription() {
        return subscribe(token, adminTopic);
    }

    function repeatedJeffVictorSubscriptions() {
        subscribe(token, bvjTopic);

        subscribe(token, vpjTopic);

        return null;
    }

    function repeatedPurityBabraSubscriptions() {
        subscribe(token, vpbTopic);

        subscribe(token, bpjTopic);
    }

    //subscribe everyone to all users topic
    subscribe(token, topic);

    if (userName === "Purity Mukomaua") {
        subscribe(token, vpjTopic);

        subscribe(token, purityTopic);

        return repeatedPurityBabraSubscriptions();

    } else if (userName === "Jeff Karue") {
        subscribe(token, bpjTopic);

        subscribe(token, jeffTopic);

        repeatedJeffVictorSubscriptions();

        return adminSubscription();

    } else if (userName === "Victor Kingi") {
        subscribe(token, vpbTopic);

        subscribe(token, victorTopic);

        repeatedJeffVictorSubscriptions();
        return adminSubscription();

    } else if (userName === "Babra Kingi") {
        subscribe(token, bvjTopic);

        subscribe(token, babraTopic);

        repeatedPurityBabraSubscriptions();
        return adminSubscription();

    } else {
        return null;
    }

}

/*
    query all tokens and if one is equal, delete the new created document
    also subscribe new token to topic
 */
exports.checkForNewFCMTokens = functions.firestore.document('notifyToken/{docId}/tokens/{tokenId}')
    .onCreate(((snap, context) => {
        const batch = admin.firestore().batch();
        const countDocRef = admin.firestore().collection('notifyToken')
            .doc(context.params.docId).collection('tokens').doc('count');

        batch.update(countDocRef, {
            total: admin.firestore.FieldValue.increment(1),
            submittedOn: admin.firestore.FieldValue.serverTimestamp()
        });

        subscribeToTopics(snap.data().token, context.params.docId);

        return batch.commit();
    }))

exports.unsubscribeOnDelete = functions.firestore.document('notifyToken/{docId}/tokens/{tokenId}')
    .onDelete(((snap, context) => {
        const batch = admin.firestore().batch();
        const countDocRef = admin.firestore().collection('notifyToken')
            .doc(context.params.docId).collection('tokens').doc('count');

        batch.update(countDocRef, {
            total: admin.firestore.FieldValue.increment(-1),
            submittedOn: admin.firestore.FieldValue.serverTimestamp()
        });

        unsubscribeFromTopics(snap.data().token, context.params.docId);

        return batch.commit();
    }))

exports.monthlyProfit = functions.pubsub.schedule('1 of month 01:00').onRun((context => {
    const profitDocRef = admin.firestore().collection("profit").doc(`Monthly Month ${currentMonth} Date ${current}`);
    admin.firestore().collection('otherDebt').doc('TotalThikaFarmers')
        .get().then((doc) => {
        if (doc.exists) {
            const data = parseInt(doc.data().total);
            const details = `Our monthly Thika Farmers debt is Ksh.${numeral(data).format("0,0")}.`
            return makeANotification(details);
        }
        return null;
    }).catch((err) => {
        return console.error("monthly profit error: ", err)
    });

    return admin.firestore().collection("buys").orderBy("submittedOn", "desc")
        .limit(1).get()
        .then((query) => {
            query.forEach((buyDoc) => {
                if (buyDoc.exists) {
                    getLatestSales(buyDoc, profitDocRef, 'Monthly');
                }
                return null;
            })
            return null;
        }).catch((err) => {
            return console.error("error with profit, ", err)
        });
}));

exports.weeklyProfit = functions.pubsub.schedule('every sunday 01:00').onRun((context => {
    const profitDocRef = admin.firestore().collection("profit").doc(`Weekly Month ${currentMonth} Date ${current}`);

    return admin.firestore().collection("buys").orderBy("submittedOn", "desc")
        .limit(1).get()
        .then((query) => {
            query.forEach((buyDoc) => {
                if (buyDoc.exists) {
                    getLatestSales(buyDoc, profitDocRef, 'Weekly');
                }
                return null;
            })
            return null;
        }).catch((err) => {
            return console.error("error with profit, ", err)
        });
}));

exports.updateBags = functions.pubsub.schedule('every 24 hours from 01:00 to 01:30').onRun((context => {
    const bagRef = admin.firestore().collection("bags").doc("CurrentBags");

    return admin.firestore().runTransaction((transaction => {
        return transaction.get(bagRef).then((bagDoc) => {
            if (bagDoc.exists) {
                let bagNum = parseInt(bagDoc.data().number);

                if (bagNum === 0) {
                    return null;
                } else {
                    let counter = bagDoc.data().counter.toDate();
                    let newCounter = bagDoc.data().counter.toDate();
                    let count = parseInt(counter.getDate());

                    if (count < current && !isLastDay(counter)) {
                        count = current - count;
                        bagNum = bagNum - count;
                        newCounter = new Date(year, currentMonth - 1, current, getHour, getMinute, getSecond);
                    }
                    counter.setDate(counter.getDate() + 1);
                    if (counter.getDate() === 1) {
                        count = current;
                        bagNum = bagNum - count;
                        newCounter = new Date(year, currentMonth - 1, current, getHour, getMinute, getSecond);

                    }
                    if (bagNum < 0) {
                        bagNum = 0;
                    }

                    transaction.update(bagRef, {
                        number: bagNum,
                        counter: newCounter,
                        submittedOn: admin.firestore.FieldValue.serverTimestamp()
                    });
                    return null;
                }
            }
            return null;
        })
    })).then(() => {
        return console.log("bags updated")
    })
        .catch((err) => {
            return console.error("Error at bags, ", err)
        });
}))

exports.updateBirdAge = functions.pubsub.schedule('every monday 04:00').onRun((context => {
    const startDate = new Date(2020, 2, 9, 12, 32, 45, 67);
    const batch = admin.firestore().batch();

    function weeksBetween(d1, d2) {
        return Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000));
    }

    const weeks = weeksBetween(startDate, date);
    const months = weeks / 4;

    batch.update(chickenDocRef, {
        monthNo: months,
        weekNo: weeks
    });

    batch.commit().then(() => {
        return console.log("chicken age updated")
    })
        .catch((err) => {
            return console.error("chicken age error, ", err)
        });
}))

exports.checkLayingPercentage = functions.firestore.document('chickenDetails/2020')
    .onWrite(((change, context) => {
        const prevData = change.before.data();
        const newData = change.after.data();
        const prevCage = parseInt(prevData.weekCagePercent);
        const prevHouse = parseInt(prevData.weekHousePercent);
        const newCage = parseInt(newData.weekCagePercent);
        const newHouse = parseInt(newData.weekHousePercent);
        let cageDif = newCage - prevCage;
        let houseDif = newHouse - prevHouse;

        if (cageDif < 0) {
            cageDif = cageDif * -1;
            const rounded = Math.round((cageDif + Number.EPSILON) * 100) / 100;
            const details = `Cage Laying Percentage decreased by ${rounded}% this week`;
            makeANotification(details);
        } else if (cageDif > 0) {
            const rounded = Math.round((cageDif + Number.EPSILON) * 100) / 100;
            const details = `Cage Laying Percentage increased by ${rounded}% this week`;
            makeANotification(details);
        }

        if (houseDif < 0) {
            houseDif = houseDif * -1;
            const rounded = Math.round((houseDif + Number.EPSILON) * 100) / 100;
            const details = `House Laying Percentage decreased by ${rounded}% this week`;
            makeANotification(details);
        } else if (houseDif > 0) {
            const rounded = Math.round((houseDif + Number.EPSILON) * 100) / 100;
            const details = `House Laying Percentage increased by ${rounded}% this week`;
            makeANotification(details);
        }

        return null;
    }))

exports.whatToNotify = functions.firestore.document('userLogs/{userId}/logs/{logId}').onCreate(
    (snap, context) => {
        const data = snap.data();
        const event = data.event || null;
        const halfEvent = event.substring(0, 4);
        const _halfEvent = event.indexOf("borrowed");
        const borrow_name = event.substr(0, event.indexOf(" b"));
        const amount = parseInt(data.amount);
        const name = data.submittedBy;
        const firstName = name.substring(0, event.lastIndexOf(" "));

        if (halfEvent === "sent") {
            const receive = data.receiver.substring(0, data.receiver.lastIndexOf(" "));

            const details = {
                message: `You Have Received Ksh.${numeral(amount).format("0,0")} from ${firstName}`,
                name: receive,
                receive: 'receive'
            }

            return makeANotification(details);
        } else if (_halfEvent !== -1) {
            const details = `${borrow_name} borrowed Ksh.${numeral(amount).format("0,0")} from ${firstName}`;

            return makeANotification(details);
        } else {
            return null;
        }
    }
)

exports.monthlyDebt = functions.pubsub.schedule('1 of month 01:00').onRun((context => {
    const jeffDocRef = admin.firestore().collection('current').doc('Jeff Karue');

    admin.firestore().runTransaction((transaction => {
        return transaction.get(jeffDocRef).then((jeffDoc) => {
            if (jeffDoc.exists) {
                const data = jeffDoc.data();
                const amount = parseInt(data.balance);
                const details = {
                    message: `Your monthly debt is Ksh.${amount}`,
                    receive: 'debt',
                    name: 'Jeff'
                }
                return makeANotification(details);

            } else {
                return null;
            }
        });

    })).then(() => {
        return console.log("jeff has gotten his monthly debt");
    }).catch((err) => {
        return console.error("Error jeff monthly debt, ", err);
    });
    return null;
}))

exports.bags = functions.firestore.document('bags/CurrentBags').onWrite(
    ((change, context) => {
        const data = change.after.data();
        const num = parseInt(data.number);

        if (num === 0) {
            const details = {
                message: `No Bags of feeds in store!`,
                name: 'Purity'
            }
            return makeANotification(details);
        } else if (num <= 3) {
            const details = {
                message: `Feeds in Store are less than 3!`,
                name: 'Purity'
            }
            return makeANotification(details);
        } else {
            return null;
        }

    })
)

exports.deadSick = functions.firestore.document('deadSick/{deadsickId}').onCreate(
    ((snap, context) => {
        const ds = snap.data();
        const name = ds.submittedBy;
        const section = ds.section;
        const num = parseInt(ds.chickenNo);
        let notification;
        let details;

        if (section === "Dead") {
            if (num === 1) {
                notification = {
                    content: '1 Chicken Died!',
                    user: `${name}`,
                    time: admin.firestore.FieldValue.serverTimestamp()
                }
                details = `A chicken died`;
            } else {
                notification = {
                    content: 'Some Chickens Died!',
                    user: `${name}`,
                    time: admin.firestore.FieldValue.serverTimestamp()
                }
                details = `Some chickens died`;
            }
        } else if (section === "Sick") {
            if (num === 1) {
                notification = {
                    content: '1 Chicken is sick!',
                    user: `${name}`,
                    time: admin.firestore.FieldValue.serverTimestamp()
                }
                details = `A chicken is sick!`;
            } else {
                notification = {
                    content: 'Some Chickens are sick!',
                    user: `${name}`,
                    time: admin.firestore.FieldValue.serverTimestamp()
                }
                details = `Some chickens are sick!`;
            }
        }
        createNotification(notification).catch((err) => {
            return console.log(err);
        });

        return makeANotification(details);
    })
)

exports.trays = functions.firestore.document('trays/CurrentTrays').onWrite(
    ((change, context) => {
        const data = change.after.data();
        const num = parseInt(data.number);
        const time = data.submittedOn.toDate();
        const newHour = time.getHours();

        if (newHour === getHour && time.getDate() === current && time.getMonth() === currentMonth - 1
            && year === time.getFullYear()) {
            return null;
        }

        if (num <= 10) {
            const details = {
                message: `Less than 10 trays in store!`,
                name: 'Purity'
            }
            return makeANotification(details);
        } else if (num > 70) {
            const details = {
                message: `More than 70 trays in store!`,
                name: 'Purity'
            }
            return makeANotification(details);
        } else {
            return null;
        }
    })
)

exports.buysMade = functions.firestore.document('buys/{buyId}')
    .onCreate((snap, context) => {
        const buy = snap.data();
        const name = buy.submittedBy;
        const firstName = name.substring(0, name.lastIndexOf(" "));
        const item = buy.itemName || buy.vaccineName || buy.drugName || buy.labourName || buy.section;
        const notification = {
            content: 'Made a purchase!',
            user: `${buy.submittedBy}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        }
        createNotification(notification).catch((err) => {
            return console.log(err);
        });

        const details = {
            message: `${firstName} bought ${buy.objectNo} ${item}!`,
            name: firstName,
            except: true
        };

        return makeANotification(details);

    });

exports.salesMade = functions.firestore.document('sales/{saleId}')
    .onCreate((snap, context) => {
        const sale = snap.data();
        const name = sale.submittedBy;
        const firstName = name.substring(0, name.lastIndexOf(" "));

        let details;
        const notification = {
            content: 'Made a sale!',
            user: `${sale.submittedBy}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        }
        createNotification(notification).then(() => console.log("notification made")).catch((err) => {
            console.error(err)
        });
        if (sale.trayNo) {
            if (parseInt(sale.trayNo) === 1) {
                details = {
                    message: `${firstName} sold ${sale.trayNo} tray!`,
                    name: firstName,
                    except: true
                }
            } else {
                details = {
                    message: `${firstName} sold ${sale.trayNo} trays!`,
                    name: firstName,
                    except: true
                }
            }
        } else if (sale.chickenNo) {
            if (parseInt(sale.chickenNo) === 1) {
                details = {
                    message: `${firstName} sold ${sale.chickenNo} chicken!`,
                    name: firstName,
                    except: true
                }
            } else {
                details = {
                    message: `${firstName} sold ${sale.chickenNo} chickens!`,
                    name: firstName,
                    except: true
                }
            }
        }

        return makeANotification(details);

    });

exports.latestNews = functions.firestore.document('latestNews/{newsId}')
    .onWrite((change, context) => {
        const news = change.after.data();
        const title = news.title;
        const provider = news.provider;
        const notification = {
            content: `Latest poultry news update!`,
            user: `${provider}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        }
        createNotification(notification).then(() => console.log("notification made")).catch((err) => {
            console.error(err)
        });

        const details = {
            title: `Latest Poultry News from ${provider}`,
            body: title
        }

        return makeANotification(details);

    });

exports.balance = functions.firestore.document('current/{currentId}')
    .onUpdate((change, context) => {
        const current = change.after.data();
        return {
            content: 'Current Balance: ' + current.totalEarned,
            user: `${current.submittedBy}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        };
    });

exports.eggsCollected = functions.firestore.document('eggs/{eggId}')
    .onCreate(doc => {
        const egg = doc.data();
        const dateString = egg.date;
        const newDate = new Date(dateString);
        doc.ref.update({
            date: newDate
        }).then(() => {
            return console.log("date ok")
        })
            .catch((err) => {
                return console.error("date error, ", err)
            });
        const notification = {
            content: 'Collected Eggs!',
            user: `${egg.submittedBy}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        }
        return createNotification(notification);
    });

/*exports.userJoined = functions.auth.user().onCreate(user => {

    admin.auth().setCustomUserClaims(user.uid, {moderator: true}).then(() => console.log("user now admin"))
        .catch((err) => {
            console.log("error: ", err.message);
        })

    return admin.firestore().collection('users').doc(user.uid).get().then(
        doc => {
            const newUser = doc.data();
            const notification = {
                content: 'Joined the party',
                user: `${ newUser.firstName } ${ newUser.lastName }`,
                time: admin.firestore.FieldValue.serverTimestamp()
            }
            return createNotification(notification);
        }
    )
}); */
