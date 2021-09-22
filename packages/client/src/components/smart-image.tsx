import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { getIpfsUrl } from "../helpers/urls";
import { LoadingIndicator } from "./icons";
import { LazyComponent } from "./lazy-component";

export const SmartImage = ({src, alt, style}:{src:undefined |null|string, alt: string, style?: CSSProperties})=>{

    const MAX_ATTEMPTS = 5;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const attemptsRef = useRef(1);

    const timeoutRef = useRef(0 as unknown as ReturnType<typeof setTimeout>);

    const onRetry = () => {
        clearTimeout(timeoutRef.current);
        if(attemptsRef.current > MAX_ATTEMPTS){ return; }
    
        setError(true);
        onLoadStart();
    };
    const onLoadStart = () => {
        clearTimeout(timeoutRef.current);
        if(attemptsRef.current > MAX_ATTEMPTS){ return; }

        timeoutRef.current = setTimeout(()=>{
            attemptsRef.current++;
            setError(false);
        }, Math.pow(2, attemptsRef.current) * 1000);
    };
    const onLoad = () => {
        clearTimeout(timeoutRef.current);
        setLoading(false);
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
                {loading && (<LoadingIndicator/>)}
                {!error && (
                    <img key={attemptsRef.current} alt={alt} style={style} src={getIpfsUrl(src)} onLoadStart={onLoadStart} onLoad={onLoad} onError={onRetry}/>
                )}
            </LazyComponent>
        </>
    );
}
