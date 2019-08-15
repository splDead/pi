import * as c from '../constants';

const initialState = {
    prices: [],
    system: '',
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
