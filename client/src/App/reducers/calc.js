import * as c from '../constants';

const initialState = {
    prices: {
        BUY: [],
        SELL: []
    },
    buySystem: {
        "label": "Jita",
        "value": 30000142
    },
    sellSystem: {
        "label": "Jita",
        "value": 30000142
    },
    tax: 20,
    pricesBySystem: {
        AMARR: [],
        JITA: [],
        DODIXIE: [],
        PERIMETER: []
    }
};

const calc = (state = initialState, action) => {
    switch (action.type) {
        case c.CHANGE_BUY_SYSTEM:
            return {
                ...state,
                buySystem: action.system
            };
        case c.CHANGE_SELL_SYSTEM:
            return {
                ...state,
                sellSystem: action.system
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
        case c.LOAD_PRICES_BY_SYSTEMS:
            return {
                ...state,
                pricesBySystem: {
                    ...state.pricesBySystem,
                    AMARR: action.systems.find(el => el.system === 'AMARR').arr,
                    JITA: action.systems.find(el => el.system === 'JITA').arr,
                    DODIXIE: action.systems.find(el => el.system === 'DODIXIE').arr,
                    PERIMETER: action.systems.find(el => el.system === 'PERIMETER').arr
                }
            };
        default:
            return state;
    }
};

export default calc;
