module.exports = {
    name: 'nomic',
    aliases: ['nm'],
    description: 'Toggles whether you\`re playing as nomic',
    args: false,
    guildOnly: false,
    execute(message, args) {

        var memberobj = message.author;
        // if it doesnt exist or if it's false
        if (typeof memberobj.nomic !== "undefined")
        {
            if (memberobj.nomic) {
                memberobj.nomic = false;
            } else {
                memberobj.nomic = true;
            }
        } else {
            memberobj.nomic = true;
        }

        message.channel.send(`${memberobj.username}: (nomic: ${memberobj.nomic})`);
    },
};