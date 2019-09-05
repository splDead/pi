import React from 'react';
import MainMenu from './MainMenu';
import LoginPanel from './LoginPanel';

import './Header.css';

class Header extends React.Component {

    render() {
        return (
            <header className='header'>
                <MainMenu />
                <LoginPanel />
            </header>
        )
    }
}

export default Header;
