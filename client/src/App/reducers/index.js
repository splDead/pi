import { combineReducers } from 'redux';
import dashboard from './dashboard';
import calc from './calc';

export default combineReducers({
    dashboard,
    calc
});
