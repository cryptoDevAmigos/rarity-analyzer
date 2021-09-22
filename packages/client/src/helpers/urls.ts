export const getProjectsJsonUrl = ()=>`/data/projects.json`;
export const getProjectJsonUrl = (projectKey:string)=>`/data/${projectKey}/project.json`;
export const getNftJsonUrl = (projectKey:string, tokenId: string)=>`/data/${projectKey}/${tokenId}.json`;
export const getIpfsUrl = (nftUrl:string) => nftUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
export const getOpenSeaTokenUrl = (contractAddress:string, tokenId:string) => `https://opensea.io/assets/${contractAddress}/${tokenId}`;

