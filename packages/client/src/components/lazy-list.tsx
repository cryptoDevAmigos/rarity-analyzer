import React from 'react';
import { LazyComponent } from './lazy-component';

export const LazyList = <T extends {}>({
    items, 
    getItemKey, 
    ItemComponent 
}:{ 
    items:T[], 
    getItemKey:(item:T)=>string, 
    ItemComponent: (props:{item:T}) => JSX.Element,
})=>{

    return (
        <>
            {items.map(x=>(
                <LazyComponent key={getItemKey(x)}>
                    <ItemComponent item={x}/>
                </LazyComponent>
            ))}
        </>
    );
};

