import React, { useRef } from 'react';
import { useState } from 'react';
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

    const PAGE_SIZE = 12;
    const NEAR_END_COUNT = 3;
    const [loadCount, setLoadCount] = useState(PAGE_SIZE);
    const lastLoadCount = useRef(PAGE_SIZE);
    lastLoadCount.current = loadCount;

    const onLoaded = (index:number)=>{
        // Skip if already loaded more
        if(lastLoadCount.current !== loadCount){ return; }

        // Skip if not near the end
        if(index + NEAR_END_COUNT < loadCount){ return; }

        // Load more
        console.log('# LazyList: loadMore', {loadCount});
        setLoadCount(s=> s + PAGE_SIZE);
    }

    const itemsLoaded = items.slice(0, loadCount);

    return (
        <>
            {itemsLoaded.map((x,index)=>(
                <LazyComponent key={getItemKey(x)} onLoad={() => onLoaded(index)}>
                    <ItemComponent item={x}/>
                </LazyComponent>
            ))}
        </>
    );
};

