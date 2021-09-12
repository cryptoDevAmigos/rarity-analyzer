import { calculateRarity, getTestData } from "./common-test";

const run = async () => {
    const data = await getTestData();
    const result = calculateRarity(data);
};

run();