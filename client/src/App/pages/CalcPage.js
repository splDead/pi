import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import * as a from '../actions/calc';

import craft from '../resources/craft';

const tabs = {
    CALC: 'CALC',
    STORAGE: 'STORAGE'
};

const taxes = {
    1: 400,
    2: 7200,
    3: 60000,
    4: 1200000
};

class CalcPage extends React.Component {

    state = {
        activeTab: tabs.CALC
    };

    componentDidMount() {
        axios.post('/api/getSystemIds')
            .then(response =>
                this.props.loadPricesBySystems(response.data)
            );
    }

    onChangeTabs = activeTab => {
        this.setState({ activeTab });
    };

    onChangeTax = e => {
        this.props.changeTax(e.target.value);
    };

    render() {

        const {
            activeTab
        } = this.state;

        const {
            tax,
            pricesBySystem
        } = this.props;

        return (
            <div>
                <div>
                    <button onClick={() => this.onChangeTabs(tabs.CALC)}>
                        calc
                    </button>
                    <button onClick={() => this.onChangeTabs(tabs.STORAGE)} disabled={true} title='Under construction'>
                        storage
                    </button>
                </div>
                <hr/>
                <div>
                    <label>
                        <span>Налог: </span>
                        <input type='text' value={tax} onChange={this.onChangeTax}/>
                    </label>
                </div>
                {activeTab === tabs.CALC
                    ? <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        System buy
                                    </th>
                                    <th>
                                        System sell
                                    </th>
                                    <th>
                                        Inputs
                                    </th>
                                    <th>
                                        Cost
                                    </th>
                                    <th>
                                        Result
                                    </th>
                                    <th>
                                        Max price by buy
                                    </th>
                                    <th>
                                        Profit
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {pricesBySystem.AMARR.length > 0 && craft.map((row, i) => {
                                    let costs = [];

                                    for (let buy in pricesBySystem) {
                                        for (let sell in pricesBySystem) {
                                            let cost = row.inputs.reduce((sum, elem) => sum += ((pricesBySystem[buy].find(el => el.sell.forQuery.types[0] === elem.id).sell.min + taxes[elem.tier] * tax/100) * elem.count), 0);
                                            let max = (pricesBySystem[sell].find(el => el.buy.forQuery.types[0] === row.result.id).buy.max - taxes[row.result.tier] * tax/100) * row.result.count;
                                            let profit = max - cost;

                                            costs.push({
                                                buy,
                                                sell,
                                                cost,
                                                max,
                                                profit
                                            });
                                        }
                                    }

                                    let maxProfitItem;
                                    costs.forEach(elem => {
                                        if (!maxProfitItem || (maxProfitItem.profit < elem.profit)) {
                                            maxProfitItem = elem;
                                        }
                                    });

                                    let { cost, max } = maxProfitItem;

                                    return (
                                        <tr key={i}>
                                            <td>
                                                {maxProfitItem.buy}
                                            </td>
                                            <td>
                                                {maxProfitItem.sell}
                                            </td>
                                            <td>
                                                {row.inputs.map(elem =>
                                                    <div key={elem.id}>
                                                        {elem.name} x {elem.count}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                {cost.toFixed(2)}
                                            </td>
                                            <td>
                                                {row.result.name} x {row.result.count}
                                            </td>
                                            <td>
                                                {max.toFixed(2)}
                                            </td>
                                            <td>
                                                {(max - cost).toFixed(2)}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    : <div>
                        tab storage
                        это склад
                    </div>
                }
            </div>
        )
    }
}

export default connect(
    state => state.calc,
    dispatch => ({
        changeBuySystem(id) {
            dispatch(a.changeBuySystem(id))
        },
        changeSellSystem(id) {
            dispatch(a.changeSellSystem(id))
        },
        changeTax(tax) {
            dispatch(a.changeTax(tax))
        },
        loadPricesBySystems(systems) {
            dispatch(a.loadPricesBySystems(systems))
        }
    })
)(CalcPage);
