# Poultry data keeping web app

## Overview

Demo version available at [poultry farming website demo](https://pdummy.web.app/) and a cool looking [404 page](https://pdummy.web.app/pppgtvt).

The demo doesn't include cloud functions since it is hosted on firebase spark plan. `functions` folder will not be pushed to this repo as of secruity reasons but the cloud functions are:
1. **Pub/Sub scheduled functions**
    
    1. every sunday at 0100hrs CST Time zone, a full backup of the firestore database is done where all collections are exported to an archive.
    1. calculate weekly and monthly profit run every sunday at 0100hrs CST Time zone for weekly profit and 1st of every month for monthly profit.
    1. calculate number of bags of feeds left in the farm every 24hrs and send push notification to farmer if less than 3.
    1. calculate total debt 1st of every month and send push notification to `admin` users.
    
1. **Firestore Triggers**
    1. When a write is made to any document in any collection, a separate document is created called `rollback` which can be triggered from client side to go back to previous          state of document i.e. the undo algorithm.
    1. On submitting a purchase or sale a push notification is sent to every user subscribed to the topic `ADMIN_USERS`
    1. On submitting number of eggs collected, a push notification is sent to farmer if total trays in storage area is alot e.g. more than 100 trays.
    1. On submitting dead / sick chicken, a push notification is sent to all admin users that a chicken is sick and if dead, reduces total chicken count.
    1. Only admin users can send money to bank account and all users can send money to each other, each receiving a push notification e.g."You have received £20 from John".
    1. When a new user signs up, the user first validates himself to admins, if access granted, a custom claim is given where he/she can access a section of the database. Furthermore, user can allow to receive notifications and this will send his FCM registration token to the database where a cloud function will verify the integrity and subscribe him to messaging topics.

This is a react web app for farmers to keep data about there sales, purchases and much more. I used firebase as the backend and I suggest going to [firebase website](https://firebase.google.com/) so as to create an account and try out the app.

N.B:- Basic knowledge of firebase commands and linking your web app to firestore is needed.


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
