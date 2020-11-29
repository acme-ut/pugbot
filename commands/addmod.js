const { addModeIfNotExists } = require("../utility.js");

module.exports = {
    name: 'addmod',
    aliases: ['am'],
    description: 'Adds a mod',
    usage: '<Short Name> <Long Name> <# of Players>',
    args: true,
    guildOnly: true,
    execute(message, args) {

        var memberid = message.author.id
        var channelid = message.channel.id;
        var shortName = args[0];
        var longName = args[1];
        var playerNum = args[2];

        //add to channels object when mod is created *******
        if (args.length == 3) {
            addModeIfNotExists(channelid, shortName, longName, playerNum);
        }
        else {
            message.channel.send("Unable to create new gamemode!")
        }
    },
};