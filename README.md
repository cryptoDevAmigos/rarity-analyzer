# rarity-analyzer

## Development
1. Install npm version 7.23.0 for use of workspaces.  Npm upgrade info for Windows `https://stackoverflow.com/questions/18412129/how-can-i-update-npm-on-windows`

2. Run `npm install` at the root of rarity-analyzer to install server dependencies including scope packages and workspaces.  

NOTE: you can run npm install at root to build scoped packages. 
e.g (While running packages/server/, you can make changes to packages/common/ and run npm install at root to rebuild the @crypto-dev-common package)

3. Run `npm start` to start the development server.

## Testing


## Tasks

- Frontend
    - load /tokenId.json files from api
    - routing /projectKey/tokenId
        - /project Pages - show list of tokens
        - /token - show rarity details
            - image: imageUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
            - external_url: [same as above]
            - rarity data:
                - trait: rarity value
- Api
    - Handling metadata requests
        - routing /projectKey/tokenId
    - 
    