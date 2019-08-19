import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingForm from '../components/LoadingForm';
import TablePrice from '../components/TablePrice';

import * as a from '../actions/dashboard';

class Home extends Component {

    componentDidMount() {
        this.props.loadPrices();
    }

    render() {

        const {
            prices,
        } = this.props;

        return (
            <div>
                <LoadingForm/>
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
)(Home);