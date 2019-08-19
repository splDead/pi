import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import XLSX from 'xlsx';
import axios from 'axios';

import * as a from '../actions/dashboard';

import t1 from '../resources/pi-t1-id.json';
import t2 from '../resources/pi-t2-id.json';
import t3 from '../resources/pi-t3-id.json';
import t4 from '../resources/pi-t4-id.json';

import './LoadingForm.css';

const tables = [
    {
        label: 'Tier 1',
        arr: t1
    },
    {
        label: 'Tier 2',
        arr: t2
    },
    {
        label: 'Tier 3',
        arr: t3
    },
    {
        label: 'Tier 4',
        arr: t4
    },
];

const styles = {
    container: styles => ({
        ...styles,
        width: '100%'
    })
};

class LoadingForm extends React.Component {

    state = {
        systemIds: []
    };

    componentDidMount() {
        axios.post('/api/getSystemIds')
            .then(response => {
                this.setState({
                    systemIds: response.data
                });
            });
    }

    handleChangeSystemId = id => {
        this.props.changeSystemId(id);
        this.props.loadPrices(id.value);
    };

    handleGenerate = () => {
        const { prices } = this.props;
        const wb = XLSX.utils.book_new();
        let data = [];

        tables.forEach(table => {
            data.push([table.label, 'Min price by sell', 'Max price by buy']);

            table.arr.forEach(elem => {
                let row = prices.find(price => elem.value === price.buy.forQuery.types[0].toString());

                data.push([elem.label, row.sell.min.toFixed(2), row.buy.max.toFixed(2)]);
            })
        });

        const ws = XLSX.utils.aoa_to_sheet(data);

        XLSX.utils.book_append_sheet(wb, ws, 'pi');

        XLSX.writeFile(wb, 'pi.xlsx');
    };

    render() {

        const {
            system
        } = this.props;

        const {
            systemIds
        } = this.state;

        return (
            <div className='loading-container'>
                <Select
                    placeholder='Select system'
                    value={system}
                    onChange={this.handleChangeSystemId}
                    styles={styles}
                    options={systemIds} />
                <div className='button-container'>
                    <button className='button' onClick={this.handleGenerate}>
                        Generate XLSX
                    </button>
                </div>
            </div>
        )
    }
}

export default connect(
    state => state.dashboard,
    dispatch => ({
        loadPrices(id) {
            dispatch(a.loadPrices(id))
        },
        changeSystemId(id) {
            dispatch(a.changeSystemId(id))
        }
    })
)(LoadingForm);
