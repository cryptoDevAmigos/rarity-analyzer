import React, { useRef } from 'react';

export const BarGraphCell = ({ ratio, text, textRight }:{ ratio: number, text?: string, textRight?: string })=>{
    return (
        <div className='bar-graph' style={{position:'relative'}}>
            <div className='bar-graph-background' style={{
                position:'absolute',
                zIndex: 0,
                width: `${(100 * ratio).toFixed(0)}%`,
                height: '100%',
                }}>
            </div>
            <div style={{position:'relative', zIndex: 10, display:'flex', flexDirection:'row'}}>
                {/* Used to center main text */}
                <div className='bar-graph-text-right' style={{opacity:0}}>
                    {textRight}
                </div>
                <div className='bar-graph-text' style={{flex:1}}>
                    {text ?? `${(100 * ratio).toFixed(2)}%`}
                </div>
                <div className='bar-graph-text-right' style={{}}>
                    {textRight}
                </div>
            </div>
            
        </div>
    );
}