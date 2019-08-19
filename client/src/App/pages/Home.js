import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingForm from '../components/LoadingForm';
import TablePrice from '../components/TablePrice';
import MainMenu from '../components/MainMenu';

import * as a from '../actions/dashboard';

class Home extends Component {

    componentDidMount() {
        this.props.loadPrices();
    }

    render() {

        const {
            prices,
            match
        } = this.props;

        return (
            <div>
                <MainMenu match={match} />
                <LoadingForm/>
                <TablePrice prices={prices} />
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