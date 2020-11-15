module.exports = {
    name: 'ping',
    args: false,
    usage: 'ping',
    description: 'Provides pong',
    guildOnly: true,
    execute(message, args) {
        message.channel.send('pong');
    }
};