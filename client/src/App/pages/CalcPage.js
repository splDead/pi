import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import axios from 'axios';

import * as a from '../actions/calc';

import craft from '../resources/craft';

const tabs = {
    CALC: 'CALC',
    STORAGE: 'STORAGE'
};

const types = {
    BUY: 'BUY',
    SELL: 'SELL'
};

const taxes = {
    1: 400,
    2: 7200,
    3: 60000,
    4: 1200000
};

const styles = {
    container: styles => ({
        ...styles,
        width: '50%'
    })
};

class CalcPage extends React.Component {

    state = {
        activeTab: tabs.CALC,
        systemIds: []
    };

    componentDidMount() {
        axios.post('/api/getSystemIds')
            .then(response => {
                this.setState({
                    systemIds: response.data
                });

                const { buySystemId, sellSystemId } = this.props;
                this.props.loadPrices(types.BUY, buySystemId.value);
                this.props.loadPrices(types.SELL, sellSystemId.value);
            });
    }

    onChangeTabs = activeTab => {
        this.setState({ activeTab });
    };

    onChangeBuySystemId = id => {
        this.props.changeBuySystemId(id);
        this.props.loadPrices(types.BUY, id.value);
    };

    onChangeSellSystemId = id => {
        this.props.changeSellSystemId(id);
        this.props.loadPrices(types.SELL, id.value);
    };

    onChangeTax = e => {
        this.props.changeTax(e.target.value);
    };

    render() {

        const {
            activeTab,
            systemIds
        } = this.state;

        const {
            prices,
            buySystemId,
            sellSystemId,
            tax
        } = this.props;

        const pricesBuy = prices.BUY;
        const pricesSell = prices.SELL;

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
                    <div>
                        <div>
                            Система закупки
                        </div>
                        <Select
                            value={buySystemId}
                            onChange={this.onChangeBuySystemId}
                            styles={styles}
                            options={systemIds} />
                    </div>
                    <div>
                        <div>
                            Система продажи
                        </div>
                        <Select
                            value={sellSystemId}
                            onChange={this.onChangeSellSystemId}
                            styles={styles}
                            options={systemIds} />
                    </div>
                </div>
                <div>
                    <label>
                        <span>Налог: </span>
                        <input type="text" value={tax} onChange={this.onChangeTax}/>
                    </label>
                </div>
                {activeTab === tabs.CALC
                    ? <div>
                        <table>
                            <thead>
                                <tr>
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
                                {pricesBuy.length > 0 && pricesSell.length > 0 && craft.map((row, i) => {
                                    let cost = row.inputs.reduce((sum, elem) => sum += ((pricesBuy.find(el => el.sell.forQuery.types[0] === elem.id).sell.min + taxes[elem.tier] * tax/100) * elem.count), 0);
                                    let max = (pricesSell.find(el => el.buy.forQuery.types[0] === row.result.id).buy.max - taxes[row.result.tier] * tax/100) * row.result.count;

                                    return (
                                        <tr key={i}>
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
        changeBuySystemId(id) {
            dispatch(a.changeBuySystemId(id))
        },
        changeSellSystemId(id) {
            dispatch(a.changeSellSystemId(id))
        },
        loadPrices(type, id) {
            dispatch(a.loadPrices(type, id))
        },
        changeTax(tax) {
            dispatch(a.changeTax(tax))
        }
    })
)(CalcPage);
