// Includes
const { prefix } = require("./config.json");
const { token } = require("./bot_token.json");
const sqlutil = require("./sqlutil.js");
const fs = require('fs');
const Discord = require("discord.js");
const client = new Discord.Client();
const sqlite = require("sqlite-async");

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith('.js'));

// Variable Definition
var regexp = /[^\s"]+|"([^"]*)"/gi;
var activity = `${prefix}help`

/*
// Attempt to connect to the SQLite database
let db = new sqlite.Database("./pugbot.db", sqlite.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the pugbot database.');
});
*/

let db = async () => { await sqlite.open('./pugbot.db', sqlite.OPEN_READWRITE).then(console.log("Connected to the database!"))};


//console.log(sqlutil.returnFound(db, "players", "95549859188187136"));
//db.all(`SELECT * FROM players`, []).then(console.log(row));

/*
async function openDB() 

constructor(dbName = ':memory:') {
  return (async() => {
      this.db = await sqLite.open(dbName)
      return this
  })()
}
*/

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Connect to the discord Client
client.once("ready", () => {
  console.log("Discord API Ready!");
  client.user.setActivity(activity);
});
client.login(token)

// Message Handler - Check to see if the message has prefix, then split the message into command / args, then perform checks before executing
client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Remove trailing whitespace and split on spaces
  var args = [];
  do {
    var match = regexp.exec(message.content.slice(prefix.length).trim());
    if (match != null)
    {
      args.push(match[1] ? match[1] : match[0]);
    }
  } while (match != null);

  const commandName = args.shift().toLowerCase();
  
  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) return;

  if(command.guildOnly && message.channel.type === 'dm'){
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

//console.log(utility.returnFound(db, "players", "95549859188187136"));

/*
// Attempt to Close Database Connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Closed the connection to the pugbot database.');
});
*/