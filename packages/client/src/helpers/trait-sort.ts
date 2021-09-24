import { Trait } from "./types";

export type TraitSortKind = 'rarity' | 'default';
export const sortTraits = (traits:Trait[], traitSort: TraitSortKind) => {

    const t = [...traits]
        .sort((a,b) => a.trait_value.localeCompare(b.trait_value))
        .sort((a,b) => a.trait_type.localeCompare(b.trait_type))
        ;

    if( traitSort === 'rarity'){
        return t.sort((a,b) => a.tokenIds.length - b.tokenIds.length);
    }

    return t;
};