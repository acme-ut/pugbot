const { deleteMode } = require("../utility.js");
const { deleteMatch } = require("../pug.js");

module.exports = {
    name: 'delmod',
    description: 'Removes a mode',
    usage: '<Short Name>',
    args: true,
    guildOnly: true,
    execute(message, args) {
        
        var memberobject = message.author;
        var channelid = message.channel.id;

        var mode = args.shift();

        if (mode) {
            deleteMode(channelid, mode);
            deleteMatch(channelid, mode);
        }
        else {
            message.channel.send("Unable to create new gamemode!")
        }
    },
};