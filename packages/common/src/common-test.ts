import { INftMetadata } from "./types";
import { promises as fs } from 'fs';

export const testHello = 'Hi!';

/**
 * # Markdown!
 * 
 * https://www.youtube.com/watch?v=O9TNz1-dI-Q
 */
// C:\gitplay\rarity-analyzer\packages\data\odp-collection.json
export async function getTestData(): Promise<INftMetadata[]> {
    const content = await fs.readFile("./data/odp-collection.json", {encoding: 'utf-8' });
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
export function calculateRarity(metadata: INftMetadata[]) {
    const allAttributes = metadata.flatMap(x => x.attributes).filter(x => !!x.value);

    // type NftAttribute = INftMetadata['attributes'][number];
    const allAttributesValuesMap = new Map(allAttributes.map(x=> [x.trait_type, [] as string[]]));
    // console.log('calcRarity', {allAttributesMap});

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
            return {
                valueName,
                count,
                ratio,
                ratioIfDefined,
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
    }));

    console.log('calcRarity', { 
        nft: nftRarities[0].nft.id, 
        rarities: nftRarities[0].attributeRarities,
    });

    return { nftRarities };
} 