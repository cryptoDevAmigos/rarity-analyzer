import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { delay } from '../helpers/delay';

let nextLazyComponentId = 0;
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

        const lazyComponentId = nextLazyComponentId++;
      
        const loadComponent = () => {
            if( !placeholderRef.current ){ return; }
            if( isDoneRef.current ){return;}

            console.log(`loadComponent`, {lazyComponentId});
            
            isDoneRef.current = true;
            setShouldLoad(true);
        };


        setTimeout(()=>{
            if( !placeholderRef.current ){ return; }

            const placeholder = placeholderRef.current;
            const observer = new IntersectionObserver((entries, observer)=>{
                if( !placeholderRef.current ){ 
                    observer.unobserve(placeholder);
                    return;
                }

                if(entries.some(x=>x.isIntersecting)){
                    loadComponent();
                    observer.unobserve(placeholder);
                }
            },{
                threshold: 0.1,
            });
            observer.observe(placeholderRef.current);
        }, 100);

        return () => {
            isDoneRef.current = true;
        };
    },[]);

    return (
        <>  
            {!shouldLoad && <div ref={placeholderRef} style={{minWidth: 1000, minHeight: 1000}}/>}
            {shouldLoad && children}
        </>
    );
};