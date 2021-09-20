import React, { useEffect, useRef, useState } from 'react';

export const LazyImage = ({ src, alt }:{ src:string, alt:string })=>{

    const placeholderRef = useRef(null as null | HTMLDivElement);
    const [imageSource, setImageSource] = useState(null as null | string);

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
            setImageSource(src);
            window.removeEventListener('scroll',loadIfVisible);
        };

        window.addEventListener('scroll', loadIfVisible);
        loadIfVisible();

        return () => window.removeEventListener('scroll',loadIfVisible);
    },[src]);

    return (
        <>  
            {!imageSource && <div ref={placeholderRef}/>}
            {imageSource && (
                <img alt={alt} src={imageSource}/>
            )}
        </>
    );
};