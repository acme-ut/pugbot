const { listMatches, listMatch } = require("../pug.js");

module.exports = {
    name: 'list',
    aliases: ['ls'],
    description: 'Lists all modes, or if given arguments will list the players in a mode',
    usage: '<mode1> <mode2> <...>',
    args: false,
    guildOnly: true,
    execute(message, args) {

        var channelid = message.channel.id;

        if (args.length == 0) {
            var modes = listMatches(channelid);
            if (modes) {
                message.channel.send(modes);
            }
        }
        else {
            args.forEach(element => {
                message.channel.send(listMatch(channelid, element));
            });
        }
    },
};