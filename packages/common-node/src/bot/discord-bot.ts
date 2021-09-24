export const handleDiscordCommand = async ({command}:{command: string}) => {
    console.log('#handleDiscordCommand', { command });

    // TODO: Implement response
    return {
        message: 'NICE!',
        command
    };
};