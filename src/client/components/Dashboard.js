import React from 'react';
import { connect } from 'react-redux';
import LoadingForm from './LoadingForm';
import TablePrice from './TablePrice';

import * as a from '../actions/dashboard';

class Dashboard extends React.Component {

    handleSearch = () => {
        const { ids, system } = this.props;

        if (!ids) {
            return;
        }

        let url = `https://api.evemarketer.com/ec/marketstat/json?typeid=${ids.map(el => el.value)}`;

        if (system) {
            url += `&usesystem=${system.value}`;
        }

        this.props.loadPrices(url);
    };

    render() {

        const {
            prices,
        } = this.props;

        return (
            <div>
                <LoadingForm onLoad={this.handleSearch}/>
                <TablePrice prices={prices} />
            </div>
        )
    }
}

export default connect(
    state => state.dashboard,
    dispatch => ({
        loadPrices(url) {
            dispatch(a.loadPrices(url))
        }
    })
)(Dashboard);
