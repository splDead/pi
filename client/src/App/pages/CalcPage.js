import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Select from 'react-select';
import MainMenu from '../components/MainMenu';
import TabButton from '../components/TabButton';
import Checkbox from '../components/Checkbox';

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

const styles = {
    container: styles => ({
        ...styles,
        minWidth: 200
    })
};


class CalcPage extends React.Component {

    state = {
        activeTab: tabs.CALC,
        expandedRowId: '',
        isT1toT3: false,
        isT1toT4: false,
        systemIds: [],
        selectBuySystem: ''
    };

    componentDidMount() {
        axios.post('/api/getSystemIds')
            .then(response => {
                this.setState({ systemIds: response.data });
                this.props.loadPricesBySystems(response.data);
            });
    }

    onChangeTabs = activeTab => {
        this.setState({ activeTab });
    };

    onChangeTax = e => {
        this.props.changeTax(e.target.value);
    };

    onExpadedRowOn = expandedRowId => {
        this.setState({ expandedRowId });
    };

    onExpandedRowOff = () => {
        this.setState({ expandedRowId: '' });
    };

    onChangeT1T3CraftMode = () => {
        this.setState({ isT1toT3: !this.state.isT1toT3, expandedRowId: '' });
    };

    onChangeT1T4CraftMode = () => {
        this.setState({ isT1toT4: !this.state.isT1toT4, expandedRowId: '' });
    };

    onChangeBuySystem = selectBuySystem => {
        this.setState({ selectBuySystem, expandedRowId: '' });
    };

