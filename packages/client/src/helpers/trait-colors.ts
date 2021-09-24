import { colorFormat } from "./colors";
import { Trait } from "./types";

export const getTraitColor = (trait: Trait, traits:Trait[], tokenCount:number) => {

    const traitTypeIndexMap = new Map([...new Set(traits.map(x=>x.trait_type))].sort().map((x,i)=>[x,i]));
    const traitIndex = traitTypeIndexMap.get(trait.trait_type) ?? 0;

    const h = traitIndex * 71 % 360;
    const s = 100 - Math.floor(75 * trait.tokenIds.length / tokenCount);
    const l = 50;
    return colorFormat.hslToRgb({h,s,l});
};