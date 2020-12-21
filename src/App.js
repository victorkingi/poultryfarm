import React, {useEffect} from 'react';
import {toast, ToastContainer} from "react-toastify";
import MyRoute from "./routes/components/MyRoute";
import {messaging} from "./services/api/firebase configurations/fbConfig";
import './App.css';

function componentDidMount() {
  navigator.serviceWorker.addEventListener("message", (message) => {
    const customId = "myToast";
    if (message?.data) {
      const _data = `${message.data['firebase-messaging-msg-data'].data?.title}`;
      const _notification = `${message.data['firebase-messaging-msg-data']
          .notification?.title}: ${message.data['firebase-messaging-msg-data']
          .notification?.body}`;

      if (_data === 'undefined') {
        toast.info(_notification, {
          toastId: customId,
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.info(_data, {
          toastId: customId,
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }

  });
}

function App() {

  useEffect(() => {
    if (messaging !== null) {
      componentDidMount();
    }
  }, []);

  return (
      <div>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
        <MyRoute />
      </div>
  );
}

export default App;
