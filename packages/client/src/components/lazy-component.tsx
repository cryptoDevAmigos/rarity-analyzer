import React, { ReactNode, useEffect, useRef, useState } from 'react';

export const LazyComponent = ({ 
    children,
}:{ 
    children: ReactNode
 })=>{

    const placeholderRef = useRef(null as null | HTMLDivElement);
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(()=>{
        const loadIfVisible = () => {
            if( !placeholderRef.current ){ return; }

            const div = placeholderRef.current;
            const divRect = div.getBoundingClientRect();
            const screenBottom = window.scrollY + window.innerHeight;
            const isOnScreen = divRect.top < screenBottom;

            console.log(`isOnScreen`,{ divRect, screenBottom, isOnScreen });

            if(!isOnScreen){ return; }

            // Load image
            setShouldLoad(true);
            window.removeEventListener('scroll',loadIfVisible);
        };

        window.addEventListener('scroll', loadIfVisible);
        loadIfVisible();

        return () => window.removeEventListener('scroll',loadIfVisible);
    },[]);

    return (
        <>  
            {!shouldLoad && <div ref={placeholderRef}/>}
            {shouldLoad && children}
        </>
    );
};