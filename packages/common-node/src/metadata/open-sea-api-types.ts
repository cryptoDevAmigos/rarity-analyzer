
export const openSeaRequest_getContract = {
    url: 'https://api.opensea.io/api/v1/asset_contract/{contractAddress}',
    params: {
      contractAddress: '{contractAddress}'
    },
    __exampleResponse: {
        "collection": {
          "banner_image_url": "https://storage.opensea.io/static/banners/cryptokitties-banner2.png",
          "chat_url": null,
          "created_date": "2019-04-26T22:13:04.207050",
          "default_to_fiat": false,
          "description": "CryptoKitties is a game centered around breedable, collectible, and oh-so-adorable creatures we call CryptoKitties! Each cat is one-of-a-kind and 100% owned by you; it cannot be replicated, taken away, or destroyed.",
          "dev_buyer_fee_basis_points": "0",
          "dev_seller_fee_basis_points": "0",
          "discord_url": "https://discord.gg/cryptokitties",
          "display_data": {
            "card_display_style": "padded"
          },
          "external_url": "https://www.cryptokitties.co/",
          "featured": false,
          "featured_image_url": "https://storage.opensea.io/0x06012c8cf97bead5deae237070f9587f8e7a266d-featured-1556589429.png",
          "hidden": false,
          "safelist_request_status": "verified",
          "image_url": "https://lh3.googleusercontent.com/C272ZRW1RGGef9vKMePFSCeKc1Lw6U40wl9ofNVxzUxFdj84hH9xJRQNf-7wgs7W8qw8RWe-1ybKp-VKuU5D-tg=s60",
          "is_subject_to_whitelist": false,
          "large_image_url": "https://lh3.googleusercontent.com/C272ZRW1RGGef9vKMePFSCeKc1Lw6U40wl9ofNVxzUxFdj84hH9xJRQNf-7wgs7W8qw8RWe-1ybKp-VKuU5D-tg",
          "medium_username": null,
          "name": "CryptoKitties",
          "only_proxied_transfers": false,
          "opensea_buyer_fee_basis_points": "0",
          "opensea_seller_fee_basis_points": "250",
          "payout_address": null,
          "require_email": false,
          "short_description": null,
          "slug": "cryptokitties",
          "telegram_url": null,
          "twitter_username": "CryptoKitties",
          "instagram_username": null,
          "wiki_url": "https://opensea.readme.io/page/cryptokitties"
        },
        "address": "0x06012c8cf97bead5deae237070f9587f8e7a266d",
        "asset_contract_type": "non-fungible",
        "created_date": "2018-01-23T04:51:38.832339",
        "name": "CryptoKitties",
        "nft_version": "1.0",
        "opensea_version": null,
        "owner": 463841,
        "schema_name": "ERC721",
        "symbol": "CKITTY",
        "total_supply": null,
        "description": "CryptoKitties is a game centered around breedable, collectible, and oh-so-adorable creatures we call CryptoKitties! Each cat is one-of-a-kind and 100% owned by you; it cannot be replicated, taken away, or destroyed.",
        "external_link": "https://www.cryptokitties.co/",
        "image_url": "https://lh3.googleusercontent.com/C272ZRW1RGGef9vKMePFSCeKc1Lw6U40wl9ofNVxzUxFdj84hH9xJRQNf-7wgs7W8qw8RWe-1ybKp-VKuU5D-tg=s60",
        "default_to_fiat": false,
        "dev_buyer_fee_basis_points": 0,
        "dev_seller_fee_basis_points": 0,
        "only_proxied_transfers": false,
        "opensea_buyer_fee_basis_points": 0,
        "opensea_seller_fee_basis_points": 250,
        "buyer_fee_basis_points": 0,
        "seller_fee_basis_points": 250,
        "payout_address": null
      }
};

