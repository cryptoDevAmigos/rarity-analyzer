export interface INftMetadata {
    id: number,
    name: string,
    description: string,
    image: string,
    external_url: string,
    animation_url: string,
    background_color: string,
    attributes: {
            trait_type: string,
            value: string
        }[] 
}

export interface INftProjects {
    name: string,
    token: string,
    contract: string,
    collectionMetadataFile: string,
    collectionRaritiesFile: string
}

export interface INftRarity {
    nft: {
        attributes: {
            trait_type: string;
            value: string;
        }[];
        id: number;
        name: string;
        description: string;
        image: string;
        external_url: string;
        animation_url: string;
        background_color: string;
    };
    attributeRarities: {
        trait_type: string,
        value: string,
        valueName: string,
        count: number,
        ratio: number,
        ratioIfDefined: number, 
        ratioScore: number
    }[];
    rarityScore: number;
    rank: number;
}[]