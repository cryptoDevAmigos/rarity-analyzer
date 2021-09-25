import { INftMetadataCollectionDocument } from "@crypto-dev-amigos/common";
import { promises as fs } from 'fs';

export async function getProjectMetadata(location : string): Promise<INftMetadataCollectionDocument> {
    const content = await fs.readFile(location, {encoding: 'utf-8' });
    const data = JSON.parse(content) as INftMetadataCollectionDocument;
    return data;
};