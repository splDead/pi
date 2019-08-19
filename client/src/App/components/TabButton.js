import React from 'react';

import './TabButton.css';

export default ({ title, active, disabled, onClick }) =>
    <div className={`tab-button ${active ? 'active' : ''}`} disabled={disabled} onClick={onClick}>
        {title}
    </div>;
