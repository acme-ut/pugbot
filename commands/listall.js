const { listAll, listMatches, fetchUserState } = require("../pug.js");

module.exports = {
    name: 'listall',
    aliases: ['lsa'],
    description: 'Lists all modes in current channel',
    args: false,
    guildOnly: true,
    execute(message, args) {

        var channelid = message.channel.id;

        var res = listAll(channelid);

        if (typeof res === "undefined") {
            message.channel.send("No modes found.");
            return false;
        }

        if (res.length > 0) {
            var matches = [];
            res.forEach(element => {
                var gamelist = [];
                element.players.forEach(element => {
                    gamelist.push(fetchUserState(element));
                });
                matches.push(`**${element.modelong} [${element.players.length}/${element.maxplayers}]:**\n ${gamelist.join(" :small_orange_diamond: ")}`);
            });
            message.channel.send(matches);
        } else {
            var modes = listMatches(channelid);
            if (modes) {
                message.channel.send(modes);
            }
        }
    },
};