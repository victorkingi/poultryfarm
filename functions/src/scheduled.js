const numeral = require('numeral');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const AllTopic = 'ALL_USERS';
const adminTopic = 'ADMIN_USERS';
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

module.exports = {
    makeANotificationToOneUser: function makeANotificationToOneUser(details) {
        return admin.firestore().collection("notifyToken").doc(details.name)
            .collection("tokens").orderBy("submittedOn", "desc")
            .get().then((query) => {
                return query.forEach((doc) => {
                    const data = doc.data();
                    const token = data.token;

                    const myMessage = {
                        data: {
                            title: details.message,
                            body: 'Click to find out more',
                            icon: 'https://firebasestorage.googleapis.com/v0/b/poultry101-6b1ed.appspot.com/o/FCMImages%2Fchicken-symbol_318-10389.jpg?alt=media&token=03095d15-af9a-4678-b0c8-9b03d9a1c9cc'
                        },
                        token
                    }
                    return sendAMessage(myMessage);

                })
            })
    },
    makeANotification: function makeANotification(details) {
        let message;

        //latest news, laying percentage and profit/loss message only admins receive
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
            //if a user makes a sale, purchase everyone gets a notification
            if (details.name) {
                message = {
                    data: {
                        title: details.message,
                        body: 'Click to find out more',
                        icon: 'https://firebasestorage.googleapis.com/v0/b/poultry101-6b1ed.appspot.com/o/FCMImages%2Fchicken-symbol_318-10389.jpg?alt=media&token=03095d15-af9a-4678-b0c8-9b03d9a1c9cc'
                    },
                    topic: AllTopic
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

exports.monthlyProfit = functions.pubsub.schedule('1 of month 01:00').onRun(( () => {
    const profitDocRef = admin.firestore().collection("profit").doc(`Monthly Month ${currentMonth} Date ${current}`);
    admin.firestore().collection('otherDebt').doc('TotalThikaFarmers')
        .get().then((doc) => {
        if (doc.exists) {
            const data = parseInt(doc.data().total);
            const details = {
                title: `Our Monthly Debt is Ksh.${numeral(data).format("0,0")}`,
                body: `Our monthly Thika Farmers debt is Ksh.${numeral(data).format("0,0")}.`
            }
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

exports.monthlyDebt = functions.pubsub.schedule('1 of month 01:00').onRun((() => {
    const jeffDocRef = admin.firestore().collection('current').doc('Jeff Karue');

    admin.firestore().runTransaction((transaction => {
        return transaction.get(jeffDocRef).then((jeffDoc) => {
            if (jeffDoc.exists) {
                const data = jeffDoc.data();
                const amount = parseInt(data.balance);
                const details = {
                    message: `Dear Jeff, your monthly debt is Ksh.${numeral(amount).format("0,0")}`,
                    name: 'Jeff Karue'
                }
                return makeANotificationToOneUser(details);

            }
            return null;
        });

    })).then(() => {
        return console.log("jeff got his monthly debt");
    }).catch((err) => {
        return console.error("Error jeff monthly debt, ", err);
    });
    return null;
}))

exports.weeklyProfit = functions.pubsub.schedule('every sunday 01:00').onRun((  () => {
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

exports.updateBags = functions.pubsub.schedule('every 24 hours from 01:00 to 01:30')
    .onRun((() => {
        const bagRef = admin.firestore().collection("bags").doc("CurrentBags");

        return admin.firestore().runTransaction((transaction => {
            return transaction.get(bagRef).then((bagDoc) => {
                if (bagDoc.exists) {
                    let bagNum = parseInt(bagDoc.data().number);

                    if (bagNum === 0) {
                        const details = {
                            message: `No Bags of feeds in store!`
                        }
                        return makeANotification(details);
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
