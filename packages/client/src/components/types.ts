export const ALL_TRAIT_VALUE ='[All]';
export type TraitFilters = { [traitType: string]: { value:string, tokenIdsIfAll: Set<number> } };
export type OnSelectTraitValue = (args:{ traitType: string, value: string }) => void;