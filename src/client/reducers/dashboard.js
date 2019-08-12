import * as c from '../constants';

import t1 from '../resources/pi-t1-id.json';
import t2 from '../resources/pi-t2-id.json';
import t3 from '../resources/pi-t3-id.json';
import t4 from '../resources/pi-t4-id.json';

let typeIds = `${t1.map(el => el.value).join()},${t2.map(el => el.value).join()},${t3.map(el => el.value).join()},${t4.map(el => el.value).join()}`;
let url = `https://api.evemarketer.com/ec/marketstat/json?typeid=${typeIds}`;

const initialState = {
    prices: [],
    system: '',
    baseUrl: url
};

const dashboard = (state = initialState, action) => {
    switch (action.type) {
        case c.CHANGE_SYSTEM_ID:
            return {
                ...state,
                system: action.id
            };
        case c.LOAD_PRICES:
            return {
                ...state,
                prices: action.prices
            };
        default:
            return state;
    }
};

export default dashboard;
