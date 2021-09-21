import React, { useRef } from 'react';

export const BarGraphCell = ({ ratio, text, textRight }:{ ratio: number, text?: string, textRight?: string })=>{
    return (
        <div style={{position:'relative'}}>
            <div className='bar-background' style={{
                position:'absolute',
                zIndex: 0,
                width: `${(100 * ratio).toFixed(0)}%`,
                height: '100%',
                }}>
            </div>
            {!!textRight && (
                <div className='bar-text' style={{
                    position:'absolute',
                    right: 4,
                    zIndex: 9,
                    height: '100%',
                    }}>
                    {textRight}
                </div>
            )}
            <div className='bar-text' style={{ position:'relative', zIndex: 10}}>
                {text ?? `${(100 * ratio).toFixed(2)}%`}
            </div>
        </div>
    );
}