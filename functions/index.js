const admin = require('firebase-admin');
admin.initializeApp();

const handleFCM = require('./src/handleFCM');
const FCMTrigger = require('./src/firestoreTrigger');
const utils = require('./src/utils');
const timed = require('./src/scheduled');

exports.handleFCM = handleFCM;
exports.FCMTrigger = FCMTrigger;
exports.utils = utils;
exports.timed = timed;