import React, { useEffect, useState } from "react";
import { ThemeSubscription } from "../helpers/theme";
import { Icon } from "./icons";

export const Layout = ({ children }:{ children:JSX.Element }) => {

    const [isDark, setIsDark] = useState(true);

    useEffect(()=>{
        ThemeSubscription.subscribe(setIsDark);
    },[]);

    return (
        <>
            <div className='header' style={{display: 'flex', flexDirection:'row', padding: 8, alignItems:'flex-start'}}>
                <div style={{fontSize: 40, marginRight: 16}}>
                    <a href="/">
                        Open Rarity
                    {/* <img style={{width: 256}}
                        src={isDark ? '/media/logo_white.png' : '/media/logo_black.png'} alt='site-logo'/> */}
                    </a>
                </div>
                <div style={{fontSize: 20}}>
                    <a href="https://github.com/cryptoDevAmigos/rarity-analyzer">
                        <Icon icon='github'/>
                    </a>
                </div>
                <div style={{flex:1}}></div>
            </div>
            <div>
                {children}
            </div>
        </>
    );
};
