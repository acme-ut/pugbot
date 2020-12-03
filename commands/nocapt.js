module.exports = {
    name: 'nocapt',
    aliases: ['nc'],
    description: 'Toggles whether you\`re able to be chosen as captain when a pug fills',
    args: false,
    guildOnly: false,
    execute(message, args) {

        var memberobj = message.author;
        // if it doesnt exist or if it's false
        if (typeof memberobj.nocapt !== "undefined")
        {
            if (memberobj.nocapt) {
                memberobj.nocapt = false;
            } else {
                memberobj.nocapt = true;
            }
        } else {
            memberobj.nocapt = true;
        }

        message.channel.send(`${memberobj.username}: (nocapt: ${memberobj.nocapt})`);
    },
};