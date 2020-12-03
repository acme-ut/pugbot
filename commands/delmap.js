const { deleteMap } = require("../utility.js");

module.exports = {
    name: 'delmap',
    aliases: ['deletemap', 'deletemaps', 'delmaps'],
    description: 'Deletes map/s to a given mode',
    usage: '<mode> <map #> <..>',
    args: true,
    guildOnly: true,
    execute(message, args) {

        var memberobject = message.author;
        var channelid = message.channel.id;

        if (args.length > 1) {
            var mode = args.shift();
            args.forEach(element => {
                deleteMap(channelid, mode, element);
            })
        }
    },
};