import { downloadContractMetadata } from "./download-contract-metadata";

const run = async () => {
    try{
        // Punkscape
        await downloadContractMetadata({
            contractAddress: '0x51Ae5e2533854495f6c587865Af64119db8F59b4',
            projectKey: 'punkscapes',
            destDir:'../../data/',
        });

        // // Art Blocks - Skulptuur
        // await downloadContractMetadata({
        //     contractAddress: '0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270',
        //     projectKey: 'artblocks-skulptuur',
        //     minTokenId: '173000000', 
        //     maxTokenId: '173001000', 
        //     destDir:'../../data/',
        // });
    }catch(err){
        console.error(err);
    }
};
run();