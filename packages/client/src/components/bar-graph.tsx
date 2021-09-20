import React, { useRef } from 'react';

export const BarGraphCell = ({ ratio, text }:{ ratio: number, text?: string })=>{
    return (
        <div style={{position:'relative'}}>
            <div className='bar-background' style={{
                position:'absolute',
                zIndex: 0,
                width: `${(100 * ratio).toFixed(0)}%`,
                height: '100%',
                }}>
            </div>
            <div style={{color:'#FFFFFF', position:'relative', zIndex: 10}}>
                {text ?? `${(100 * ratio).toFixed(2)}%`}
            </div>
        </div>
    );
}