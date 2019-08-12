import * as c from '../constants';

const initialState = {
    prices: [],
    ids: '',
    system: ''
};

const dashboard = (state = initialState, action) => {
    switch (action.type) {
        case c.CHANGE_TYPE_ID:
            return {
                ...state,
                ids: action.ids
            };
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
