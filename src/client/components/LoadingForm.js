import React from 'react';

class LoadingForm extends React.Component {

    render() {

        const {
            onChange,
            onLoad,
            id
        } = this.props;

        return (
            <div>
                <label>
                    <div>
                        id
                    </div>
                    <input type="text" value={id} onChange={onChange}/>
                </label>
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
