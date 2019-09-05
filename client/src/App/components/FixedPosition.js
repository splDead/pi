import React from 'react';

import './FixedPosition.css';

class FixedPosition extends React.Component {

    state = {
        paddingTop: 0
    };

    fixedContainer = React.createRef();

    componentDidMount() {
        if (this.fixedContainer.current) {
            this.setState({ paddingTop: this.fixedContainer.current.offsetHeight });
        }
    }

    render() {

        const {
            Component,
            children
        } = this.props;

        const {
            paddingTop
        } = this.state;

        return (
            <div>
                <div className='fixed-container' ref={this.fixedContainer}>
                    <Component />
                </div>
                <div className='children-container' style={{ paddingTop }}>
                    {children}
                </div>
            </div>
        );
    }
}
export default FixedPosition;
