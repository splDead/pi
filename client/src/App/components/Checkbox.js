import React from 'react';

import './Checkbox.css';

export default ({ checked, title, onChange }) =>
    <label className={`checkbox__container ${checked ? 'checked' : ''}`}>
        <span className='checkbox__title'>
            {title}
        </span>
        <span className='checkbox__customs' />
        <input
            type='checkbox'
            checked={checked}
            onChange={onChange}
            hidden
        />
    </label>;
