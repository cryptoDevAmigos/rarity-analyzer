import React, { useEffect, useState } from 'react';
import { INftProjectMetadata, INftProjectsDocument } from '@crypto-dev-amigos/common';
import { LazyList } from './lazy-list';
import { NftLoader } from './nft-loader';
import { getIpfsUrl, getProjectsJsonUrl } from '../helpers/urls';
import { LazyComponent } from './lazy-component';
import { changeTheme } from '../helpers/theme';

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
        {projects && <NftProjects projects={projects} />}
    </>
);
};

export const NftProjects = ({ projects }:{ projects: INftProjectsDocument }) => {
    return (
        <>
            <div className='nft-list'>
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
            <div id={targetId} className={'nft-card'}>
                <div><b>{project.name}</b></div>

                <div className={'nft-card-image'} onClick={()=>window.location.href=`${projectKey}`}>
                    {!!project.image && (
                        <LazyComponent>
                            <img alt='nft' src={getIpfsUrl(project.image)}/>
                        </LazyComponent>
                    )}
                </div>

                <div><b>{project.description}</b></div>
            </div>
        </>
    );
};

