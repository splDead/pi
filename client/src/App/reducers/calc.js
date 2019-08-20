import * as c from '../constants';

const initialState = {
    tax: 20,
    pricesBySystem: {}
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
            let pricesBySystem = {};
            for (let s in action.systems) {
                pricesBySystem[action.systems[s].system] = action.systems[s].arr;
            }

            return {
                ...state,
                pricesBySystem
            };
        default:
            return state;
    }
};

export default calc;
