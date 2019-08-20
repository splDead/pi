import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import MainMenu from '../components/MainMenu';
import TabButton from '../components/TabButton';

import * as a from '../actions/calc';

import craft from '../resources/craft';

import './CalcPage.css';

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
            pricesBySystem,
            match
        } = this.props;

        return (
            <React.Fragment>
                <MainMenu match={match} />
                <div className='page__container'>
                    <div className='calc-header'>
                        <div className='calc-tabs'>
                            <TabButton
                                onClick={() => this.onChangeTabs(tabs.CALC)}
                                title='Calculator'
                                active={activeTab === tabs.CALC}
                            />
                            <TabButton
                                onClick={() => this.onChangeTabs(tabs.STORAGE)}
                                title='Storage'
                                active={activeTab === tabs.STORAGE}
                            />
                        </div>
                        {activeTab === tabs.CALC
                            ? <div className='tax__container'>
                                <label>
                                    <div>Сustoms tax: </div>
                                    <input type='text' value={tax} onChange={this.onChangeTax}/>
                                </label>
                            </div>
                            : null
                        }
                    </div>
                    {activeTab === tabs.CALC
                        ? <table className='calc-table'>
                            <thead>
                                <tr>
                                    <th className='column-left'>
                                        Inputs
                                    </th>
                                    <th className='column-left'>
                                        System buy
                                    </th>
                                    <th className='column-left'>
                                        Cost
                                    </th>
                                    <th className='column-left'>
                                        Result
                                    </th>
                                    <th className='column-right'>
                                        Max price by buy
                                    </th>
                                    <th className='column-left'>
                                        System sell
                                    </th>
                                    <th className='column-right'>
                                        Profit
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {pricesBySystem.AMARR.length > 0 && craft.map((row, i) => {
                                    let costs = [];

                                    for (let buy in pricesBySystem) {
                                        for (let sell in pricesBySystem) {
                                            let costSystems = [];
                                            row.inputs.forEach(input => {
                                                let tempPrices = [];
                                                for (let s in pricesBySystem) {
                                                    tempPrices.push({
                                                        name: s,
                                                        cost: (pricesBySystem[s].find(el => el.sell.forQuery.types[0] === input.id).sell.min + taxes[input.tier] * tax/100) * input.count
                                                    });
                                                }

                                                let low;
                                                tempPrices.forEach(el => {
                                                    if (!low || (low.cost > el.cost)) {
                                                        low = el;
                                                    }
                                                });

                                                costSystems.push(low);
                                            });

                                            let cost = costSystems.reduce((sum, elem) => sum += elem.cost, 0);
                                            let max = (pricesBySystem[sell].find(el => el.buy.forQuery.types[0] === row.result.id).buy.max - taxes[row.result.tier] * tax/100) * row.result.count;
                                            let profit = max - cost;

                                            costs.push({
                                                buy: costSystems.map(el => el.name),
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
                                        <tr key={i} className={i % 2 === 1 ? 'row-odd' : ''}>
                                            <td>
                                                {row.inputs.map(elem =>
                                                    <div key={elem.id}>
                                                        {elem.name} x {elem.count}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                {maxProfitItem.buy.map((systemBuy, i) =>
                                                    <div key={i}>
                                                        {systemBuy.substr(0, 1) + systemBuy.substr(1).toLowerCase()}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                {cost.toFixed(2)}
                                            </td>
                                            <td>
                                                {row.result.name} x {row.result.count}
                                            </td>
                                            <td className='column-right'>
                                                {max.toFixed(2)}
                                            </td>
                                            <td>
                                                {maxProfitItem.sell.substr(0, 1) + maxProfitItem.sell.substr(1).toLowerCase()}
                                            </td>
                                            <td className='column-right'>
                                                {(max - cost).toFixed(2)}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        : <div>
                            tab storage
                            это склад
                        </div>
                    }
                </div>
            </React.Fragment>
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
