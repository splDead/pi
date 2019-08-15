import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import * as a from '../actions/dashboard';

import systemOpt from '../resources/system-id.json';

class LoadingForm extends React.Component {

    handleChangeSystemId = id => {
        this.props.changeSystemId(id);
        this.props.loadPrices(id.value);
    };

    render() {

        const {
            system
        } = this.props;

        return (
            <div>
                <Select
                    value={system}
                    onChange={this.handleChangeSystemId}
                    options={systemOpt} />
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
