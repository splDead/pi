import React from 'react';

import './Input.css';

export default ({ title, value, onChange }) =>
    <div className='input-container'>
        <input type='text' value={value} onChange={onChange} />
        <div className='input-title'>
            {title}
        </div>
        <div className='input-border-bottom' />
    </div>;
