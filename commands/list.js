const { fetchChannel, fetchMatch, listMatch } = require("../pug.js");

module.exports = {
    name: 'list',
    aliases: ['ls'],
    description: 'Lists all modes, or if given arguments will list the players in a mode',
    usage: '<mode1> <mode2> <...>',
    args: false,
    guildOnly: true,
    execute(message, args) {

        var channelid = message.channel.id;
        var response = [];

        if (args.length == 0) {
            var modes = fetchChannel(channelid);
            for (mode in modes) {
                var modeobj = modes[mode];
                response.push(`${modeobj.modeshort} [${modeobj.players.length}/${modeobj.maxplayers}]`);
            }
            response = response.sort();
            response = response.join(` :small_blue_diamond: `);
        } else {
            var unique = [];
            args.forEach(mode => {
                if (!unique.includes(mode)){
                    var modeobj = fetchMatch(channelid, mode);
                    response.push(listMatch(modeobj, modeobj.players));
                    unique.push(mode);
                }
            });
        }

        if (response.length > 0) {
            message.channel.send(response);
        }

    },
};