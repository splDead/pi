import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './App/reducers';

import './index.css';
import App from './App/App';

const middleware = [ thunk ];

const store = createStore(
    reducer,
    applyMiddleware(...middleware)
);

render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('root'));