const { leaveMatch, listMatch } = require("../pug.js");

module.exports = {
    name: 'leave',
    aliases: ['l'],
    description: 'Leaves chosen games',
    usage: '<mode1> <mode2> <...>',
    args: true,
    guildOnly: true,
    execute(message, args) {

        var memberobject = message.author;
        var channelid = message.channel.id;

        args.forEach(element => {
            console.log(element);
            if (leaveMatch(channelid, memberobject, element)){
                message.channel.send(`${memberobject.username} quit ${element}`);
            }
        });
    }
};