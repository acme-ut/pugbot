const { addMemberIfNotExists } = require("../utility.js");

module.exports = {
    name: 'add',
    aliases: ['a'],
    description: 'A simple test command that adds a member to the "members" table if they don\'t already exist',
    args: false,
    guildOnly: false,
    execute(message, args) {

        var memberid = message.author.id
        addMemberIfNotExists(memberid);
    },
};