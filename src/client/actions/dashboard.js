import axios from 'axios';
import * as c from '../constants';

export const changeSystemId = id => ({
    type: c.CHANGE_SYSTEM_ID,
    id
});

export const loadPrices = (systemId = '') => dispatch => {
    axios.post('/api/getPrices', { systemId })
        .then(response => {
            dispatch({
                type: c.LOAD_PRICES,
                prices: response.data
            });
        });
};
