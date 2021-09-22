export interface INftMetadata {
    // TODO: This should be a string because some tokenIds can be > int (the actual type is unit256)
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
/** Source Json Document that contains the nft metadata for every token 
 *  
 * `[projectName].collection.json`
 * 
*/
export type INftMetadataCollectionDocument = INftMetadata[];

/** Source Json Document that contains the nft metadata for every token 
 * 
 * `[projectName].project.json`
 * 
*/
export interface INftProjectMetadata {
    name: string,
    symbol: string,
    description: string,
    image: string,
    external_link: string,
    contract: string,
    theme?: IProjectTheme;
    links?: IProjectLinks;
}
export type INftProjectMetadataDocument = INftProjectMetadata;

export type IProjectLinks = Record<string,string> & {
    openSea?: string;
    discord?: string;
    twitter?: string;
};

export type IProjectTheme = {
    back?: string;
    primary?: string;
    secondary?: string;
    highlight?: string;
    borderWidth?: string;
    borderRadius?: string;
    boxShadowWidth?: string;
    boxShadowBlur?: string;
}
const exampleTheme: IProjectTheme = {
    back: '#EEEEFF',
    primary: '#FF00AE',
    secondary: '#0062F9',
    highlight: '#000000',
    borderWidth: '2px',
    borderRadius: '8px',
    boxShadowWidth: '8px',
    boxShadowBlur: '2px',
};

export type INftProjectsDocument = {
    projects: {
        projectKey: string;
        projectMetadata: INftProjectMetadata;
    }[];
};

/** The output json document with project information */
export type INftProjectRarityDocument = {
    project: INftProjectMetadataDocument;
    // tokens: INftRaritySummary[];
    tokenIdsByRank: number[];
    tokenLookups: {
        trait_type: string;
        trait_value: string;
        tokenIds: number[];
    }[];
}

/** Index data about nfts in order to support sorting, filtering while reducing file size */
export type INftRaritySummary = {
    // Needed to sort by token id
    tokenId: number;
    // Needed to sort by rank (same as score)
    rank: number;
    /** Condensed to reduce file size
     * - Filter by trait_type (not missing): `${trait_type}:`
     * - Filter by trait_type & value: `${trait_type}:${value}:`
     */
    attributes: NftAttributeSummary_Condensed[];
};

export type NftAttributeSummary = {
    trait_type: string,
    value: string,
    // Needed to sort by attribute score
    ratioScore: number,
};
export type NftAttributeSummary_Condensed = `${string}:${string}:${number}`;

export const NftAttributes = {
    condense: (attribute: NftAttributeSummary): NftAttributeSummary_Condensed => {
        return `${attribute.trait_type}:${attribute.value}:${attribute.ratioScore.toFixed(2)}` as NftAttributeSummary_Condensed;
    },
    expand: (attribute: NftAttributeSummary_Condensed): NftAttributeSummary => {
        const parts = attribute.split(':');
        return {
            trait_type: parts[0],
            value: parts[1],
            ratioScore: parseFloat(parts[2]),
        };
    }
};

export const MISSING_ATTRIBUTE_VALUE = '[Missing]'
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
        count: number,
        ratio: number,
        ratioScore: number,
    }[];
    rarityScore: number;
    rank: number;
}[]

/** The output json document with single nft token results */
export type INftRarityDocument = INftRarity;

/** The output json document with all nft token results for a project */
export type INftRarityCollectionDocument = INftRarity[];