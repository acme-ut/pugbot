const { listAll, listMatch } = require("../pug.js");

module.exports = {
    name: 'list',
    aliases: ['ls'],
    description: 'wip',
    usage: '<mode1> <mode2> <...>',
    args: false,
    guildOnly: true,
    execute(message, args) {

        var channelid = message.channel.id;

        if (args.length == 0) {
            message.channel.send(listAll(channelid));
        }
        else {
            args.forEach(element => {
                message.channel.send(listMatch(channelid, element));
            });
        }
    },
};