    render() {

        const {
            activeTab,
            expandedRowId,
            isT1toT3,
            isT1toT4,
            systemIds,
            selectBuySystem
        } = this.state;

        const {
            tax,
            pricesBySystem,
            match
        } = this.props;

        let rows = [];

        // проверяем загрузку цен
        if (pricesBySystem.AMARR && pricesBySystem.AMARR.length) {
            craft.forEach((row, indexRow) => {
                let costs = [];

                // собираем все варианты закупок
                for (let buy in pricesBySystem) {
                    for (let sell in pricesBySystem) {
                        let costSystems = [];
                        row.inputs.forEach(input => {
                            let tempPrices = [];
                            for (let s in pricesBySystem) {
                                let sellPriceComponent = pricesBySystem[s].find(el => el.sell.forQuery.types[0] === input.id).sell.min;

                                // если цена продажи 0, то его нет в продаже
                                if (sellPriceComponent !== 0) {
                                    tempPrices.push({
                                        name: s,
                                        cost: (sellPriceComponent + taxes[input.tier] * tax/100) * input.count
                                    });
                                }
                            }

                            // находим самое выгодное сочетание
                            let low;

                            // если выбрана система закупки, игнорируем самое выгодное предложение
                            if (selectBuySystem) {
                                low = tempPrices.find(elem => elem.name === selectBuySystem.label.toUpperCase());
                            } else {
                                tempPrices.forEach(el => {
                                    if (!low || (low.cost > el.cost)) {
                                        low = el;
                                    }
                                });
                            }

                            // если компонент крафта не найден в системе закупки делаем ретурн
                            if (low) {
                                costSystems.push(low);
                            }
                        });

                        if (costSystems.length === row.inputs.length) {
                            // считаем стоимость закупки с учетом налога на импорт
                            let cost = costSystems.reduce((sum, elem) => sum += elem.cost, 0);

                            // считаем стоимость продажи с учетом надлга на экспорт
                            let max = (pricesBySystem[sell].find(el => el.buy.forQuery.types[0] === row.result.id).buy.max - taxes[row.result.tier] * tax/100) * row.result.count;

                            // считаем выгоду
                            let profit = max - cost;

                            let buySystemNames = costSystems.map(el => el.name);
                            costs.push({
                                buy: buySystemNames,
                                sell,
                                cost,
                                max,
                                profit,
                                key: buySystemNames.join('') + sell + profit,
                                craftItem: row
                            });
                        }
                    }
                }

                // проверяем что закупка возможна
                if (costs.length > 0) {
                    // находим самый выгодный вариант и получаем список всех положительных крафтов
                    let maxProfitItem;
                    let tableProfits = [];

                    costs.forEach(elem => {
                        if (!maxProfitItem || (maxProfitItem.profit < elem.profit)) {
                            maxProfitItem = elem;
                        }

                        if (elem.profit > 0) {
                            tableProfits.push(elem);
                        }
                    });

                    // оставляем только уникальные цепочки
                    let uniqTableProfits = [];
                    tableProfits.forEach(t => {
                        if (!uniqTableProfits.some(el => el.key === t.key)) {
                            uniqTableProfits.push(t);
                        }
                    });

                    uniqTableProfits.sort((a, b) => b.profit - a.profit);

                    rows.push({
                        maxProfitItem,
                        uniqTableProfits
                    });
                }
            });

            // проверяем необходимость считать крафт из т1 в т3
            if (isT1toT3) {
                let craftT3 = craft.filter(el => el.result.tier === 3);
                let craftT2 = craft.filter(el => el.result.tier === 2);

                craftT3.forEach(t3 => {
                    let tempT3res = []; // результаты промежуточного крафта
                    let costs = [];

                    // делаем промежуточный крафт т2 ресов
                    t3.inputs.forEach(t2input => {
                        let tempT2res = [];
                        let tempCraftT2 = craftT2.find(el => el.result.id === t2input.id);
                        let count = t2input.count / tempCraftT2.result.count; // множитель крафта

                        for (let buy in pricesBySystem) {
                            for (let sell in pricesBySystem) {
                                let costSystems = [];

                                tempCraftT2.inputs.forEach(input => {
                                    let tempPrices = [];
                                    for (let s in pricesBySystem) {
                                        let sellPriceComponent = pricesBySystem[s].find(el => el.sell.forQuery.types[0] === input.id).sell.min;

                                        // если цена продажи 0, то его нет в продаже
                                        if (sellPriceComponent !== 0) {
                                            tempPrices.push({
                                                name: s,
                                                cost: (sellPriceComponent + taxes[input.tier] * tax/100) * input.count * count,
                                                inputName: input.name,
                                                inputCount: input.count * count,
                                                inputId: input.id,
                                                inputTier: input.tier
                                            });
                                        }
                                    }

                                    // находим самое выгодное сочетание
                                    let low;

                                    if (selectBuySystem) {
                                        low = tempPrices.find(elem => elem.name === selectBuySystem.label.toUpperCase());
                                    } else {
                                        tempPrices.forEach(el => {
                                            if (!low || (low.cost > el.cost)) {
                                                low = el;
                                            }
                                        });
                                    }

                                    if (low) {
                                        costSystems.push(low);
                                    }
                                });

                                if (costSystems.length === tempCraftT2.inputs.length) {
                                    // считаем стоимость закупки с учетом налога на импорт
                                    let cost = costSystems.reduce((sum, elem) => sum += elem.cost, 0);

                                    let buySystemNames = costSystems.map(el => el.name);
                                    tempT2res.push({
                                        buy: buySystemNames,
                                        cost,
                                        key: buySystemNames.join('') + cost,
                                        craftItem: t2input,
                                        sourceItems: costSystems.map(el => ({
                                            name: el.inputName,
                                            count: el.inputCount,
                                            id: el.inputId,
                                            tier: el.inputTier
                                        }))
                                    });
                                }
                            }
                        }

                        // проверяем что закупка возможна
                        if (tempT2res.length > 0) {
                            // находим самый выгодный вариант и получаем список всех положительных крафтов
                            let maxProfitItem;
                            let tableProfits = [];
                            tempT2res.forEach(elem => {
                                if (!maxProfitItem || (maxProfitItem.cost < elem.cost)) {
                                    maxProfitItem = elem;
                                }

                                if (!tableProfits.some(el => el.cost === elem.cost)) {
                                    tableProfits.push(elem);
                                }
                            });

                            // оставляем только уникальные цепочки
                            let uniqTableProfits = [];
                            tableProfits.forEach(t => {
                                if (!uniqTableProfits.some(el => el.key === t.key)) {
                                    uniqTableProfits.push(t);
                                }
                            });

                            uniqTableProfits.sort((a, b) => b.profit - a.profit);

                            tempT3res.push(maxProfitItem);
                        }
                    });

                    // проверяем что удалось закупить все компонеты
                    if (tempT3res.length === t3.inputs.length) {
                        for (let sell in pricesBySystem) {
                            // считаем стоимость продажи с учетом надлга на экспорт
                            let max = (pricesBySystem[sell].find(el => el.buy.forQuery.types[0] === t3.result.id).buy.max - taxes[t3.result.tier] * tax/100) * t3.result.count;

                            let cost = tempT3res.reduce((sum, el) => sum += el.cost, 0);

                            // считаем выгоду
                            let profit = max - cost;

                            let buySystemNames = [];
                            let craftInputs = [];
                            tempT3res.forEach(el => {
                                craftInputs = craftInputs.concat(el.sourceItems);
                                el.buy.forEach(elem => buySystemNames.push(elem))
                            });

                            let cleanedCraftInputs = [];
                            let cleanedBuySystemNames = [];
                            craftInputs.forEach((elem, i) => {
                                if (!cleanedCraftInputs.some(el => el.id === elem.id)) {
                                    cleanedCraftInputs.push(elem);
                                    cleanedBuySystemNames.push(buySystemNames[i]);
                                } else {
                                    cleanedCraftInputs = cleanedCraftInputs.map(el =>
                                        el.id === elem.id
                                            ? ({ ...el, count: el.count + elem.count })
                                            : el
                                    )
                                }
                            });

                            costs.push({
                                buy: cleanedBuySystemNames,
                                sell,
                                cost,
                                max,
                                profit,
                                key: cleanedBuySystemNames.join('') + sell + profit,
                                craftItem: {
                                    inputs: cleanedCraftInputs,
                                    result: t3.result
                                }
                            });
                        }
                    }

                    // проверяем возможность закупки
                    if (costs.length > 0) {
                        // находим самый выгодный вариант и получаем список всех положительных крафтов
                        let maxProfitItem;
                        let tableProfits = [];
                        costs.forEach(elem => {
                            if (!maxProfitItem || (maxProfitItem.profit < elem.profit)) {
                                maxProfitItem = elem;
                            }

                            if (elem.profit > 0) {
                                tableProfits.push(elem);
                            }
                        });

                        // оставляем только уникальные цепочки
                        let uniqTableProfits = [];
                        tableProfits.forEach(t => {
                            if (!uniqTableProfits.some(el => el.key === t.key)) {
                                uniqTableProfits.push(t);
                            }
                        });

                        uniqTableProfits.sort((a, b) => b.profit - a.profit);

                        rows.push({
                            maxProfitItem,
                            uniqTableProfits
                        });
                    }
                });
            }

            if (isT1toT4) {
                let craftT4 = craft.filter(el => el.result.tier === 4);
                let craftT3 = craft.filter(el => el.result.tier === 3);
                let craftT2 = craft.filter(el => el.result.tier === 2);

                craftT4.forEach(t4 => {
                    let tempT4res = []; // результаты промежуточного крафта
                    let costs = [];

                    // делаем промежуточный крафт т3 ресов
                    t4.inputs.forEach(t3input => {
                        // если компонент т1 ищем его на рынке
                        if (t3input.tier === 1) {
                            let tempPrices = [];
                            for (let s in pricesBySystem) {
                                let sellPriceComponent = pricesBySystem[s].find(el => el.sell.forQuery.types[0] === t3input.id).sell.min;

                                // если цена продажи 0, то его нет в продаже
                                if (sellPriceComponent !== 0) {
                                    tempPrices.push({
                                        name: s,
                                        cost: (sellPriceComponent + taxes[t3input.tier] * tax/100) * t3input.count,
                                        inputName: t3input.name,
                                        inputCount: t3input.count,
                                        inputId: t3input.id,
                                        inputTier: t3input.tier
                                    });
                                }
                            }

                            // находим самое выгодное сочетание
                            let low;

                            if (selectBuySystem) {
                                low = tempPrices.find(elem => elem.name === selectBuySystem.label.toUpperCase());
                            } else {
                                tempPrices.forEach(el => {
                                    if (!low || (low.cost > el.cost)) {
                                        low = el;
                                    }
                                });
                            }

                            if (low) {
                                tempT4res.push({
                                    buy: [low.name],
                                    cost: low.cost,
                                    key: low.name + low.cost,
                                    craftItem: t3input,
                                    sourceItems: [t3input]
                                });
                            }
                        } else {
                            let tempT3res = []; // результаты промежуточного крафта
                            let tempCraftT3 = craftT3.find(el => el.result.id === t3input.id);
                            let count = t3input.count / tempCraftT3.result.count; // множитель крафта

                            tempCraftT3.inputs.forEach(t2input => {
                                let tempT2res = [];
                                let tempCraftT2 = craftT2.find(el => el.result.id === t2input.id);
                                let count = t2input.count / tempCraftT2.result.count; // множитель крафта

                                for (let buy in pricesBySystem) {
                                    for (let sell in pricesBySystem) {
                                        let costSystems = [];

                                        tempCraftT2.inputs.forEach(input => {
                                            let tempPrices = [];
                                            for (let s in pricesBySystem) {
                                                let sellPriceComponent = pricesBySystem[s].find(el => el.sell.forQuery.types[0] === input.id).sell.min;

                                                // если цена продажи 0, то его нет в продаже
                                                if (sellPriceComponent !== 0) {
                                                    tempPrices.push({
                                                        name: s,
                                                        cost: (sellPriceComponent + taxes[input.tier] * tax/100) * input.count * count,
                                                        inputName: input.name,
                                                        inputCount: input.count * count,
                                                        inputId: input.id,
                                                        inputTier: input.tier
                                                    });
                                                }
                                            }

                                            // находим самое выгодное сочетание
                                            let low;

                                            if (selectBuySystem) {
                                                low = tempPrices.find(elem => elem.name === selectBuySystem.label.toUpperCase());
                                            } else {
                                                tempPrices.forEach(el => {
                                                    if (!low || (low.cost > el.cost)) {
                                                        low = el;
                                                    }
                                                });
                                            }

                                            if (low) {
                                                costSystems.push(low);
                                            }
                                        });

                                        if (costSystems.length === tempCraftT2.inputs.length) {
                                            // считаем стоимость закупки с учетом налога на импорт
                                            let cost = costSystems.reduce((sum, elem) => sum += elem.cost, 0);

                                            let buySystemNames = costSystems.map(el => el.name);
                                            tempT2res.push({
                                                buy: buySystemNames,
                                                cost,
                                                key: buySystemNames.join('') + cost,
                                                craftItem: t2input,
                                                sourceItems: costSystems.map(el => ({
                                                    name: el.inputName,
                                                    count: el.inputCount,
                                                    id: el.inputId,
                                                    tier: el.inputTier
                                                }))
                                            });
                                        }
                                    }
                                }

                                // проверяем что закупка возможна
                                if (tempT2res.length > 0) {
                                    // находим самый выгодный вариант и получаем список всех положительных крафтов
                                    let maxProfitItem;
                                    tempT2res.forEach(elem => {
                                        if (!maxProfitItem || (maxProfitItem.cost < elem.cost)) {
                                            maxProfitItem = elem;
                                        }
                                    });

                                    if (maxProfitItem) {
                                        tempT3res.push(maxProfitItem);
                                    }
                                }
                            });

                            if (tempT3res.length === tempCraftT3.inputs.length) {
                                // считаем стоимость закупки с учетом налога на импорт
                                let cost = tempT3res.reduce((sum, elem) => sum += elem.cost, 0) * count;

                                let buySystemNames = [];
                                let sourceItems = [];
                                tempT3res.forEach(elem => {
                                    buySystemNames = buySystemNames.concat(elem.buy);
                                    sourceItems = sourceItems.concat(elem.sourceItems);
                                });

                                sourceItems = sourceItems.map(el => ({ ...el, count: el.count * count }));

                                tempT4res.push({
                                    buy: buySystemNames,
                                    cost,
                                    key: buySystemNames.join('') + cost,
                                    craftItem: t3input,
                                    sourceItems
                                });
                            }
                        }
                    });

                    // проверяем что удалось закупить все компонеты
                    if (tempT4res.length === t4.inputs.length) {
                        for (let sell in pricesBySystem) {
                            // считаем стоимость продажи с учетом надлга на экспорт
                            let max = (pricesBySystem[sell].find(el => el.buy.forQuery.types[0] === t4.result.id).buy.max - taxes[t4.result.tier] * tax/100) * t4.result.count;

                            let cost = tempT4res.reduce((sum, el) => sum += el.cost, 0);

                            // считаем выгоду
                            let profit = max - cost;

                            let buySystemNames = [];
                            let craftInputs = [];
                            tempT4res.forEach(el => {
                                craftInputs = craftInputs.concat(el.sourceItems);
                                el.buy.forEach(elem => buySystemNames.push(elem))
                            });

                            let cleanedCraftInputs = [];
                            let cleanedBuySystemNames = [];
                            craftInputs.forEach((elem, i) => {
                                if (!cleanedCraftInputs.some(el => el.id === elem.id)) {
                                    cleanedCraftInputs.push(elem);
                                    cleanedBuySystemNames.push(buySystemNames[i]);
                                } else {
                                    cleanedCraftInputs = cleanedCraftInputs.map(el =>
                                        el.id === elem.id
                                            ? ({ ...el, count: el.count + elem.count })
                                            : el
                                    )
                                }
                            });

                            costs.push({
                                buy: cleanedBuySystemNames,
                                sell,
                                cost,
                                max,
                                profit,
                                key: cleanedBuySystemNames.join('') + sell + profit,
                                craftItem: {
                                    inputs: cleanedCraftInputs,
                                    result: t4.result
                                }
                            });
                        }
                    }

                    // проверяем возможность закупки
                    if (costs.length > 0) {
                        // находим самый выгодный вариант и получаем список всех положительных крафтов
                        let maxProfitItem;
                        let tableProfits = [];
                        costs.forEach(elem => {
                            if (!maxProfitItem || (maxProfitItem.profit < elem.profit)) {
                                maxProfitItem = elem;
                            }

                            if (elem.profit > 0) {
                                tableProfits.push(elem);
                            }
                        });

                        // оставляем только уникальные цепочки
                        let uniqTableProfits = [];
                        tableProfits.forEach(t => {
                            if (!uniqTableProfits.some(el => el.key === t.key)) {
                                uniqTableProfits.push(t);
                            }
                        });

                        uniqTableProfits.sort((a, b) => b.profit - a.profit);

                        rows.push({
                            maxProfitItem,
                            uniqTableProfits
                        });
                    }
                });
            }
        }

        // сортируем по профиту
        rows.sort((a, b) => {
            return b.maxProfitItem.profit - a.maxProfitItem.profit
        });

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
                        <div className='calc-advanced'>
                            <Checkbox
                                title='T1 -> T3'
                                checked={isT1toT3}
                                onChange={this.onChangeT1T3CraftMode}
                            />
                            <Checkbox
                                title='T1 -> T4'
                                checked={isT1toT4}
                                onChange={this.onChangeT1T4CraftMode}
                            />
                            <Select
                                isClearable={true}
                                placeholder='Select buy system'
                                value={selectBuySystem}
                                onChange={this.onChangeBuySystem}
                                styles={styles}
                                options={systemIds} />
                        </div>
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
                                        $$$
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
                                {rows.length > 0 && rows.map((row, indexRow) => {
                                    let { maxProfitItem, uniqTableProfits } = row;
                                    let { cost, max, profit, craftItem } = maxProfitItem;

                                    return (
                                        <React.Fragment key={indexRow}>
                                            <tr
                                                onClick={profit > 0 ? () => this.onExpadedRowOn(indexRow) : null}
                                                className={`${uniqTableProfits.length > 1 ? 'expandable' : ''} ${expandedRowId === indexRow ? 'invisible' : ''} ${indexRow % 2 === 1 ? 'row-odd' : ''} ${profit < 0 ? 'half-opacity-row' : ''}`}
                                            >
                                                <td>
                                                    {craftItem.inputs.map(elem =>
                                                        <div key={elem.id}>
                                                            {elem.name} x {elem.count}
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    {selectBuySystem
                                                        ? selectBuySystem.label
                                                        : maxProfitItem.buy.every(elem => elem === maxProfitItem.buy[0])
                                                            ? maxProfitItem.buy[0].substr(0, 1) + maxProfitItem.buy[0].substr(1).toLowerCase()
                                                            : maxProfitItem.buy.map((systemBuy, i) =>
                                                            <div key={i}>
                                                                {systemBuy.substr(0, 1) + systemBuy.substr(1).toLowerCase()}
                                                            </div>
                                                        )
                                                    }
                                                </td>
                                                <td>
                                                    {cost.toFixed(2)}
                                                </td>
                                                <td>
                                                    {craftItem.result.name} x {craftItem.result.count}
                                                </td>
                                                <td className='column-right'>
                                                    {max.toFixed(2)}
                                                </td>
                                                <td>
                                                    {maxProfitItem.sell.substr(0, 1) + maxProfitItem.sell.substr(1).toLowerCase()}
                                                    {uniqTableProfits.length > 1
                                                        ? ` + ${uniqTableProfits.length - 1}`
                                                        : null
                                                    }
                                                </td>
                                                <td className='column-right'>
                                                    {profit.toFixed(2)}
                                                </td>
                                            </tr>
                                            {uniqTableProfits.map((uniq, i, list) =>
                                                <tr
                                                    onClick={this.onExpandedRowOff}
                                                    key={uniq.key} className={`${expandedRowId !== indexRow || expandedRowId === '' ? 'invisible' : ''} ${i === 0 ? 'first' : ''} ${i === list.length - 1 ? 'last' : ''}`}
                                                >
                                                    <td>
                                                        {craftItem.inputs.map(elem =>
                                                            <div key={elem.id}>
                                                                {elem.name} x {elem.count}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {selectBuySystem
                                                            ? selectBuySystem.label
                                                            : uniq.buy.every(elem => elem === uniq.buy[0])
                                                                ? uniq.buy[0].substr(0, 1) + uniq.buy[0].substr(1).toLowerCase()
                                                                : uniq.buy.map((systemBuy, i) =>
                                                                <div key={i}>
                                                                    {systemBuy.substr(0, 1) + systemBuy.substr(1).toLowerCase()}
                                                                </div>
                                                            )
                                                        }
                                                    </td>
                                                    <td>
                                                        {uniq.cost.toFixed(2)}
                                                    </td>
                                                    <td>
                                                        {craftItem.result.name} x {craftItem.result.count}
                                                    </td>
                                                    <td className='column-right'>
                                                        {uniq.max.toFixed(2)}
                                                    </td>
                                                    <td>
                                                        {uniq.sell.substr(0, 1) + uniq.sell.substr(1).toLowerCase()}
                                                    </td>
                                                    <td className='column-right'>
                                                        {(uniq.max - uniq.cost).toFixed(2)}
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
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
