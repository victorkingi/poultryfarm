import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import Dashboard from "./components/dashboard/Dashboard";
import SalesDetails from "./components/projects/SalesDetails";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Inputsell from "./components/projects/Inputsell";
import Inputeggs from "./components/projects/Inputeggs";
import Inputbuy from "./components/projects/Inputbuy";
import EggsDetails from "./components/projects/EggsDetails";
import BuyDetails from "./components/projects/BuyDetails";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Inputmoney from "./components/projects/Inputmoney";
import Late from "./components/dashboard/Late";
import Sale from "./components/dashboard/Sale";
import Buy from "./components/dashboard/Buy";
import Egg from "./components/dashboard/Egg";
import LineChart from "./components/dashboard/LineChart";
import Borrow from "./components/dashboard/Borrow";
import InputBorrow from "./components/projects/InputBorrow";
import OtherDebts from "./components/dashboard/OtherDebts";
import SickDead from "./components/dashboard/SickDead";
import InputDeadSick from "./components/projects/InputDeadSick";
import SickDeadDetails from "./components/projects/SickDeadDetails";
import InputNews from "./components/projects/InputNews";
import {setPerformanceEnd, setPerformanceStart} from "./store/actions/moneyAction";

setPerformanceStart();

const App = () => {
    return (
        <BrowserRouter>
            <div className="App">
                <Navbar/>
                <Sidebar/>
                <Switch>
                    <Route exact path='/' component={Dashboard}/>
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
                    <Route path='/chart' component={LineChart}/>
                    <Route path='/rb' component={Borrow}/>
                    <Route path='/ib' component={InputBorrow}/>
                </Switch>
            </div>
        </BrowserRouter>
    );
}

setPerformanceEnd('APP_TIME');

export default App;
