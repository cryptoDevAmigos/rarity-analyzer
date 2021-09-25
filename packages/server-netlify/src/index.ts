import type { Handler } from "@netlify/functions";
import { handleDiscordRoute } from "./handler";

const handler: Handler = async (event, context) => {

    if(event.body && event.path.endsWith('/discord')){
        return await handleDiscordRoute(event, context);
    }

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ message: "What's up?" }),
    };
};

export { handler };