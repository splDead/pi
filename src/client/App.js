import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CalcPage from './components/CalcPage';
import MainMenu from './components/MainMenu';

import './app.css';

export default class App extends Component {
    render() {
        return (
            <div className='layout'>
                <MainMenu />
                <Router>
                    <Switch>
                        <Route exact path='/' component={Dashboard}/>
                        <Route path='/calc' component={CalcPage} />
                    </Switch>
                </Router>
            </div>
        );
    }
}
