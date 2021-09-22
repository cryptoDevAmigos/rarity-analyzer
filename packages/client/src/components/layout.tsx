import React, { useEffect, useState } from "react";
import { ThemeSubscription } from "../helpers/theme";

export const Layout = ({ children }:{ children:JSX.Element }) => {

    const [isDark, setIsDark] = useState(true);

    useEffect(()=>{
        ThemeSubscription.subscribe(setIsDark);
    },[]);

    return (
        <>
            <div style={{display: 'flex', flexDirection:'row', padding: 8}}>
                <a href="/">
                 <img style={{width: 256}}
                    src={isDark ? '/media/logo_white.png' : '/media/logo_black.png'} alt='site-logo'/>
                </a>
            </div>
            <div>
                {children}
            </div>
        </>
    );
};
