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
        var modesleft = leaveAll(memberobject, []);

        Object.keys(modesleft).forEach(channelid => {
            var modelist = [];
            for (const mode in modesleft[channelid]) {
                if (modesleft[channelid].hasOwnProperty(mode)) {
                    const modeobj = modesleft[channelid][mode];
                    modelist.push(modeobj.modeshort);
                }
            }
            var last = modelist.pop();
            if (modelist.length > 0) {
                response = `${memberobject.username} left \`${modelist.join("\`, \`")}\` and \`${last}\``;
            } else {
                response = `${memberobject.username} left \`${last}\``;
            }

            if (response.length > 0) {
                client.channels.cache.get(channelid).send(response);
            }
        });
    },
};