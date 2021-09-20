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
const observer = new IntersectionObserver(notifyRelayout);

export const LazyComponent = ({ 
    children,
}:{ 
    children: ReactNode,
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

            return true;
        };

        const iRelayout = globalRelayoutCallbacks.length;
        globalRelayoutCallbacks.push(loadIfVisible);
        observer.observe(placeholder);
        const unsub = ()=>{
            globalRelayoutCallbacks[iRelayout] = null;
            observer.unobserve(placeholder);
        };

        return () => {
            isDoneRef.current = true;
            unsub();
        };
    },[]);

    return (
        <>  
            {!shouldLoad && <div ref={placeholderRef} style={{minWidth: 1000, minHeight: 1000}}/>}
            {shouldLoad && children}
        </>
    );
};