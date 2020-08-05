import React, {Component} from 'react';
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
import LatePaymentDetails from "./components/projects/LatePaymentDetails";
import Late from "./components/dashboard/Late";

class App extends Component {

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Navbar/>
                    <Sidebar/>
                    <Switch>
                        <Route exact path='/' component={Dashboard}/>
                        <Route path='/s/:id' component={SalesDetails}/>
                        <Route path='/e/:id' component={EggsDetails}/>
                        <Route path='/b/:id' component={BuyDetails}/>
                        <Route path='/signin' component={SignIn}/>
                        <Route path='/signup' component={SignUp}/>
                        <Route path='/sales' component={Inputsell}/>
                        <Route path='/buy' component={Inputbuy}/>
                        <Route path='/eggs' component={Inputeggs}/>
                        <Route path='/send' component={Inputmoney}/>
                        <Route path='/late' component={Late}/>
                        <Route path='/l/:id' component={LatePaymentDetails}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
