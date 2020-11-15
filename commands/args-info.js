module.exports = {
    name: 'args-info',
    aliases: ['ai','args'],
    args: true,
    usage: '<arguments>',
    description: 'Information about the arguments provided.',
    guildOnly: false,
	execute(message, args) {
		message.channel.send(`Arguments: ${args}\nArgument Count: ${args.length}`);
	},
};