export const openSeaRequest_getNft = {
  url: `https://api.opensea.io/api/v1/asset/{contractAddress}/{tokenId}/`,
  params: {
    contractAddress: `{contractAddress}`,
    tokenId: `{tokenId}`,
  },
  __exampleResponse:{
    "id": 158831,
    "token_id": "1",
    "num_sales": 3,
    "background_color": null,
    "image_url": "https://lh3.googleusercontent.com/7bRocEaoBrWYBX3vThkHj4kAV3b3mKG-Kem85xeT-D8oHpvQ19kcoiBd9mIFeNU0GrwZGvj6Oc5NAEGBSsGlrww",
    "image_preview_url": "https://lh3.googleusercontent.com/7bRocEaoBrWYBX3vThkHj4kAV3b3mKG-Kem85xeT-D8oHpvQ19kcoiBd9mIFeNU0GrwZGvj6Oc5NAEGBSsGlrww=s250",
    "image_thumbnail_url": "https://lh3.googleusercontent.com/7bRocEaoBrWYBX3vThkHj4kAV3b3mKG-Kem85xeT-D8oHpvQ19kcoiBd9mIFeNU0GrwZGvj6Oc5NAEGBSsGlrww=s128",
    "image_original_url": "https://www.larvalabs.com/cryptopunks/cryptopunk1.png",
    "animation_url": null,
    "animation_original_url": null,
    "name": "CryptoPunk #1",
    "description": null,
    "external_link": "https://www.larvalabs.com/cryptopunks/details/1",
    "asset_contract": {
      "address": "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
      "asset_contract_type": "non-fungible",
      "created_date": "2018-01-23T04:51:38.832339",
      "name": "CryptoPunks",
      "nft_version": "unsupported",
      "opensea_version": null,
      "owner": null,
      "schema_name": "CRYPTOPUNKS",
      "symbol": "PUNK",
      "total_supply": null,
      "description": "CryptoPunks launched as a fixed set of 10,000 items in mid-2017 and became one of the inspirations for the ERC-721 standard. They have been featured in places like The New York Times, Christie’s of London, Art|Basel Miami, and The PBS NewsHour.",
      "external_link": "https://www.larvalabs.com/cryptopunks",
      "image_url": "https://lh3.googleusercontent.com/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE=s120",
      "default_to_fiat": false,
      "dev_buyer_fee_basis_points": 0,
      "dev_seller_fee_basis_points": 0,
      "only_proxied_transfers": false,
      "opensea_buyer_fee_basis_points": 0,
      "opensea_seller_fee_basis_points": 250,
      "buyer_fee_basis_points": 0,
      "seller_fee_basis_points": 250,
      "payout_address": null
    },
    "permalink": "https://opensea.io/assets/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/1",
    "collection": {
      "payment_tokens": [
        {
          "id": 13689077,
          "symbol": "ETH",
          "address": "0x0000000000000000000000000000000000000000",
          "image_url": "https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg",
          "name": "Ether",
          "decimals": 18,
          "eth_price": 1,
          "usd_price": 3078.95
        },
        {
          "id": 12182941,
          "symbol": "DAI",
          "address": "0x6b175474e89094c44da98b954eedeac495271d0f",
          "image_url": "https://storage.opensea.io/files/8ef8fb3fe707f693e57cdbfea130c24c.svg",
          "name": "Dai Stablecoin",
          "decimals": 18,
          "eth_price": 0.00032617,
          "usd_price": 1
        },
        {
          "id": 4645681,
          "symbol": "WETH",
          "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          "image_url": "https://storage.opensea.io/files/accae6b6fb3888cbff27a013729c22dc.svg",
          "name": "Wrapped Ether",
          "decimals": 18,
          "eth_price": 1,
          "usd_price": 3078.95
        },
        {
          "id": 4403908,
          "symbol": "USDC",
          "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          "image_url": "https://storage.opensea.io/files/749015f009a66abcb3bbb3502ae2f1ce.svg",
          "name": "USD Coin",
          "decimals": 6,
          "eth_price": 0.000551436563967,
          "usd_price": 1
        }
      ],
      "primary_asset_contracts": [
        {
          "address": "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
          "asset_contract_type": "non-fungible",
          "created_date": "2018-01-23T04:51:38.832339",
          "name": "CryptoPunks",
          "nft_version": "unsupported",
          "opensea_version": null,
          "owner": null,
          "schema_name": "CRYPTOPUNKS",
          "symbol": "PUNK",
          "total_supply": null,
          "description": "CryptoPunks launched as a fixed set of 10,000 items in mid-2017 and became one of the inspirations for the ERC-721 standard. They have been featured in places like The New York Times, Christie’s of London, Art|Basel Miami, and The PBS NewsHour.",
          "external_link": "https://www.larvalabs.com/cryptopunks",
          "image_url": "https://lh3.googleusercontent.com/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE=s120",
          "default_to_fiat": false,
          "dev_buyer_fee_basis_points": 0,
          "dev_seller_fee_basis_points": 0,
          "only_proxied_transfers": false,
          "opensea_buyer_fee_basis_points": 0,
          "opensea_seller_fee_basis_points": 250,
          "buyer_fee_basis_points": 0,
          "seller_fee_basis_points": 250,
          "payout_address": null
        }
      ],
      "traits": {},
      "stats": {
        "one_day_volume": 1066.19,
        "one_day_change": -0.447200460411363,
        "one_day_sales": 9,
        "one_day_average_price": 118.46555555555557,
        "seven_day_volume": 14038.75,
        "seven_day_change": -0.08233747625565578,
        "seven_day_sales": 117,
        "seven_day_average_price": 119.98931623931624,
        "thirty_day_volume": 92560.434999999,
        "thirty_day_change": -0.5688775179749109,
        "thirty_day_sales": 718,
        "thirty_day_average_price": 128.9142548746504,
        "total_volume": 515721.431601423,
        "total_sales": 17148,
        "total_supply": 9999,
        "count": 9999,
        "num_owners": 3107,
        "average_price": 30.07472775842215,
        "num_reports": 17,
        "market_cap": 1199773.173076923,
        "floor_price": 0
      },
      "banner_image_url": "https://lh3.googleusercontent.com/48oVuDyfe_xhs24BC2TTVcaYCX7rrU5mpuQLyTgRDbKHj2PtzKZsQ5qC3xTH4ar34wwAXxEKH8uUDPAGffbg7boeGYqX6op5vBDcbA=s2500",
      "chat_url": null,
      "created_date": "2019-04-26T22:13:09.691572",
      "default_to_fiat": false,
      "description": "CryptoPunks launched as a fixed set of 10,000 items in mid-2017 and became one of the inspirations for the ERC-721 standard. They have been featured in places like The New York Times, Christie’s of London, Art|Basel Miami, and The PBS NewsHour.",
      "dev_buyer_fee_basis_points": "0",
      "dev_seller_fee_basis_points": "0",
      "discord_url": "https://discord.gg/tQp4pSE",
      "display_data": {
        "card_display_style": "cover"
      },
      "external_url": "https://www.larvalabs.com/cryptopunks",
      "featured": false,
      "featured_image_url": "https://storage.opensea.io/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb-featured-1556589448.png",
      "hidden": false,
      "safelist_request_status": "verified",
      "image_url": "https://lh3.googleusercontent.com/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE=s120",
      "is_subject_to_whitelist": false,
      "large_image_url": "https://lh3.googleusercontent.com/QB2kKuQEw04X02V9EoC2BNYZV652LYuewUv9ZdR7KJfI9Jocwmd28jIfsGg0umSCr2bOMV8O9UpLAkoaqfYwvwmC",
      "medium_username": null,
      "name": "CryptoPunks",
      "only_proxied_transfers": false,
      "opensea_buyer_fee_basis_points": "0",
      "opensea_seller_fee_basis_points": "250",
      "payout_address": null,
      "require_email": false,
      "short_description": null,
      "slug": "cryptopunks",
      "telegram_url": null,
      "twitter_username": "larvalabs",
      "instagram_username": null,
      "wiki_url": null
    },
    "decimals": null,
    "token_metadata": "",
    "owner": {
      "user": null,
      "profile_img_url": "https://storage.googleapis.com/opensea-static/opensea-profile/32.png",
      "address": "0xb88f61e6fbda83fbfffabe364112137480398018",
      "config": ""
    },
    "sell_orders": null,
    "creator": {
      "user": null,
      "profile_img_url": "https://storage.googleapis.com/opensea-static/opensea-profile/22.png",
      "address": "0xc352b534e8b987e036a93539fd6897f53488e56a",
      "config": ""
    },
    "traits": [
      {
        "trait_type": "type",
        "value": "Male",
        "display_type": null,
        "max_value": null,
        "trait_count": 6039,
        "order": null
      },
      {
        "trait_type": "accessory",
        "value": "Mohawk",
        "display_type": null,
        "max_value": null,
        "trait_count": 441,
        "order": null
      },
      {
        "trait_type": "accessory",
        "value": "Smile",
        "display_type": null,
        "max_value": null,
        "trait_count": 238,
        "order": null
      }
    ],
    "last_sale": {
      "asset": {
        "token_id": "1",
        "decimals": null
      },
      "asset_bundle": null,
      "event_type": "successful",
      "event_timestamp": "2020-11-30T18:44:26",
      "auction_type": null,
      "total_price": "60000000000000000000",
      "payment_token": {
        "id": 1,
        "symbol": "ETH",
        "address": "0x0000000000000000000000000000000000000000",
        "image_url": "https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg",
        "name": "Ether",
        "decimals": 18,
        "eth_price": "1.000000000000000",
        "usd_price": "3077.449999999999818000"
      },
      "transaction": {
        "block_hash": "0xe3eacbc6f4d6bb43525b69baffe09477f452f0f5e1a5b1d5232dc23b6cb176cb",
        "block_number": "11361817",
        "from_account": {
          "user": {
            "username": "GoWestBTC"
          },
          "profile_img_url": "https://storage.googleapis.com/opensea-static/opensea-profile/4.png",
          "address": "0xee3766e4f996dc0e0f8c929954eaafef3441de87",
          "config": ""
        },
        "id": 63641091,
        "timestamp": "2020-11-30T18:44:26",
        "to_account": {
          "user": null,
          "profile_img_url": "https://storage.googleapis.com/opensea-static/opensea-profile/23.png",
          "address": "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
          "config": ""
        },
        "transaction_hash": "0xf4af5563f3c4c3b26dee3ab027902f113bee5985b28d9ede5b81ab42b46abb30",
        "transaction_index": "58"
      },
      "created_date": "2020-11-30T18:45:11.476313",
      "quantity": "1"
    },
    "top_bid": null,
    "listing_date": null,
    "is_presale": false,
    "transfer_fee_payment_token": null,
    "transfer_fee": null,
    "related_assets": [],
    "orders": [],
    "auctions": [],
    "supports_wyvern": false,
    "top_ownerships": [
      {
        "owner": {
          "user": null,
          "profile_img_url": "https://storage.googleapis.com/opensea-static/opensea-profile/32.png",
          "address": "0xb88f61e6fbda83fbfffabe364112137480398018",
          "config": ""
        },
        "quantity": "1"
      }
    ],
    "ownership": null,
    "highest_buyer_commitment": null
  },
}

