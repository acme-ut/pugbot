const { addMapIfNotExists } = require("../utility.js");

module.exports = {
    name: 'addmap',
    aliases: ['addmaps'],
    description: 'Adds map/s to a given mode',
    usage: '<mode> <map #> <..>',
    args: true,
    guildOnly: true,
    execute(message, args) {

        var memberobject = message.author;
        var channelid = message.channel.id;

        if (args.length > 1) {
            var mode = args.shift();
            args.forEach(element => {
                addMapIfNotExists(channelid, mode, element);
            })
        }
    },
};