import axios from 'axios';
import * as c from '../constants';

export const changeBuySystemId = id => ({
    type: c.CHANGE_BUY_SYSTEM_ID,
    id
});

export const changeSellSystemId = id => ({
    type: c.CHANGE_SELL_SYSTEM_ID,
    id
});

export const loadPrices = (type, systemId = '') => dispatch => {
    axios.post('/api/getPrices', { systemId })
        .then(response => {
            dispatch({
                type: c.LOAD_PRICES,
                prices: response.data,
                priceType: type
            });
        });
};

export const changeTax = tax => ({
    type: c.CHANGE_TAX,
    tax
});
