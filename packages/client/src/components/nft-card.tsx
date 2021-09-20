import React from 'react';
import { INftRarity } from '@crypto-dev-amigos/common';
import { LazyImage } from './lazy-image';

const getNftUrl = (nftUrl:string) => nftUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');

export const NftCard = ({nft}:{ nft: INftRarity }) => {

    return (
        <>
            <div className={'nft-card'}>
                {/* <div><b>Token ID:</b> {nft.nft.id}</div> */}
                <div><b>{nft.nft.name}</b></div>
                <div><b>Rarity Score:</b> {nft.rarityScore.toFixed(2)}</div>
                <div>
                    <a href={getNftUrl(nft.nft.external_url)}>External Link</a>
                </div>

                <div className={'nft-card-image'}>
                    <LazyImage alt='nft' src={getNftUrl(nft.nft.image)}/>
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

