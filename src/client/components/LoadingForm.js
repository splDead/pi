import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import * as a from '../actions/dashboard';

import systemOpt from '../resources/system-id.json';

class LoadingForm extends React.Component {

    handleChangeSystemId = id => {
        let { baseUrl } = this.props;

        if (id) {
            baseUrl += `&usesystem=${id.value}`;
        }

        this.props.changeSystemId(id);
        this.props.loadPrices(baseUrl);
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
        loadPrices(url) {
            dispatch(a.loadPrices(url))
        },
        changeSystemId(id) {
            dispatch(a.changeSystemId(id))
        }
    })
)(LoadingForm);
