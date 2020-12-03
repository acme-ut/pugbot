const { tag_length } = require("../config.json");

module.exports = {
    name: 'tag',
    aliases: ['t', 'badge'],
    description: 'Assigns a tag to your user',
    usage: '<tag>',
    args: false,
    guildOnly: false,
    execute(message, args) {

        var memberobject = message.author;

        if (args.length > 0){
            var tag = args.toString()
            var trimmed = tag.substring(0, tag_length);

            memberobject.badge = trimmed;
            message.channel.send(`${message.author.username} updated tag to \`${memberobject.badge}\``);
        } else {
            memberobject.badge = "";
            message.channel.send(`${message.author.username} cleared tag`)
        }
    },
};