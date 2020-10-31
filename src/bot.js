
process.on('unhandledRejection', (reason) => { 
  console.log('Unhandled Rejection was found.')
  console.error(reason);
  process.exit(1);
});

try {
    console.log(require.resolve("discord.js"));
} catch(e) {
    console.log(e.stack);
	console.log(process.version);
	console.log("Please run npm install and ensure it passes with no errors!"); // if there is an error, tell to install dependencies.
	process.exit();
}

 

const { Client, WebhookClient} = require('discord.js');
//const {help_CMD, kick_CMD,ban_CMD, multiply_CMD} = require('./commands');
const commands = require('./commands');
const config = require('./config');

const client = new Client({
    partials:['MESSAGE','REACTION']
});

const webhookClient = new WebhookClient(
    config.webhook_id,
    config.webhook_token
); 
const PREFIX = config.prefix;


client.login(config.bot_token)
//log the bot into the server


client.on('ready',()=>{
    console.log('The bot has logged in');
    console.log(`${client.user.username}`)
    client.user.setActivity("( ͡° ͜ʖ ͡°)")
    // console.log("Servers:")
    // // client.guilds.cache.forEach((guild) => {
    // //     console.log(" - " + guild.name)
    // // })
});

client.on('reconnecting', () => {
    console.log('Reconnecting!');
});

client.on('disconnect', () => {
    console.log('Disconnected!');
	process.exit(1); //exit node.js with an error
});



/*everything that occurs in the discord server is an event */
client.on('message',async (message)=>{
    if(message.author.bot) return; //prevent bot from responding to itself
    
    if (message.content === "hello"){
        message.channel.send("hello friend");
    };

    if(message.content.startsWith(PREFIX)){ //it's commands time
        
        const [CMD_NAME, ...args] = message.content.
            trim().
            substring(PREFIX.length).
            split(/\s+/); //this will match all whitespaces
        
        console.log(CMD_NAME,args);
        switch(CMD_NAME){
            case "help":
                commands.help_CMD(message,args);
                break;
            case "kick":
                commands.kick_CMD(message,args);
                break;
            case "ban":
                commands.ban_CMD(message,args);
                break;
            case "annonce":
                const msg = args.join(' ');
                webhookClient.send(msg);
                break;
            case "multiply":
                commands.multiply_CMD(message,args);
                break;
            default:
                message.channel.send("I don't know this command.");
        }
    }   
})

client.on('messageReactionAdd',(reaction,user)=>{
    console.log('A Reaction!!')
    const {name} = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);
    if(reaction.message.id === '534879821214384128'){
        switch(name){
            case ':thumbsup:':
                member.role.add('771176207219687466');
                break;
            case ':yum:':
                member.role.add('771176180124614667');
                break;
            case ':eyes:':
                member.role.add('771176107285938216');
                break;
        }
    }
});









