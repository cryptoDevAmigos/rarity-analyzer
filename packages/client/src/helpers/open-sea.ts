export const getOpenSeaData = async ({contractAddress, tokenId}: {contractAddress:string, tokenId:string})=>{

    const openSeaUrl = `https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}/`;
    const result = await fetch(openSeaUrl);
    const json = await result.json() as {
        token_id: string,
        num_sales?: number,    
        last_sale?: {
            /** BigNumber */
            total_price: string,
            payment_token: {
                symbol: string,
                decimals: number,
                usd_price: string,
            },
        },
        orders?: {
            current_price: string,
            payment_token_contract: {
                symbol: string,
                decimals: number,
                usd_price: string,
            },
            /** 
             * - 1 for buy orders 
             * - 1 for sell orders 
             * */
            side: 0|1,
        }[],
        /** Open sea link */
        permalink:string,
    };

    return json;
};
