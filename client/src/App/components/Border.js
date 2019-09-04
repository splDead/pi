import React from 'react';

import './Border.css';

export default ({ header }) =>
    <div>
        <div className='border-header'>
            {header}
        </div>
        <div className='border-primary'>
            <div className='border-inner' />
        </div>
    </div>;
