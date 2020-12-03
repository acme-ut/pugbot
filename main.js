// Includes
const { prefix } = require("./config.json");
const { token } = require("./bot_token.json");
const { populateChannels } = require("./pug.js");
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith('.js'));

module.exports = { client };

// Variable Definition
var regexp = /[^\s"]+|"([^"]*)"/gi;
var activity = `${prefix}help`

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Connect to the discord Client
client.once('ready', () => {
  console.log("Discord API Ready");
  client.user.setActivity(activity);
  populateChannels();
});
client.login(token)

client.on('presenceUpdate', (oldPresence, newPresence) => {
  console.log(oldPresence + " to " + newPresence);
});

// Message Handler - Check to see if the message has prefix, then split the message into command / args, then perform checks before executing
client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Remove trailing whitespace and split on spaces
  var args = [];
  do {
    var match = regexp.exec(message.content.slice(prefix.length).trim());
    if (match != null) {
      args.push(match[1] ? match[1] : match[0]);
    }
  } while (match != null);

  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) return;

  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply("I can't execute this command inside DMs.")
  }

  if (command.args && !args.length) {
    let reply = "Please provide an argument."
    if (command.usage) {
      reply = `Usage: \`${prefix}${commandName} ${command.usage}\``
    }
    return message.channel.send(reply)
  }

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('Error! Command not executed');
  }
});
