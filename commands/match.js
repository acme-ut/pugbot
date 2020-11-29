const { ifExists } = require("../utility.js");

module.exports = {
    name: 'match',
    aliases: ['m'],
    description: 'A simple test command that checks if a member is found in the "members" table.',
    args: false,
    guildOnly: false,
    execute(message, args) {

            var memberid = message.author.id
            var user = message.member.user;

            found = ifExists(memberid, "uid", "members");
            message.channel.send(`Account ID:\t ${memberid}\nAccount Username:\t${user}\nIn Members?\t${found}`);
    },
};