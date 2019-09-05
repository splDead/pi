import React from 'react';
import TabButton from './TabButton';

import './LoginPanel.css';

class LoginPanel extends React.Component {

    state = {
        isShowLoginForm: false
    };

    showLoginForm = () => {
        this.setState({ isShowLoginForm: !this.state.isShowLoginForm });
    };

    render() {
        return (
            <div className='login-panel-container'>
                <TabButton title='Login' onClick={this.showLoginForm} />
            </div>
        )
    }
}

export default LoginPanel;
