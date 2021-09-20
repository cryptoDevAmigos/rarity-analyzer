import React from 'react';
import { INftRarity } from '@crypto-dev-amigos/common';
import { LazyComponent } from './lazy-component';
import { getIpfsUrl } from '../helpers/urls';
import { BarGraphCell } from './bar-graph';

export type INftRarityWithExtra = INftRarity & {
    openSeaLink?: string;
    lastSell?: {
        price: number;
        symbol?: string;
        priceUsd?: number;
    },
    listing?: {
        price: number;
        symbol?: string;
        priceUsd?: number;
    },
};

const formatPrice = (x?: {
    price: number;
    symbol?: string;
    priceUsd?: number;
}) => x ? `${x.price.toFixed(3)}${x.symbol??''}${x.priceUsd ? ` $${x.priceUsd.toFixed(2)}`:''}` : ' -?- '

export const NftCardPlaceholder = (props:{})=>{
    return (
        <>
            <div className={'nft-card'}>
                <div style={{height: 300}}>Loading...</div>
            </div>
        </>
    );
}

export const NftCard = ({nft}:{ nft: INftRarityWithExtra }) => {

    return (
        <>
            <div className={'nft-card'}>
                {/* <div><b>Token ID:</b> {nft.nft.id}</div> */}
                <div><b>{nft.nft.name}</b></div>
                <div><b>Rarity Score:</b> {nft.rarityScore.toFixed(2)}</div>
                <div><b>Listing:</b> {formatPrice(nft.listing)}</div>
                <div><b>Last Sell:</b> {formatPrice(nft.lastSell)}</div>
                <div>
                    <a href={getIpfsUrl(nft.nft.external_url)}>External Link</a>
                </div>
                <div>
                    {!!nft.openSeaLink && <a href={nft.openSeaLink}>Open Sea</a>}
                    {!nft.openSeaLink && <span>Open Sea - Not Found</span>}
                </div>

                <div className={'nft-card-image'}>
                    <LazyComponent>
                        <img alt='nft' src={getIpfsUrl(nft.nft.image)}/>
                    </LazyComponent>
                </div>
                <div>
                    <div style={{ display:'flex', flexDirection:'row', fontSize:`0.8em`, color: 'white' }}>
                                <div style={{flex: 1}}>{'Content'}</div>
                                <div style={{flex: 1}}>{'Attribute'}</div>
                                <div style={{flex: 1}}>{'Commonality'}</div>
                                <div style={{flex: 1}}>{'Rarity Score'}</div>
                    </div>
                    {nft.attributeRarities.map(x=>(
                        <React.Fragment key={x.trait_type}>
                            <div style={{ display:'flex', flexDirection:'row' }}>
                                <div style={{flex: 1}}>{x.trait_type}</div>
                                <div style={{flex: 1}}>
                                    <span style={x.value !== "[Missing]"?{fontWeight:'bold'}:{}}>{x.value}</span>
                                </div>
                                <div style={{flex: 1}}>
                                    <BarGraphCell ratio={x.ratio} />
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

