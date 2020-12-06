const { leaveMatch, listMatch, fetchMatch } = require("../pug.js");

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

        var response = [];

        if (args.length > 1) {
            var mode = args.shift();
            if (typeof mode === "string") {
                var iter = message.mentions.users.values();
                for (const userobj of iter) {
                    var modeobj = fetchMatch(channelid, mode);
                    leaveMatch(modeobj, userobj);
                    response = listMatch(modeobj);
                }
            }
        }
        if (response.length > 0) {
            message.channel.send(response);
        }
    },
};