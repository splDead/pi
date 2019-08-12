import React from 'react';
import { connect } from 'react-redux';
import LoadingForm from './LoadingForm';
import TablePrice from './TablePrice';

import * as a from '../actions/dashboard';

import './Dashboard.css';

class Dashboard extends React.Component {

    componentDidMount() {
        this.props.loadPrices(this.props.baseUrl);
    }

    render() {

        const {
            prices,
        } = this.props;

        return (
            <div className='layout'>
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
)(Dashboard);