export const openSeaRequest_getContractNfts = {
  url: `https://api.opensea.io/api/v1/assets?asset_contract_address={contractAddress}&order_direction=desc&offset={offset}&limit=50`,
  params: {
    contractAddress: `{contractAddress}`,
    offset: `{offset}`,
  },
  __exampleResponse: {
    "assets": [
      {
        "id": 60580024,
        "token_id": "4775",
        "num_sales": 0,
        "background_color": null,
        "image_url": "",
        "image_preview_url": null,
        "image_thumbnail_url": null,
        "image_original_url": null,
        "animation_url": null,
        "animation_original_url": null,
        "name": null,
        "description": null,
        "external_link": null,
        "asset_contract": {
          "address": "0x51ae5e2533854495f6c587865af64119db8f59b4",
          "asset_contract_type": "non-fungible",
          "created_date": "2021-09-24T19:19:16.457454",
          "name": "PunkScape",
          "nft_version": "3.0",
          "opensea_version": null,
          "owner": 72862837,
          "schema_name": "ERC721",
          "symbol": "PS",
          "total_supply": "10000",
          "description": "10k little landscapes that punks can inhabit – on the Ethereum Blockchain.\n\nMinting is still ongoing (Website or Etherscan).",
          "external_link": "https://punkscape.xyz",
          "image_url": "https://lh3.googleusercontent.com/zfQ0Ejqq61FjbrjwS0HmctOEv_cmIRWWiqyhDzYMQdgdHJnZlIUEkdnoQRk0YrjbazhfKDBOcD3dPQ4tXYWlwC1mXDVq0xxjDNh0BA=s120",
          "default_to_fiat": false,
          "dev_buyer_fee_basis_points": 0,
          "dev_seller_fee_basis_points": 500,
          "only_proxied_transfers": false,
          "opensea_buyer_fee_basis_points": 0,
          "opensea_seller_fee_basis_points": 250,
          "buyer_fee_basis_points": 0,
          "seller_fee_basis_points": 750,
          "payout_address": "0xed9198181bbd4e09ff320fa11ae062e140be0c4e"
        },
        "permalink": "https://opensea.io/assets/0x51ae5e2533854495f6c587865af64119db8f59b4/4775",
        "collection": {
          "banner_image_url": "https://lh3.googleusercontent.com/xr496-YtH8jE9qrS5371IMpNoyq9FUA-lk1-ep91iOxeHhDa_JvG1sgdtC0g2dqdmshJLJpvyyNfiUVYeiTVn9m1QuSXJ0En8A66=s2500",
          "chat_url": null,
          "created_date": "2021-09-25T06:57:34.621000",
          "default_to_fiat": false,
          "description": "10k little landscapes that punks can inhabit – on the Ethereum Blockchain.\n\nMinting is still ongoing (Website or Etherscan).",
          "dev_buyer_fee_basis_points": "0",
          "dev_seller_fee_basis_points": "500",
          "discord_url": "https://discord.gg/aPS3Hre57D",
          "display_data": {
            "card_display_style": "contain"
          },
          "external_url": "https://punkscape.xyz",
          "featured": false,
          "featured_image_url": "https://lh3.googleusercontent.com/HmSNK5AOGb0VnOSR_TmXiZAP5PdoQqbApAowc1ved4JgJXkifR2LheU2gFAKuS76qG5LG4ULun4zaEWsj1D0YsmKlB8Zgm6F4PIY=s300",
          "hidden": false,
          "safelist_request_status": "not_requested",
          "image_url": "https://lh3.googleusercontent.com/zfQ0Ejqq61FjbrjwS0HmctOEv_cmIRWWiqyhDzYMQdgdHJnZlIUEkdnoQRk0YrjbazhfKDBOcD3dPQ4tXYWlwC1mXDVq0xxjDNh0BA=s120",
          "is_subject_to_whitelist": false,
          "large_image_url": "https://lh3.googleusercontent.com/HmSNK5AOGb0VnOSR_TmXiZAP5PdoQqbApAowc1ved4JgJXkifR2LheU2gFAKuS76qG5LG4ULun4zaEWsj1D0YsmKlB8Zgm6F4PIY=s300",
          "medium_username": null,
          "name": "PunkScapes",
          "only_proxied_transfers": false,
          "opensea_buyer_fee_basis_points": "0",
          "opensea_seller_fee_basis_points": "250",
          "payout_address": "0xed9198181bbd4e09ff320fa11ae062e140be0c4e",
          "require_email": false,
          "short_description": null,
          "slug": "punkscapes",
          "telegram_url": null,
          "twitter_username": "PunkScape_ETH",
          "instagram_username": null,
          "wiki_url": null
        },
        "decimals": 0,
        "token_metadata": "https://ipfs.io/ipfs/QmbXGesx3mwPQpoXcWmNAbbvL3hvAyXQc7PMGxPMHeb8xG/4775/metadata.json",
        "owner": {
          "user": {
            "username": "Full_On_Send"
          },
          "profile_img_url": "https://storage.googleapis.com/opensea-static/opensea-profile/9.png",
          "address": "0x81b4862d6e81e883477d0ed37478b0f174f02945",
          "config": ""
        },
        "sell_orders": null,
        "creator": {
          "user": {
            "username": "PunkScape_ETH"
          },
          "profile_img_url": "https://storage.googleapis.com/opensea-static/opensea-profile/31.png",
          "address": "0xed9198181bbd4e09ff320fa11ae062e140be0c4e",
          "config": ""
        },
        "traits": [],
        "last_sale": null,
        "top_bid": null,
        "listing_date": null,
        "is_presale": false,
        "transfer_fee_payment_token": null,
        "transfer_fee": null
      },
      {
        "id": 60580017,
        "token_id": "7010",
        "num_sales": 0,
        "background_color": null,
        "image_url": "",
        "image_preview_url": null,
        "image_thumbnail_url": null,
        "image_original_url": null,
        "animation_url": null,
        "animation_original_url": null,
        "name": null,
        "description": null,
        "external_link": null,
        "asset_contract": {
          "address": "0x51ae5e2533854495f6c587865af64119db8f59b4",
          "asset_contract_type": "non-fungible",
          "created_date": "2021-09-24T19:19:16.457454",
          "name": "PunkScape",
          "nft_version": "3.0",
          "opensea_version": null,
          "owner": 72862837,
          "schema_name": "ERC721",
          "symbol": "PS",
          "total_supply": "10000",
          "description": "10k little landscapes that punks can inhabit – on the Ethereum Blockchain.\n\nMinting is still ongoing (Website or Etherscan).",
          "external_link": "https://punkscape.xyz",
          "image_url": "https://lh3.googleusercontent.com/zfQ0Ejqq61FjbrjwS0HmctOEv_cmIRWWiqyhDzYMQdgdHJnZlIUEkdnoQRk0YrjbazhfKDBOcD3dPQ4tXYWlwC1mXDVq0xxjDNh0BA=s120",
          "default_to_fiat": false,
          "dev_buyer_fee_basis_points": 0,
          "dev_seller_fee_basis_points": 500,
          "only_proxied_transfers": false,
          "opensea_buyer_fee_basis_points": 0,
          "opensea_seller_fee_basis_points": 250,
          "buyer_fee_basis_points": 0,
          "seller_fee_basis_points": 750,
          "payout_address": "0xed9198181bbd4e09ff320fa11ae062e140be0c4e"
        },
        "permalink": "https://opensea.io/assets/0x51ae5e2533854495f6c587865af64119db8f59b4/7010",
        "collection": {
          "banner_image_url": "https://lh3.googleusercontent.com/xr496-YtH8jE9qrS5371IMpNoyq9FUA-lk1-ep91iOxeHhDa_JvG1sgdtC0g2dqdmshJLJpvyyNfiUVYeiTVn9m1QuSXJ0En8A66=s2500",
          "chat_url": null,
          "created_date": "2021-09-25T06:57:34.621000",
          "default_to_fiat": false,
          "description": "10k little landscapes that punks can inhabit – on the Ethereum Blockchain.\n\nMinting is still ongoing (Website or Etherscan).",
          "dev_buyer_fee_basis_points": "0",
          "dev_seller_fee_basis_points": "500",
          "discord_url": "https://discord.gg/aPS3Hre57D",
          "display_data": {
            "card_display_style": "contain"
          },
          "external_url": "https://punkscape.xyz",
          "featured": false,
          "featured_image_url": "https://lh3.googleusercontent.com/HmSNK5AOGb0VnOSR_TmXiZAP5PdoQqbApAowc1ved4JgJXkifR2LheU2gFAKuS76qG5LG4ULun4zaEWsj1D0YsmKlB8Zgm6F4PIY=s300",
          "hidden": false,
          "safelist_request_status": "not_requested",
          "image_url": "https://lh3.googleusercontent.com/zfQ0Ejqq61FjbrjwS0HmctOEv_cmIRWWiqyhDzYMQdgdHJnZlIUEkdnoQRk0YrjbazhfKDBOcD3dPQ4tXYWlwC1mXDVq0xxjDNh0BA=s120",
          "is_subject_to_whitelist": false,
          "large_image_url": "https://lh3.googleusercontent.com/HmSNK5AOGb0VnOSR_TmXiZAP5PdoQqbApAowc1ved4JgJXkifR2LheU2gFAKuS76qG5LG4ULun4zaEWsj1D0YsmKlB8Zgm6F4PIY=s300",
          "medium_username": null,
          "name": "PunkScapes",
          "only_proxied_transfers": false,
          "opensea_buyer_fee_basis_points": "0",
          "opensea_seller_fee_basis_points": "250",
          "payout_address": "0xed9198181bbd4e09ff320fa11ae062e140be0c4e",
          "require_email": false,
          "short_description": null,
          "slug": "punkscapes",
          "telegram_url": null,
          "twitter_username": "PunkScape_ETH",
          "instagram_username": null,
          "wiki_url": null
        },
        "decimals": 0,
        "token_metadata": "https://ipfs.io/ipfs/QmbXGesx3mwPQpoXcWmNAbbvL3hvAyXQc7PMGxPMHeb8xG/7010/metadata.json",
        "owner": {
          "user": {
            "username": "Full_On_Send"
          },
          "profile_img_url": "https://storage.googleapis.com/opensea-static/opensea-profile/9.png",
          "address": "0x81b4862d6e81e883477d0ed37478b0f174f02945",
          "config": ""
        },
        "sell_orders": null,
        "creator": {
          "user": {
            "username": "PunkScape_ETH"
          },
          "profile_img_url": "https://storage.googleapis.com/opensea-static/opensea-profile/31.png",
          "address": "0xed9198181bbd4e09ff320fa11ae062e140be0c4e",
          "config": ""
        },
        "traits": [],
        "last_sale": null,
        "top_bid": null,
        "listing_date": null,
        "is_presale": false,
        "transfer_fee_payment_token": null,
        "transfer_fee": null
      }
    ]
  },
};

