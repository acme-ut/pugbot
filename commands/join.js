const { joinMatch, listMatch } = require("../pug.js");
const { addMemberIfNotExists } = require("../utility.js");

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

        var res = [];

        args.some(function(element) {
            var matchobj = joinMatch(channelid, memberobject, element);
            addMemberIfNotExists(memberobject.id);
            if(matchobj) {
                if(matchobj.maxplayers == matchobj.players.length){
                    res = `\`${element}\` filled!`;
                    return true;
                } else {
                    res.push(listMatch(channelid, element));
                }
            };
        });

        if (res.length > 0) {
            message.channel.send(res);
        }
    },
};