import React from 'react';
import { AiFillTwitterCircle } from "react-icons/ai";
import { FaDiscord, FaEthereum } from "react-icons/fa";
import { HiLink } from "react-icons/hi";
import { VscChevronDown, VscChevronRight } from "react-icons/vsc";

export type IconName = 
| 'twitter'
| 'discord'
| 'link'
| 'eth'
| 'collapsed'
| 'expanded'
;
export const Icon = ({icon}:{icon:IconName})=>{
    switch(icon){
        case 'twitter': return <AiFillTwitterCircle/>;
        case 'discord': return <FaDiscord/>;
        case 'link': return <HiLink/>;
        case 'eth': return <FaEthereum/>;
        case 'collapsed': return <VscChevronRight/>;
        case 'expanded': return <VscChevronDown/>;
    }

    return <></>;
};