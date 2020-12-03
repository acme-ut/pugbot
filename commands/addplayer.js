const { joinMatch, listMatch } = require("../pug.js");
const { addMemberIfNotExists } = require("../utility.js");

module.exports = {
    name: 'addplayer',
    aliases: ['addplayers', 'ap', 'aps'],
    description: 'Adds player/s to a chosen mode',
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
                for (const user of iter) {
                    var matchobj = joinMatch(channelid, user, mode);
                    addMemberIfNotExists(user.id);
                    if (matchobj) {
                        if (matchobj.maxplayers == matchobj.players.length) {
                            res = `\`${mode}\` filled!`;
                            break;
                        } else {
                            res = listMatch(channelid, mode);
                        }
                    }
                }
            }
        }
        
        if (res.length > 0) {
            message.channel.send(res);
        }
    },
};