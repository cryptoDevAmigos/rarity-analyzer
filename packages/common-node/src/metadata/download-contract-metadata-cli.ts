import { downloadContractMetadata } from "./download-contract-metadata";

const run = async () => {
    try{
        // Punkscape
        await downloadContractMetadata({
            destDir:'../../data/',
            contractAddress: '0x51Ae5e2533854495f6c587865Af64119db8F59b4',
            collection: 'punkscapes',
            projectKey: 'punkscapes',
            transformAttribute: (attribute)=>{
                if(attribute.trait_type === 'date'){
                    return null;
                }

                return attribute;
            },
        });

        // // Art Blocks - Skulptuur
        // await downloadContractMetadata({
        //     destDir:'../../data/',
        //     contractAddress: '0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270',
        //     collection: 'art-blocks',
        //     projectKey: 'artblocks-skulptuur',
        //     minTokenId: '173000000', 
        //     maxTokenId: '173001000', 
        //     maxOffset: 1250,
        //     transformAttribute: ({trait_type, value}) => {
        //         const valuePairs = value.split(':');
        //         return {
        //             trait_type: valuePairs[0],
        //             value: valuePairs[1],
        //         };
        //     },
        // });
    }catch(err){
        console.error(err);
    }
};
run();