import type { Handler } from "@netlify/functions";
import { handleDiscordRoute } from "./handler";

const handler: Handler = async (event, context) => {

    if(event.path.endsWith('/discord')){
        return await handleDiscordRoute(event, context);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "What's up?" }),
    };
};

export { handler };