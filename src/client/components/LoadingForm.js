import React from 'react';
import Select from 'react-select';

import piOpt from '../resources/pi-id.json';

const styles = {
    container: style => ({
        ...style,
        width: 300
    })
};

class LoadingForm extends React.Component {

    render() {

        const {
            onChange,
            onLoad,
            id
        } = this.props;

        return (
            <div>
                <Select
                    options={piOpt}
                    onChange={onChange}
                    value={id}
                    styles={styles}
                    isMulti={true}
                    closeMenuOnSelect={false}/>
                <div>
                    <button onClick={onLoad}>
                        search
                    </button>
                </div>
            </div>
        )
    }
}

export default LoadingForm;
