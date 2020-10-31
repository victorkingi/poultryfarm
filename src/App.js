import React, {useEffect} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import './App.css';
import SignIn from "./scenes/Sign/scenes/SignIn/SignIn";
import SalesDetails from "./scenes/Sales/components/details/SalesDetails";
import EggsDetails from "./scenes/Eggs Collected/components/details/EggsDetails";
import SickDeadDetails from "./scenes/Sick And Dead/components/details/SickDeadDetails";
import BuyDetails from "./scenes/Purchases/components/details/BuyDetails";
import SignUp from "./scenes/Sign/scenes/SignUp/SignUp";
import OtherDebts from "./scenes/Debts/components/main/OtherDebts";
import Sale from "./scenes/Sales/components/main/Sale";
import Late from "./scenes/Late Payments/components/main/Late";
import SickDead from "./scenes/Sick And Dead/components/main/SickDead";
import Buy from "./scenes/Purchases/components/main/Buy";
import Egg from "./scenes/Eggs Collected/components/main/Egg";
import Borrow from "./scenes/Funds Borrowed/components/main/Borrow";
import Dashboard from "./scenes/Home/components/main/Dashboard";
import NotFound from "./scenes/404/components/not found/NotFound";
import Navbar from "./components/bars/components/navbar/Navbar";
import Sidebar from "./components/bars/components/sidebar/Sidebar";
import {toast, ToastContainer} from "react-toastify";
import InputDeadSick from "./scenes/Input Pages/scenes/Chicken Died And Sick/components/InputDeadSick";
import Inputsell from "./scenes/Input Pages/scenes/Sales/components/Inputsell";
import InputNews from "./scenes/Input Pages/scenes/News/components/InputNews";
import Inputbuy from "./scenes/Input Pages/scenes/Purchases/components/Inputbuy";
import Inputeggs from "./scenes/Input Pages/scenes/Collecting Eggs/components/Inputeggs";
import Inputmoney from "./scenes/Input Pages/scenes/Sending Money/components/Inputmoney";
import AllCharts from "./scenes/Charts/components/main/AllCharts";
import InputBorrow from "./scenes/Input Pages/scenes/Borrowing Funds/components/InputBorrow";

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
    componentDidMount();
  }, []);

  return (
      <BrowserRouter>
        <div>
          <Navbar/>
          <Sidebar/>
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
          <Switch>
            <Route path='/s/:id' component={SalesDetails}/>
            <Route path='/sd/:id' component={SickDeadDetails}/>
            <Route path='/e/:id' component={EggsDetails}/>
            <Route path='/b/:id' component={BuyDetails}/>
            <Route path='/signin' component={SignIn}/>
            <Route path='/signup' component={SignUp}/>
            <Route path='/sales' component={Inputsell}/>
            <Route path='/news' component={InputNews}/>
            <Route path='/buy' component={Inputbuy}/>
            <Route path='/eggs' component={Inputeggs}/>
            <Route path='/send' component={Inputmoney}/>
            <Route path='/d' component={InputDeadSick}/>
            <Route path='/l' component={Late}/>
            <Route path='/o' component={OtherDebts}/>
            <Route path='/s' component={Sale}/>
            <Route path='/sd' component={SickDead}/>
            <Route path='/b' component={Buy}/>
            <Route path='/e' component={Egg}/>
            <Route path='/chart' component={AllCharts}/>
            <Route path='/rb' component={Borrow}/>
            <Route path='/ib' component={InputBorrow}/>
            <Route exact path='/' component={Dashboard}/>
            <Route path="*" component={NotFound} status={404}/>
          </Switch>
        </div>
      </BrowserRouter>
  );
}

export default App;
