# rarity-analyzer

## Development
1. Install npm version 7.23.0 for use of workspaces.  Npm upgrade info for Windows `https://stackoverflow.com/questions/18412129/how-can-i-update-npm-on-windows`

2. Run `npm install` at the root of rarity-analyzer to install server dependencies including scope packages and workspaces.  

NOTE: you can run npm install at root to build scoped packages. 
e.g (While running packages/server/, you can make changes to packages/common/ and run npm install at root to rebuild the @crypto-dev-common package)

3. Run `npm start` to start the development server.

### Notes

- When debugging react make sure to copy `web/data` to `packages/client/public/data`


## Testing

## Requirements

- [x] Only OneDayPunk owners may participate in the hackathon
- [x] The app has to calculate a rarity score for each item in the given collection
- [] The app has to be deployed on a live server (Heroku free tier or similar is fine)
    - Serverless: Precaculated static on Netlify    - 
- [] The app has to be usable: Minimum requirement is that the rarity of each item in the collection can be queried / viewed
- [] There must be easy to follow documentation for other developers on how to configure their own collection metadata and deploy it to a server.
- [] "One quick note for all contestants - think about how to make the tool as widely usable as possible... Think of config options like "Project Logo / Name / Contract Address" etc." - jalil
- [] "makes the data easily queried / viewed in a web interface or via a Discord bot (or both 😅) " -jalil
- [] "As a good example of an easy to install and configure package check out this open source discord bot for OpenSea sales: https://github.com/0xEssential/opensea-discord-bot"

## Serverless (using GitHub actions to pre-calculate rarity)

- Host website on Netlify (with continuous deploy from repo folder '/web/')
- GitHub actions
- root of repo: /data/nft-projects-metadata/
- To submit a new project, github PR to add a new .json to that folder
    - projectName-nfts.json
    - projectName-details.json
- Github action would process all the files in that folder and generate the rarities into a static folder structure
    - i.e.
     - /web/data/results/projectId/list.json
     - /web/data/results/projectId/0.json
     - /web/data/results/projectId/1.json
- Website would access the .json files as static content of the same domain:
    - `site.com/projectName/0` would load `site.com/data/projectName/0.json`
- Anybody can setup their own website 
    - create a netlify
    - point netlify to repo/web

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
    

- [x] Github action to build:rarities
- [x] Copy files from react/build to web in build script
- [x] Fix build path for common web/build
- [ ] Finish Web UI
    - List all projects
        - [x] Add `web/data/projects.json` output
        - [x] Create ProjectsComponent
    - List nfts for a project
        - [x] Add `web/data/one-day-punks/project.json` output
        - [x] Create ProjectNftsComponent
    - [x] Fix React favicons, title, etc.
    - [ ] Add Project Details
        - [ ] Links (Discord, Twitter, Site, etc.)
        - [x] Theme (see css vars)

- [ ] Easy Button: Add contract address and hit submit on website
    - Use web3 to get contract data
- [ ] Generate `/web/projectName/collection-rarities.json`
- [ ] Review Requirements



- [ ] Add Instructions for adding project
    1. Create `/data/project-name.project.json` file with ContractUri json data
    2. Create `/data/project-name.json` file with nft metadata (TokenUri json array) data
    3. Submit a pull request
        - Rarities will be calculated
        - Website will be updated with results

- [ ] Instructions for Forking and deploy to site provider (Netlify)