import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingForm from '../components/LoadingForm';
import TablePrice from '../components/TablePrice';
import FixedPosition from '../components/FixedPosition';

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
            <div className='page__container'>
                <FixedPosition Component={LoadingForm}>
                    <TablePrice prices={prices} />
                </FixedPosition>
            </div>
        )
    }
}

export default connect(
    state => state.dashboard,
    dispatch => ({
        loadPrices() {
            dispatch(a.loadPrices())
        }
    })
)(Home);