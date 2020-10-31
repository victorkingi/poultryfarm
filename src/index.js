import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {applyMiddleware, compose, createStore} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {createFirestoreInstance, getFirestore, reduxFirestore} from 'redux-firestore';
import {getFirebase, ReactReduxFirebaseProvider} from 'react-redux-firebase';
import firebase from 'firebase/app';
import rootReducer from "./services/reducers/rootReducer";
import {myFirebase} from "./services/api/firebase configurations/fbConfig";

const store = createStore(rootReducer,
    compose(
        applyMiddleware(thunk.withExtraArgument({getFirebase, getFirestore})),
        reduxFirestore(myFirebase)
    )
);

const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true
}
const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance,

}

ReactDOM.render(
    <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
            <App/>
        </ReactReduxFirebaseProvider>
    </Provider>,
    document.getElementById('root'));

serviceWorker.unregister();

