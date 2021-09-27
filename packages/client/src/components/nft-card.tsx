import React from 'react';
import { INftRarity } from '@crypto-dev-amigos/common';
import { LazyComponent } from './lazy-component';
import { getIpfsUrl } from '../helpers/urls';
import { BarGraphCell } from './bar-graph';
import { Icon, IconLink, LoadingIndicator } from './icons';
import { SmartImage } from './smart-image';
import { OnSelectTraitValue } from './types';

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

const Price = ({price}:{price?: {
    price: number;
    symbol?: string;
    priceUsd?: number;
}}) => {
    
    if(!price){ return <span>{'-?-'}</span>}

    return (
        <>
            <div style={{display:'inline-block', minWidth: 100}}>
                <span>{price.price.toFixed(3)}</span>
                {price.symbol && (
                    price.symbol.toLowerCase() === 'eth' ? <span className='black-or-white'><Icon icon='eth'/></span> 
                    : price.symbol.toLowerCase() === 'weth' ? <span style={{color: '#ca477b'}}><Icon icon='eth'/></span> 
                    : <span>{price.symbol}</span>
                )}
            </div>
            <div style={{display:'inline-block', minWidth: 100}}>
                <span>{price.priceUsd ? ` $${price.priceUsd.toFixed(2)}`:''}</span>
            </div>
        </>
    );
}

export const NftCardPlaceholder = (props:{})=>{
    return (
        <>
            <div className={'nft-card'}>
                <LoadingIndicator/>
                <div style={{height: 300}}></div>
            </div>
        </>
    );
}

export const NftCard = ({nft, onSelect}:{ nft: INftRarityWithExtra, onSelect?: OnSelectTraitValue }) => {

    return (
        <>
            <div className={'nft-card'}>
                <div className='nft-card-header'>
                    <div className='nft-card-header-item'>
                        <div className='nft-card-header-item-label'>Rarity Score:</div>
                        <div className='nft-card-header-item-value'>{nft.rarityScore.toFixed(2)}</div>
                    </div>
                    <div className='nft-card-header-item'>
                        <div className='nft-card-header-item-label'>Rank:</div>
                        <div className='nft-card-header-item-value'>{nft.rank}</div>
                    </div>
                    <div className='nft-card-header-item-2'>
                        <div className='nft-card-header-item-label'>Last Sell:</div>
                        <div className='nft-card-header-item-value'><Price price={nft.lastSell}/></div>
                    </div>
                    <div className='nft-card-header-item-2'>
                        <div className='nft-card-header-item-label'>Listing:</div>
                        <div className='nft-card-header-item-value'><Price price={nft.listing}/></div>
                    </div>
                    <div className='nft-card-header-token-id'>TokenId: {nft.nft.id}</div>
                    <div className='nft-card-header-title'>{nft.nft.name}</div>
                </div>

                <div className='nft-card-content'>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-end'}}>
                        <IconLink url={nft.nft.external_url} icon='link'/>
                        <IconLink url={nft.openSeaLink} iconUrl='/media/opensea.png'/>
                    </div>
                    <div className={'nft-card-image'}>
                        <SmartImage alt='nft' src={nft.nft.image}/>
                    </div>

                    <div className='nft-card-stats'>
                        <div className='nft-card-stats-row nft-card-stats-title' style={{ fontSize:`0.8em` }}>
                            <div className='nft-card-stats-cell' style={{textAlign:'left'}}>{'Trait'}</div>
                            <div className='nft-card-stats-cell' style={{textAlign:'right'}}>{'Rarity Score'}</div>
                        </div>
                        <div className='nft-card-stats-row nft-card-stats-title' style={{ fontSize:`0.8em` }}>
                            <div className='nft-card-stats-cell' style={{textAlign:'right'}}>{''}</div>
                            <div className='nft-card-stats-cell'>{'Commonality'}</div>
                        </div>
                        {nft.attributeRarities.map(x=>(
                            <React.Fragment key={x.trait_type}>
                                <div className='nft-card-stats-row'>
                                    <div className='nft-card-stats-cell nft-card-stats-title' style={{textAlign:'left'}}>{x.trait_type}</div>
                                    <div className='nft-card-stats-cell numeric-value' style={{textAlign:'right'}}>{`${x.ratioScore.toFixed(2)}`}</div>  
                                </div>
                                <div className='nft-card-stats-row'>
                                    <div className={`nft-card-stats-cell ${onSelect?'link':''}`} style={{textAlign:'right'}}>
                                        <span 
                                            onClick={(e) => {
                                                if(!onSelect){return;}

                                                e.preventDefault();
                                                e.stopPropagation();
                                                onSelect({traitType: x.trait_type, value: x.value});
                                            }}
                                            style={x.value !== "[Missing]"?{fontWeight:'bold'}:{}}>{x.value}</span>
                                    </div>
                                    <div className='nft-card-stats-cell numeric-value'>
                                        <BarGraphCell ratio={x.ratio} />
                                    </div>                              
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

