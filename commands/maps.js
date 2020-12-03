const { listAllMaps } = require("../utility.js");

module.exports = {
    name: 'maps',
    aliases: ['m', 'map'],
    description: 'Lists all registered maps, or if given arguments will list maps for given mode/s',
    usage: '<mode1> <mode2> <...>',
    args: false,
    guildOnly: true,
    execute(message, args) {

        var channelid = message.channel.id;
        var maplist = listAllMaps(channelid);
        var uniquemodes = [];
        var res = [];

        if (maplist.length > 0) {
            if (args.length > 0) {
                uniquemodes = args;
            } else {
                maplist.forEach(element => {
                    if (!(uniquemodes.includes(element.mapmode))) {
                        uniquemodes.push(element.mapmode);
                    }
                });
            }
            uniquemodes.forEach(element => {
                var modelist = [];
                var filteredmaps = maplist.filter(map => map.mapmode == element);
                if (filteredmaps.length > 0) {
                    filteredmaps.forEach(map => {
                        modelist.push(map.mapname);
                    });
                    res.push(`**${element}:** ${modelist.join(" :small_blue_diamond: ")}`)

                }
            });
            if (res.length > 0) {
                message.channel.send(res);
            }
        } else {
            message.channel.send("No maps found.");
        }
    },
};