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
        }[],
        /** Open sea link */
        permalink:string,
    };

    return json;
};

/** Example Order:
 * 
 * 
 */
const exampleOrder = {
    "created_date": "2021-09-16T20:23:50.536372",
    "closing_date": null,
    "closing_extendable": false,
    "expiration_time": 0,
    "listing_time": 1631823727,
    "order_hash": "0xbf2f687150ee6444c3a63a8f0fd4c18f65a23ca7efb079f83d91c3572e44ce68",
    "metadata": {
        "asset": {
            "id": "4",
            "address": "0x5537d90a4a2dc9d9b37bab49b490cf67d4c54e91"
        },
        "schema": "ERC721"
    },
    "exchange": "0x7be8076f4ea4a4ad08075c2508e481d6c946d12b",
    "maker": {
        "user": {
            "username": "IP20000"
        },
        "profile_img_url": "https://storage.googleapis.com/opensea-static/opensea-profile/2.png",
        "address": "0x351a8d846a01dbd783537df2aae850cf2919abe5",
        "config": ""
    },
    "taker": {
        "user": {
            "username": "NullAddress"
        },
        "profile_img_url": "https://storage.googleapis.com/opensea-static/opensea-profile/1.png",
        "address": "0x0000000000000000000000000000000000000000",
        "config": ""
    },
    "current_price": "150000000000000000",
    "current_bounty": "1500000000000000",
    "bounty_multiple": "0.01",
    "maker_relayer_fee": "750",
    "taker_relayer_fee": "0",
    "maker_protocol_fee": "0",
    "taker_protocol_fee": "0",
    "maker_referrer_fee": "0",
    "fee_recipient": {
        "user": {
            "username": "OS-Wallet"
        },
        "profile_img_url": "https://storage.googleapis.com/opensea-static/opensea-profile/28.png",
        "address": "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
        "config": "verified"
    },
    "fee_method": 1,
    "side": 1,
    "sale_kind": 0,
    "target": "0x5537d90a4a2dc9d9b37bab49b490cf67d4c54e91",
    "how_to_call": 0,
    "calldata": "0x23b872dd000000000000000000000000351a8d846a01dbd783537df2aae850cf2919abe500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004",
    "replacement_pattern": "0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000",
    "static_target": "0x0000000000000000000000000000000000000000",
    "static_extradata": "0x",
    "payment_token": "0x0000000000000000000000000000000000000000",
    "payment_token_contract": {
        "id": 1,
        "symbol": "ETH",
        "address": "0x0000000000000000000000000000000000000000",
        "image_url": "https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg",
        "name": "Ether",
        "decimals": 18,
        "eth_price": "1.000000000000000",
        "usd_price": "3026.789999999999964000"
    },
    "base_price": "150000000000000000",
    "extra": "0",
    "quantity": "1",
    "salt": "9705624739486272129529506929616367068676233907983681506014294982163780059829",
    "v": 28,
    "r": "0xff39941c66195b61595e46d980bd2d63e7f563befacdf5946a15594897be6c17",
    "s": "0x3110ba9fa6dba3bc7292a3faec4d0225722dc02a111c83e9a14f24c78e2d2a9a",
    "approved_on_chain": false,
    "cancelled": false,
    "finalized": false,
    "marked_invalid": false,
    "prefixed_hash": "0xd24bdb201fc29d52a4bef10a9a075d63e4075313def340236e3e7c888eda02ce"
};