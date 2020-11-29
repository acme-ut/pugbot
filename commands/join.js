const { joinMatch, listMatch } = require("../pug.js");

module.exports = {
    name: 'join',
    aliases: ['j'],
    description: 'Joins chosen games',
    usage: '<mode1> <mode2> <...>',
    args: true,
    guildOnly: true,
    execute(message, args) {

        var memberobject = message.author;
        var channelid = message.channel.id;

        args.forEach(element => {
            if(joinMatch(channelid, memberobject, element)) {
                message.channel.send(listMatch(channelid, element));
            };
        });
    }
};