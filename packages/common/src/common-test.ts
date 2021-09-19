import { INftMetadata, INftRarity } from "./types";
import { promises as fs } from 'fs';

export const testHello = 'Hi!';

/**
 * # Markdown!
 * 
 * https://www.youtube.com/watch?v=O9TNz1-dI-Q
 */

//TODO: Find a way to store ODP data and CP data.  jalil goes over how to get metadata from tokenuri https://www.youtube.com/watch?v=7SUgpK2u-Sk

// C:\gitplay\rarity-analyzer\packages\data\odp-collection.json
export async function getTestData(): Promise<INftMetadata[]> {
    const content = await fs.readFile("../common/data/odp-collection.json", {encoding: 'utf-8' });
    const data = JSON.parse(content) as INftMetadata[];
    return data;
};

export async function getProjectMetadata(location : string): Promise<INftMetadata[]> {
    const content = await fs.readFile(location, {encoding: 'utf-8' });
    const data = JSON.parse(content) as INftMetadata[];
    return data;
};

/**
  ```c#
 var items = await RarityItemCollection.LoadAsync(Path);
 var attributes = items.SelectMany(x => x.Attributes);

 return (from attribute in attributes
    where attribute.Value.Length > 0 // clean out empty values                
    group attribute by attribute.TraitType into g1
    let distinctValues = g1.Select(x => x.Value).Distinct()
    let attributeTraitsTotalCount = attributes.Where(x => x.Value.Length > 0).Select(x => x.Value).Distinct().Count()
    select new ItemAttribute {
        AttributeName = g1.Key,
        AttributeTotalTraits = distinctValues.Count(),
        TraitsCount = attributeTraitsTotalCount,
        Traits = distinctValues.Select(x => new ItemTrait {
            TraitName = x,
            AttributeTraitCount = g1.Count(y => y.Value == x),
            AttributeTraitTotalCount = g1.Count(),
        }).ToList(),
        AttributeTraitTotalCount = g1.Count(),
        AllTraitsCount = attributes.Where(x => x.Value.Length > 0).Count(),
    }).ToList();
 ```
 */
export async function calculateRarity(metadataRaw: INftMetadata[], options?: { includeTraitCount?: boolean }): Promise<INftRarity[]> {
    const { includeTraitCount = true } = options ?? {};

    const metadata = metadataRaw.map(x => ({
        ...x,
        attributes: [
            ...x.attributes, 
            ...includeTraitCount ? [{ trait_type: 'Trait Count', value: `${x.attributes.length}` }] : [] 
        ],
    }));

    const allAttributesRaw = metadata.flatMap(x => x.attributes).filter(x => !!x.value);

    // type NftAttribute = INftMetadata['attributes'][number];
    const allAttributesValuesMapRaw = new Map(allAttributesRaw.map(x=> [x.trait_type, [] as string[]]));
    // console.log('calcRarity', {allAttributesMap});

    metadata.forEach(x => {

        const traitTypes = [...allAttributesValuesMapRaw.keys()];
        const missingTraits = traitTypes
            .filter(a => !x.attributes.some(a2 => a2.trait_type === a))
            .map(a => ({ trait_type: a, value: '[Missing]' }))
            ;

        x.attributes = [
            ...x.attributes,
            ...missingTraits,
        ];
    });

    const allAttributes = metadata.flatMap(x => x.attributes).filter(x => !!x.value);
    const allAttributesValuesMap = new Map(allAttributes.map(x=> [x.trait_type, [] as string[]]));

    allAttributes.forEach(x => {
        const values = allAttributesValuesMap.get(x.trait_type);
        if( !values ){ throw new Error('Missing trait_type'); }
        values.push(x.value);
    });
    // console.log('calcRarity', {allAttributesValuesMap});
    
    const allAttributesValuesDistinct = new Map([...allAttributesValuesMap.entries()].map(([key,value])=>[key, [...new Set(value)]]));
    // console.log('calcRarity', allAttributesValuesDistinct);

    const attributeRarities = [...allAttributesValuesMap.keys()].map(x => {

        const traitType = x;
        const traitDistinctValues = allAttributesValuesDistinct.get(x) ?? [];
        const traitValues = allAttributesValuesMap.get(x) ?? [];

        const valuesCount = traitValues.length;
        const distinctCount = traitDistinctValues.length;
        const valueRarities = traitDistinctValues.map(v => {
            // i.e. Smile (value of Emotion)
            const valueName = v;
            const count = traitValues.filter(t => t === v).length;
            const ratioIfDefined = count / valuesCount;
            const ratio = count / metadata.length;
            const ratioScore = 1 / ratio;
            return {
                valueName,
                count,
                ratio,
                ratioIfDefined,
                ratioScore,
            }
        });

        return {
            traitType,
            valuesCount,
            distinctCount,
            valueRarities,
        };

        
        // ({
        // // AttributeName = g1.Key,
        // // AttributeTotalTraits = distinctValues.Count(),
        // // TraitsCount = attributeTraitsTotalCount,
        // // Traits = distinctValues.Select(x => new ItemTrait {
        // //     TraitName = x,
        // //     AttributeTraitCount = g1.Count(y => y.Value == x),
        // //     AttributeTraitTotalCount = g1.Count(),
        // // }).ToList(),
        // // AttributeTraitTotalCount = g1.Count(),
        // // AllTraitsCount = attributes.Where(x => x.Value.Length > 0).Count(),
    });

    // console.log('calcRarity', { 
    //     emotion: attributeRarities.find(x=>x.traitType === 'Emotion'),
    //     emotionValues: attributeRarities.find(x=>x.traitType === 'Emotion')?.valueRarities
    // });

    const nftRarities = metadata.map(x => ({
        nft: x,
        attributeRarities: x.attributes.map(a => { 
            const traitRarity = attributeRarities.find(r => r.traitType === a.trait_type);
            const valueRarity = traitRarity?.valueRarities.find(v=>v.valueName === a.value);
            return {
                ...a,
                ...valueRarity,
            };
        })
        
        // attributeRarities.filter(a => a.traitType ===  )
    })).map(x => ({
        ...x,
        rarityScore: x.attributeRarities.reduce((out,a) => { out += a.ratioScore ?? 0; return out; }, 0)
    })) as INftRarity[];

    console.log('calcRarity', { 
        nft: nftRarities[0].nft.id, 
        rarityScore: nftRarities[0].rarityScore,
        rarities: nftRarities[0].attributeRarities,
    });

    return nftRarities;
} 