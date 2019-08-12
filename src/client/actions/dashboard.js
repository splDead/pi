import axios from 'axios';
import * as c from '../constants';

export const changeSystemId = id => ({
    type: c.CHANGE_SYSTEM_ID,
    id
});

export const loadPrices = url => dispatch => {
    axios.post(url)
        .then(response => {
            dispatch({
                type: c.LOAD_PRICES,
                prices: response.data
            });
        });
};
