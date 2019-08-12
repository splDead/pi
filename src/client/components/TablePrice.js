import React from 'react';

import t1 from '../resources/pi-t1-id.json';
import t2 from '../resources/pi-t2-id.json';
import t3 from '../resources/pi-t3-id.json';
import t4 from '../resources/pi-t4-id.json';

import './TablePrice.css';

const tables = [
    {
        label: 't1',
        arr: t1
    },
    {
        label: 't2',
        arr: t2
    },
    {
        label: 't3',
        arr: t3
    },
    {
        label: 't4',
        arr: t4
    },
];

class TablePrice extends React.Component {

    render() {

        const {
            prices
        } = this.props;

        return (
            <div>
                {prices.length > 0 && tables.map((table, i) =>
                    <table className='price-table' key={i}>
                        <thead>
                        <tr>
                            <th className='column-name'>
                                {table.label}
                            </th>
                            <th className='column-price'>
                                Min price by sell
                            </th>
                            <th className='column-price'>
                                Max price by buy
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {table.arr.map((el, i) => {
                            let row = prices.find(elem => el.value === elem.buy.forQuery.types[0].toString());

                            return (
                                <tr key={i} className={i % 2 === 1 ? 'row-odd' : ''}>
                                    <td>
                                        {el.label}
                                    </td>
                                    <td className='column-price'>
                                        {row.sell.min.toFixed(2)}
                                    </td>
                                    <td className='column-price'>
                                        {row.buy.max.toFixed(2)}
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                )}
            </div>
        )
    }
}

export default TablePrice;
