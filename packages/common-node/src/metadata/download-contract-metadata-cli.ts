import { downloadContractMetadata } from "./download-contract-metadata";

const run = async () => {
    try{
        await downloadContractMetadata({
            contractAddress: '0x51Ae5e2533854495f6c587865Af64119db8F59b4',
            destDir:'../../data/',
        });
    }catch(err){
        console.error(err);
    }
};
run();