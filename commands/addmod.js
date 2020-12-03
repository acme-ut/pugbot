const { addModeIfNotExists } = require("../utility.js");
const { addMatch } = require("../pug.js");

module.exports = {
    name: 'addmod',
    aliases: ['am'],
    description: 'Adds a mode',
    usage: '<Short Name> <Long Name> <# of Players>',
    args: true,
    guildOnly: true,
    execute(message, args) {
        
        var memberobject = message.author;
        var channelid = message.channel.id;
        var shortName = args[0];
        var longName = args[1];
        var playerNum = args[2];

        if (args.length == 3) {
            var newmode = addModeIfNotExists(channelid, shortName, longName, playerNum);
            if (newmode) {
                addMatch(channelid, shortName, longName, playerNum);
            }
        }
        else {
            message.channel.send("Unable to create new gamemode!")
        }
    },
};