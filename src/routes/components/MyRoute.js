import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import SignIn from "../../scenes/Sign/scenes/SignIn/SignIn";
import SalesDetails from "../../scenes/Sales/components/details/SalesDetails";
import EggsDetails from "../../scenes/Eggs Collected/components/details/EggsDetails";
import SickDeadDetails from "../../scenes/Sick And Dead/components/details/SickDeadDetails";
import BuyDetails from "../../scenes/Purchases/components/details/BuyDetails";
import SignUp from "../../scenes/Sign/scenes/SignUp/SignUp";
import OtherDebts from "../../scenes/Debts/components/main/OtherDebts";
import Sale from "../../scenes/Sales/components/main/Sale";
import Late from "../../scenes/Late Payments/components/main/Late";
import SickDead from "../../scenes/Sick And Dead/components/main/SickDead";
import Buy from "../../scenes/Purchases/components/main/Buy";
import Egg from "../../scenes/Eggs Collected/components/main/Egg";
import Dashboard from "../../scenes/Home/components/main/Dashboard";
import NotFound from "../../scenes/404/components/not found/NotFound";
import Navbar from "../../components/bars/components/navbar/Navbar";
import Sidebar from "../../components/bars/components/sidebar/Sidebar";
import InputDeadSick from "../../scenes/Input Pages/scenes/Chicken Died And Sick/components/InputDeadSick";
import Inputsell from "../../scenes/Input Pages/scenes/Sales/components/Inputsell";
import Inputbuy from "../../scenes/Input Pages/scenes/Purchases/components/Inputbuy";
import Inputeggs from "../../scenes/Input Pages/scenes/Collecting Eggs/components/Inputeggs";
import Inputmoney from "../../scenes/Input Pages/scenes/Sending Money/components/Inputmoney";
import AllCharts from "../../scenes/Charts/components/main/AllCharts";
import Roll from "../../scenes/Rollback/components/main/Roll";
import AnneSends from "../../scenes/Input Pages/scenes/Sending Money/components/AnneSends";
import AnneDebt from "../../scenes/Anne Debt/components/AnneDebt";

function MyRoute() {

    return (
        <BrowserRouter>
            <Navbar/>
            <Sidebar/>
            <Switch>
                <Route path='/s/:id' component={SalesDetails}/>
                <Route path='/sd/:id' component={SickDeadDetails}/>
                <Route path='/e/:id' component={EggsDetails}/>
                <Route path='/b/:id' component={BuyDetails}/>
                <Route path='/signin' component={SignIn}/>
                <Route path='/signup' component={SignUp}/>
                <Route path='/sales' component={Inputsell}/>
                <Route path='/buy' component={Inputbuy}/>
                <Route path='/eggs' component={Inputeggs}/>
                <Route path='/send' component={Inputmoney}/>
                <Route path='/asend' component={AnneSends}/>
                <Route path='/adebt' component={AnneDebt}/>
                <Route path='/d' component={InputDeadSick}/>
                <Route path='/roll' component={Roll}/>
                <Route path='/l' component={Late}/>
                <Route path='/o' component={OtherDebts}/>
                <Route path='/s' component={Sale}/>
                <Route path='/sd' component={SickDead}/>
                <Route path='/b' component={Buy}/>
                <Route path='/e' component={Egg}/>
                <Route path='/chart' component={AllCharts}/>
                <Route exact path='/' component={Dashboard}/>
                <Route path="*" component={NotFound} status={404}/>
            </Switch>
        </BrowserRouter>
    );
}

export default MyRoute;
