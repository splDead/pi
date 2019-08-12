import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import * as a from '../actions/dashboard';

import piOpt from '../resources/pi-id.json';
import systemOpt from '../resources/system-id.json';

const styles = {
    container: style => ({
        ...style,
        width: 300
    })
};

class LoadingForm extends React.Component {

    render() {

        const {
            onLoad,
            ids,
            system
        } = this.props;

        return (
            <div>
                <Select
                    options={piOpt}
                    onChange={this.props.changeTypeId}
                    value={ids}
                    styles={styles}
                    isMulti={true}
                    closeMenuOnSelect={false}/>
                <Select
                    value={system}
                    onChange={this.props.changeSystemId}
                    options={systemOpt}
                    styles={styles}/>
                <div>
                    <button onClick={onLoad}>
                        search
                    </button>
                </div>
            </div>
        )
    }
}

export default connect(
    state => state.dashboard,
    dispatch => ({
        changeTypeId(ids) {
            dispatch(a.changeTypeId(ids))
        },
        changeSystemId(id) {
            dispatch(a.changeSystemId(id))
        }
    })
)(LoadingForm);
