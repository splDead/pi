import * as c from '../constants';

const initialState = {
    prices: {
        BUY: [],
        SELL: []
    },
    buySystemId: {
        "label": "Jita",
        "value": 30000142
    },
    sellSystemId: {
        "label": "Jita",
        "value": 30000142
    },
    tax: '',
};

const calc = (state = initialState, action) => {
    switch (action.type) {
        case c.CHANGE_BUY_SYSTEM_ID:
            return {
                ...state,
                buySystemId: action.id
            };
        case c.CHANGE_SELL_SYSTEM_ID:
            return {
                ...state,
                sellSystemId: action.id
            };
        case c.LOAD_PRICES:
            return {
                ...state,
                prices: {
                    ...state.prices,
                    [action.priceType]: action.prices
                }
            };
        case c.CHANGE_TAX:
            return {
                ...state,
                tax: action.tax
            };
        default:
            return state;
    }
};

export default calc;
