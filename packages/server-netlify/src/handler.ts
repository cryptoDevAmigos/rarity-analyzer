import { handleDiscordCommand } from '@crypto-dev-amigos/common-node';

const handleDiscordRoute = () => {
    handleDiscordCommand({command:'help'});
};

export default handleDiscordRoute;