import axios from 'axios';
import * as c from '../constants';

export const changeBuySystem = system => ({
    type: c.CHANGE_BUY_SYSTEM,
    system
});

export const changeSellSystem = system => ({
    type: c.CHANGE_SELL_SYSTEM,
    system
});

export const loadPricesBySystems = systems => dispatch => {
    let promises = [];
    systems.forEach(elem => {
        promises.push(axios.post('/api/getPrices', { systemId: elem.value })
            .then(response => ({ arr: response.data, system: elem.label.toUpperCase() }))
        )
    });

    Promise.all(promises)
        .then(response => {
            dispatch({
                type: c.LOAD_PRICES_BY_SYSTEMS,
                systems: response
            })
        })
        .catch(err => {
            console.error(err.message);
        })
};

export const changeTax = tax => ({
    type: c.CHANGE_TAX,
    tax
});
