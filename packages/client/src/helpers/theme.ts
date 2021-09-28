import { IProjectTheme } from "@crypto-dev-amigos/common";

export const changeTheme = (projectTheme: undefined | null | IProjectTheme, target = ':root') => {

    const toCssName = (key: string)=> key.replace(/[A-Z]/g,(x)=>'-' + x.toLowerCase());

    const isDark = projectTheme?.isDark ?? true;

    const t = projectTheme ?? {} as Record<string,string | boolean>;
    const theme = `
${target} {
    ${Object.keys(t)
        .filter(key => t[key] && typeof t[key] === 'string')
        .map(key => `
    --${toCssName(key)}: ${t[key]};`).join('')}

    --black-or-white: ${isDark ? '#FFFFFF' : '#000000'}
}
    `;

    const themeTagId = '__themeStyleOverride' + target;

    const existing = document.getElementById(themeTagId);
    existing?.remove();
    
    const newElement = document.createElement('style');
    newElement.innerHTML = theme;
    newElement.id = themeTagId;
    document.head.appendChild(newElement);

    ThemeSubscription.changeTheme(isDark);
};


type Callback = (isDark:boolean) => void;
const _callbacks = [] as Callback[];
export const ThemeSubscription = {
    subscribe: (callback: Callback) => {
        _callbacks.push(callback);
    },
    changeTheme: (isDark:boolean)=>{_callbacks.forEach(x=>x(isDark))},
};