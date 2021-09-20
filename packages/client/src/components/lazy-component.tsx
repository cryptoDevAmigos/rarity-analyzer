import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { delay } from '../helpers/delay';

const debug_timeStart = Date.now();
const globalRelayoutCallbacks = [] as (null | (()=>boolean))[];
let activeNotifyRelayoutId = 0;
const notifyRelayout = async () => {
    // Cancellable
    activeNotifyRelayoutId++;
    let notifyRelayoutId = activeNotifyRelayoutId;
    await delay(100);
    
    let i = 0;
    while( i < globalRelayoutCallbacks.length 
        && notifyRelayoutId === activeNotifyRelayoutId
    ){
        const callback = globalRelayoutCallbacks[i];
        if(callback && callback()){
            await delay(25);
        }
        i++;
    }
};
window.addEventListener('scroll', notifyRelayout);
window.addEventListener('load', ()=>{
    const observer = new IntersectionObserver(notifyRelayout);
    // Observe any element
    observer.observe(document.getElementsByTagName('body')[0]);
});

export const LazyComponent = ({ 
    children,
    onLoad,
}:{ 
    children: ReactNode,
    onLoad?: () => void,
 })=>{

    const placeholderRef = useRef(null as null | HTMLDivElement);
    const [shouldLoad, setShouldLoad] = useState(false);
    const isDoneRef = useRef(false);

    useEffect(() => {
        if( !placeholderRef.current ){ return; }
        const placeholder = placeholderRef.current;
      
        const loadIfVisible = () => {
            if( !placeholderRef.current ){ return false; }
            if( isDoneRef.current ){return false;}

            const divRect = placeholder.getBoundingClientRect();
            const screenBottom = window.scrollY + window.innerHeight;
            const isOnScreen = divRect.top < screenBottom;

            if(!isOnScreen){ return false; }
            console.log(`isOnScreen`,{ time: Date.now() - debug_timeStart, iRelayout, divRect, screenBottom, isOnScreen });
            
            isDoneRef.current = true;
            unsub();
            setShouldLoad(true);
            notifyRelayout();
            onLoad?.();

            return true;
        };

        const iRelayout = globalRelayoutCallbacks.length;
        globalRelayoutCallbacks.push(loadIfVisible);
        const unsub = ()=>{
            globalRelayoutCallbacks[iRelayout] = null;
        };

        return () => {
            isDoneRef.current = true;
            unsub();
        };
    },[]);

    return (
        <>  
            {!shouldLoad && <div ref={placeholderRef} style={{minWidth: 300, minHeight: 300}}/>}
            {shouldLoad && children}
        </>
    );
};