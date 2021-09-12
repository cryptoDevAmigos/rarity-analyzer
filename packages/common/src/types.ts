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