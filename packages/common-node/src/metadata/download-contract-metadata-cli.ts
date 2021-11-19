import { downloadContractMetadata } from "./download-contract-metadata";

const run = async () => {
    try{
        // // Punkscape
        // await downloadContractMetadata({
        //     destDir:'../../data/',
        //     contractAddress: '0x51Ae5e2533854495f6c587865Af64119db8F59b4',
        //     collection: 'punkscapes',
        //     projectKey: 'punkscapes',
        //     transformAttribute: (attribute)=>{
        //         if(attribute.trait_type === 'date'){
        //             return null;
        //         }

        //         return attribute;
        //     },
        //     metadata:{
        //         links: {
        //             site: 'https://punkscape.xyz/',
        //             openSea: "https://opensea.io/collection/punkscapes",
        //             twitter: "https://twitter.com/PunkScape_ETH",
        //             discord: "https://discord.gg/aPS3Hre57D"
        //         }
        //     }
        // });

        // // Art Blocks - Skulptuur
        // await downloadContractMetadata({
        //     destDir:'../../data/',
        //     contractAddress: '0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270',
        //     collection: 'art-blocks',
        //     projectKey: 'artblocks-skulptuur',
        //     metadata:{
        //         name: `Skulptuur (ArtBlocks)`,
        //         description: `An exploration in generating forms in 3-dimensional space. This exclusive set of sculptures has been carved from a sea of infinite possibilities, much like a sculptor creates a singular reality from the potential in a block of stone. The shapes are illuminated by a variety of complex virtual lighting environments and yet the piece retains algorithmic minimalism with the code reduced to its pure essence -- 6370 bytes. Skulptuurs render in real time. In live view, the image keeps improving in quality. Keys 0-7 change speed: 0=Stop, 5=Default, 7=Fastest. Careful, requires a powerful machine. Requires a WebGL2-enabled browser.`,
        //         image: `https://lh3.googleusercontent.com/hmlw19Tj1HFCfpOaS2Nl2Te9VhAhtuQ2hwTgn-otgkmOzKaX_7Ww0DqtT_Jz20PL1-qdmMQ94im4jbGrLNjCKz7xUtBcgnoGvjvv-Q`,
        //         external_link: `https://artblocks.io/project/173`,
        //     },
        //     minTokenId: '173000000', 
        //     maxTokenId: '173001000', 
        //     maxOffset: 1250,
        //     transformAttribute: ({trait_type, value}) => {

        //         const valuePairs = value.split(':');
        //         const a = {
        //             trait_type: valuePairs[0],
        //             value: valuePairs[1],
        //         };

        //         if(a.trait_type === 'shape_name'){
        //             return null;
        //         }

        //         return a;
        //     },
        // });

        // // Art Blocks - CatBlocks
        // await downloadContractMetadata({
        //     destDir:'../../data/',
        //     contractAddress: '0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270',
        //     collection: 'art-blocks-factory',
        //     projectKey: 'artblocks-catblocks',
        //     metadata:{
        //         name: `CatBlocks (ArtBlocks)`,
        //         description: `Adorable and purrfect, these carefully bred kitties express a wide range of emotions and personalities. They live entirely on-chain and they just love receiving pets.`,
        //         image: `https://lh3.googleusercontent.com/hmlw19Tj1HFCfpOaS2Nl2Te9VhAhtuQ2hwTgn-otgkmOzKaX_7Ww0DqtT_Jz20PL1-qdmMQ94im4jbGrLNjCKz7xUtBcgnoGvjvv-Q`,
        //         external_link: `https://artblocks.io/project/73`,
        //     },
        //     minTokenId: '73000000', 
        //     maxTokenId: '73001000', 
        //     maxOffset: 100250,
        //     transformAttribute: ({trait_type, value}) => {

        //         const valuePairs = value.split(':');
        //         const a = {
        //             trait_type: valuePairs[0],
        //             value: valuePairs[1],
        //         };

        //         if(a.trait_type === 'shape_name'){
        //             return null;
        //         }

        //         return a;
        //     },
        // });

        // Art Blocks - Scoundrels
        await downloadContractMetadata({
            destDir:'../../data/',
            contractAddress: '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270',
            collection: 'art-blocks-factory',
            projectKey: 'artblocks-scoundrels',
            metadata:{
                name: `Scoundrels (ArtBlocks)`,
                description: `Scoundrels are a limited edition of on-chain generative pixel art characters tokenized on the Ethereum blockchain. This ragtag bunch of thieves and misfits are perfectly capable of relieving anyone of their most prized possessions.`,
                image: `https://lh3.googleusercontent.com/6CCwNAQI_P6colSSqgnftqMJh_iMcS70ab79IfiZu_UgxWt5AAcXoQd-RYWdW61o1mY4aWCaTdtEfrHb1wqP2jW_ZP4NrbE22iR0pl8=w310`,
                external_link: `https://artblocks.io/project/203`,
            },
            minTokenId: '203000000', 
            maxTokenId: '203002048', 
            maxOffset: 10000,
            transformAttribute: ({trait_type, value}) => {

                // console.log('transformAttribute', {value})
                const valuePairs = value.split(':');
                const a = {
                    trait_type: valuePairs[0]?.trim(),
                    value: valuePairs[1]?.trim(),
                };

                // if(a.value === 'None'){
                //     return null;
                // }

                return a;
            },
        });
    }catch(err){
        console.error(err);
    }
};
run();