import React from 'react';

import './MainMenu.css';

export default ({ match }) => {

    const onClick = e => {
        if (e.currentTarget.className.includes('active')) {
            e.preventDefault();
            return;
        }
    };

    return (
        <ul className='main-menu__container'>
            <a className={`main-menu__link ${match.path === '/' ? 'active' : ''}`} href="/" onClick={onClick}>
                <li className='main-menu__item'>
                    Main
                </li>
            </a>
            <a className={`main-menu__link ${match.path === '/calc' ? 'active' : ''}`} href="/calc" onClick={onClick}>
                <li className='main-menu__item'>
                    Calc
                </li>
            </a>
        </ul>
    )
}
    ;
