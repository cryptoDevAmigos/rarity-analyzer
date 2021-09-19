import { INftMetadata, INftRarity } from "../types";
import { promises as fs } from 'fs';

export async function getProjectMetadata(location : string): Promise<INftMetadata[]> {
    const content = await fs.readFile(location, {encoding: 'utf-8' });
    const data = JSON.parse(content) as INftMetadata[];
    return data;
};