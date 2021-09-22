import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { getIpfsUrl } from "../helpers/urls";
import { LazyComponent } from "./lazy-component";

export const SmartImage = ({src, alt, style}:{src:undefined |null|string, alt: string, style?: CSSProperties})=>{

    const MAX_ATTEMPTS = 5;

    const [reloadId, setReloadId] = useState(0);

    const attemptsRef = useRef(1);
    attemptsRef.current = reloadId;

    const timeoutRef = useRef(0 as unknown as ReturnType<typeof setTimeout>);

    const onRetry = () => {
        clearTimeout(timeoutRef.current);
        if(attemptsRef.current > MAX_ATTEMPTS){ return; }
    
        onLoadStart();
    };
    const onLoadStart = () => {
        clearTimeout(timeoutRef.current);
        if(attemptsRef.current > MAX_ATTEMPTS){ return; }

        timeoutRef.current = setTimeout(()=>{
            setReloadId(s => s+1);
        }, Math.pow(2, reloadId) * 1000);
    };
    const onLoad = () => {
        clearTimeout(timeoutRef.current);
    };
    useEffect(()=>{
        return ()=>{
            clearTimeout(timeoutRef.current);
        };
    },[]);

    if(!src){ return <></>; }
    return (
        <>
            <LazyComponent>
                <img key={reloadId} alt={alt} style={style} src={getIpfsUrl(src)} onLoadStart={onLoadStart} onLoad={onLoad} onError={onRetry}/>
            </LazyComponent>
        </>
    );
}
