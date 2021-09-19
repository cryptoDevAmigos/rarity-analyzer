import React from 'react';
import { INftRarity } from '@crypto-dev-amigos/common';

export const NftCard = ({nft}:{ nft: INftRarity }) => {

    return (
        <>
            <div className={'nft-card'}>
                {/* <div><b>Token ID:</b> {nft.nft.id}</div> */}
                <div><b>{nft.nft.name}</b></div>
                <div><b>Rarity Score:</b> {nft.rarityScore.toFixed(2)}</div>
                <div>
                    <a href={nft.nft.external_url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}>External Link</a>
                </div>
                <div>
                    <img 
                        style={{width: 150, height: 150}}
                        src={nft.nft.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}
                    />
                </div>
                <div>
                    <div style={{ display:'flex', flexDirection:'row', fontSize:`0.8em`, color: 'white' }}>
                                <div style={{flex: 1}}>{'Content'}</div>
                                <div style={{flex: 1}}>{'Attribute'}</div>
                                <div style={{flex: 1}}>{'Percentile'}</div>
                                <div style={{flex: 1}}>{'Rarity Score'}</div>
                    </div>
                    {nft.attributeRarities.map(x=>(
                        <React.Fragment key={x.trait_type}>
                            <div style={{ display:'flex', flexDirection:'row' }}>
                                <div style={{flex: 1}}>{x.trait_type}</div>
                                <div style={{flex: 1}}>
                                    <span style={x.value !== "[Missing]"?{fontWeight:'bold'}:{}}>{x.value}</span>
                                </div>
                                <div style={{flex: 1, position:'relative'}}>
                                    <div className='bar-background' style={{
                                        position:'absolute',
                                        zIndex: 0,
                                        width: `${(100 * x.ratio).toFixed(0)}%`,
                                        height: '100%',
                                        }}>
                                    </div>
                                    <div style={{color:'#FFFFFF', position:'relative', zIndex: 10}}>
                                        {`${(100 * x.ratio).toFixed(2)}%`}
                                    </div>
                                </div>
                                <div style={{flex: 1}}>{`${x.ratioScore.toFixed(2)}`}</div>                                
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </>
    );
};