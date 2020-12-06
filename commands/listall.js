const { fetchChannel, listMatch } = require("../pug.js");

module.exports = {
    name: 'listall',
    aliases: ['lsa'],
    description: 'Lists all active modes in current channel',
    args: false,
    guildOnly: true,
    execute(message, args) {

        var channelid = message.channel.id;
        var modes = fetchChannel(channelid);
        var active = false;
        var response = [];

        
        for (mode in modes) {
            var modeobj = modes[mode];
            if (modeobj.players.length > 0) {
                response.push(listMatch(modeobj));
                active = true;
            }
        }

        if (!active){
            for (mode in modes) {
                var modeobj = modes[mode];
                response.push(`${modeobj.modeshort} [${modeobj.players.length}/${modeobj.maxplayers}]`);
            }
            response = response.sort();
            response = response.join(` :small_blue_diamond: `);
        }

        if (response.length > 0) {
            message.channel.send(response);
        }
    },
};