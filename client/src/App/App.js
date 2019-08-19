import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import CalcPage from './pages/CalcPage';

class App extends Component {
    render() {
        return (
            <div className='layout'>
                <Router>
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route path='/calc' component={CalcPage}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;