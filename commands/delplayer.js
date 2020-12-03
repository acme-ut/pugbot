const { leaveMatch, listMatch } = require("../pug.js");

module.exports = {
    name: 'delplayer',
    aliases: ['delplayers', 'dp', 'dps'],
    description: 'Removes player/s from a chosen mode',
    usage: '<mode> <user @> <...>',
    args: true,
    guildOnly: true,
    execute(message, args) {

        var memberobject = message.author;
        var channelid = message.channel.id;

        var res = [];

        if (args.length > 1) {
            var mode = args.shift();
            if (typeof mode === "string") {
                var iter = message.mentions.users.values();
                for (const memberobject of iter) {
                    var removed = leaveMatch(channelid, memberobject, mode);
                    if (removed) {
                        // Need a check here to see if the game is no longer full
                        res = listMatch(channelid, mode);
                    }
                }
            }
        }
        if (res.length > 0) {
            message.channel.send(res);
        }
    },
};