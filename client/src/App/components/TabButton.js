import React from 'react';

import './TabButton.css';

export default ({ title, active, disabled, onClick }) =>
    <div className={`tab-button ${active ? 'active' : ''}`} disabled={disabled} onClick={onClick}>
        <div className='tab-button-bar' />
        <div className='tab-button-title'>{title}</div>
    </div>;
