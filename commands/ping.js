module.exports = {
    name: 'ping',
    args: false,
    usage: '',
    description: 'Provides pong',
    guildOnly: false,
    execute(message, args) {
        message.channel.send('dong');
    }
};