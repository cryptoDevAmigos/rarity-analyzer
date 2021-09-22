import { IProjectTheme } from "@crypto-dev-amigos/common";

export const changeTheme = (projectTheme: undefined | null | IProjectTheme) => {

    const toCssName = (key: string)=> key.replace(/[A-Z]/g,(x)=>'-' + x.toLowerCase());

    const t = projectTheme ?? {} as Record<string,string | boolean>;
    const theme = `
:root {
    ${Object.keys(t)
        .filter(key => t[key] && typeof t[key] === 'string')
        .map(key => `
    --${toCssName(key)}: ${t[key]};`).join('')}
}
    `;

    const themeTagId = '__themeStyleOverride';

    const existing = document.getElementById(themeTagId);
    existing?.remove();
    
    const newElement = document.createElement('style');
    newElement.innerHTML = theme;
    newElement.id = themeTagId;
    document.head.appendChild(newElement);

    ThemeSubscription.changeTheme(projectTheme?.isDark ?? true);
};


type Callback = (isDark:boolean) => void;
const _callbacks = [] as Callback[];
export const ThemeSubscription = {
    subscribe: (callback: Callback) => {
        _callbacks.push(callback);
    },
    changeTheme: (isDark:boolean)=>{_callbacks.forEach(x=>x(isDark))},
};