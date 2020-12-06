const { joinMatch, listMatch, matchFilled, fetchUserState } = require("../pug.js");
const { addMemberIfNotExists } = require("../utility.js");
const { client } = require("../main.js");

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
        var response = [];

        args.some(function (mode) {
            var modeobj = joinMatch(channelid, memberobject, mode);
            if (modeobj) {
                if (modeobj.maxplayers === modeobj.players.length) {
                    matchFilled(client, modeobj);
                    response = [];
                    return true;
                } else {
                    response.push(listMatch(modeobj));
                }
            }
        });

        if (response.length > 0) {
            message.channel.send(response);
        }

        addMemberIfNotExists(memberobject.id);

    },
};