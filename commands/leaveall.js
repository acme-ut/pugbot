const { client } = require("../main.js");
const { leaveAll } = require("../pug.js");

module.exports = {
    name: 'leaveall',
    aliases: ['lva'],
    description: 'Leaves all games',
    args: false,
    guildOnly: false,
    execute(message, args) {

        var memberobject = message.author;
        var channelobj = leaveAll(memberobject);
        var channellist = Object.keys(channelobj);

        channellist.forEach(channelid => {
            var modelist = channelobj[channelid];
            var last = modelist.pop();
            if (modelist.length > 0){
                var message = `${memberobject.username} left \`${modelist.join("\`, \`")}\` and \`${last}\``;
            } else {
                var message = `${memberobject.username} left \`${last}\``;
            }

            client.channels.cache.get(channelid).send(message);
        });
    },
};