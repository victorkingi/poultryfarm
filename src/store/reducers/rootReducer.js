import authReducer from "./authReducer";
import salesReducer from "./salesReducer";
import eggsReducer from "./eggsReducer";
import {combineReducers} from "redux";
import {firestoreReducer} from "redux-firestore";
import {firebaseReducer} from "react-redux-firebase";
import buyReducer from "./buyReducer";
import moneyReducer from "./moneyReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    sales: salesReducer,
    eggs: eggsReducer,
    buy: buyReducer,
    money: moneyReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer
});

export default rootReducer


