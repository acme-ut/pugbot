const sqlite3 = require("sqlite3").verbose();
const utility = require("../sqlutil.js");

module.exports = {
    name: 'match',
    aliases: ['m'],
    args: false,
    guildOnly: false,
	execute(message, args) {
        var id = message.author.id;
        var nick = message.member.nickname;
        var found = 0;

        

		message.channel.send(`Account ID:\t ${id}\nAccount Nickname:\t${nick}\nFound?\t${found}`);
	},
};