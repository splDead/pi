import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainMenu.css';

export default () =>
    <div className='navigation'>
        <div className='main-menu__container'>
            <NavLink className='main-menu__link' to='/' exact>
                <div className='main-menu__item-bar'/>
                <div className='main-menu__item'>
                    Main
                </div>
            </NavLink>
            <NavLink className='main-menu__link' to='/calc'>
                <div className='main-menu__item-bar'/>
                <div className='main-menu__item'>
                    Calc
                </div>
            </NavLink>
        </div>
    </div>;
