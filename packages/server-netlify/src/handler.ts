import { handleDiscordCommand } from '@crypto-dev-amigos/common-node';

const handleDiscordRoute = () => {
    handleDiscordCommand({command:'hello'});
};

export default handleDiscordRoute;