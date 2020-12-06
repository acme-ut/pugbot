const { leaveMatch, fetchMatch } = require("../pug.js");

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

        var response = [];
        var modesleft = [];

        args.forEach(mode => {
            modeobj = fetchMatch(channelid, mode);
            if (typeof modeobj !== "undefined") {
                if (modeobj.players.includes(memberobject)) {
                    leaveMatch(modeobj, memberobject);
                    modesleft.push(modeobj.modeshort);
                }
            }
        });

        var last = modesleft.pop();
        if (modesleft.length > 0) {
            response = `${memberobject.username} left \`${modesleft.join("\`, \`")}\` and \`${last}\``;
        } else {
            response = `${memberobject.username} left \`${last}\``;
        }

        if (response.length > 0) {
            message.channel.send(response);
        }
    },
};