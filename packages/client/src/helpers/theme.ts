import { IProjectTheme } from "@crypto-dev-amigos/common";

export const changeTheme = (projectTheme: undefined | null | IProjectTheme) => {

    const toCssName = (key: string)=> key.replace(/[A-Z]/g,(x)=>'_' + x.toLowerCase());

    const t = projectTheme ?? {} as Record<string,string>;
    const theme = `
:root {
    ${Object.keys(t).map(key => `
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
};