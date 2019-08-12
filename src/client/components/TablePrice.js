import React from 'react';

import piOpt from '../resources/pi-id.json';

class TablePrice extends React.Component {

    render() {

        const {
            prices
        } = this.props;

        return (
            <div>
                <div>
                    Prices
                </div>
                {prices.length > 0
                    ? <table>
                        <thead>
                        <tr>
                            <th>
                                Name
                            </th>
                            <th>
                                Min price by sell
                            </th>
                            <th>
                                Max price by buy
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {prices.map((el, i) =>
                            <tr key={i}>
                                <td>
                                    {piOpt.find(elem => elem.value === el.buy.forQuery.types[0].toString()).label}
                                </td>
                                <td>
                                    {el.sell.min}
                                </td>
                                <td>
                                    {el.buy.max}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    : null
                }
            </div>
        )
    }
}

export default TablePrice;
