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

        var res = [];
        
        args.forEach(element => {
            if (leaveMatch(channelid, memberobject, element)){
                res.push(`${element}`);
            }
        });

        if (res.length > 0) {
            if (res.length > 1) {
                last = res.pop();
                message.channel.send(`${message.author.username} left \`${res.join("\`, \`")}\` and \`${last}\``);
            } else {
                message.channel.send(`${message.author.username} left \`${res}\``);
            }
        }
    },
};