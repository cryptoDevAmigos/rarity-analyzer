import React, { useEffect, useState } from 'react';
import { INftProjectMetadata, INftProjectsDocument } from '@crypto-dev-amigos/common';
import { LazyList } from './lazy-list';
import { NftLoader } from './nft-loader';
import { getIpfsUrl, getProjectsJsonUrl } from '../helpers/urls';
import { LazyComponent } from './lazy-component';
import { changeTheme } from '../helpers/theme';
import { SmartImage } from './smart-image';
import { LoadingIndicator } from './icons';
import { ProjectInfo } from './nft-project';

export const NftProjectsLoader = (props:{ })=>{

    const [projects, setProjectRarity] = useState(null as null | INftProjectsDocument);

    useEffect(() => {
        (async () => {
            const nftProjectUrl = getProjectsJsonUrl();
            // console.log('projectKey', { projectKey, nftProjectUrl });
            const result = await fetch(nftProjectUrl);
            const obj = await result.json() as INftProjectsDocument;
            setProjectRarity(obj);
        })();
    }, []);

return (
    <>
        {!projects && <LoadingIndicator/>}
        {projects && <NftProjects projects={projects} />}
    </>
);
};

export const NftProjects = ({ projects }:{ projects: INftProjectsDocument }) => {
    return (
        <>
            <div className='project-list'>
                {projects && (
                    <LazyList items={projects.projects} getItemKey={x=>`${x.projectKey}`} ItemComponent={({item})=>(
                        <NftProjectCard projectKey={item.projectKey} project={item.projectMetadata} />
                    )}/>
                )}
            </div>
        </>
    );
};


export const NftProjectCard = ({projectKey, project}:{ projectKey:string, project: INftProjectMetadata }) => {

    const targetId =  projectKey + '_theme';
    useEffect(()=>{
        changeTheme(project.theme, `#${targetId}`);
    }, [targetId]);

    return (
        <>
            <div id={targetId} className={'nft-card link'} 
                style={{position:'relative'}} 
                onClick={()=>window.location.href=`${projectKey}`}
            >
                {/* Disable Links */}
                <div style={{position:'absolute', top:0, bottom:0, left:0, right: 0, opacity: 0}}></div>
                <ProjectInfo project={project}/>
            </div>
        </>
    );
};

