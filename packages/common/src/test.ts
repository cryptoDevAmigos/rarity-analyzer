import { calculateRarity } from "./calculate-rarity";
import { INftMetadata } from "./types";
import { promises as fs } from 'fs';

const run = async () => {
    const data = await getTestData();
    const result = calculateRarity(data);
};

// C:\gitplay\rarity-analyzer\packages\data\odp-collection.json
export async function getTestData(): Promise<INftMetadata[]> {
    const content = await fs.readFile("../common/data/odp-collection.json", {encoding: 'utf-8' });
    const data = JSON.parse(content) as INftMetadata[];
    return data;
};

run();