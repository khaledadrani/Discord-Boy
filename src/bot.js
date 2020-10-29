require('dotenv').config();
//console.log(process.env.DISCORDBOT_JS_TOKEN)
const { Client, WebhookClient} = require('discord.js');
const client = new Client({
    partials:['MESSAGE','REACTION']
});

const webhookClient = new WebhookClient(
    process.env.WEBHOOK_ID,
    process.env.WEBHOOK_TOKEN
); 
const PREFIX = "!";
//the client of discord, we will use it to interact
/*the client name might be confusing but it is in fact the bot
*/
client.on('ready',()=>{
    console.log('The bot has logged in');
    console.log(`${client.user.username}`)
});
/*everything that occurs in the discord server is an event */
client.on('message',async (message)=>{
    if(message.author.bot) return;
    //console.log('Hello!!!');
    //console.log(`${message.author.tag}: ${message.content}`);
    if (message.content === "hello"){
        message.channel.send("hello friend");
    };
    if(message.content.startsWith(PREFIX)){
        //here we extract the cmd and its args
        const [CMD_NAME, ...args] = message.content.
            trim().
            substring(PREFIX.length).
            split(/\s+/); //this will match all whitespaces
        //console.log(CMD_NAME,args);
        if (CMD_NAME === "kick"){
            if(message.member.hasPermission('KICK_MEMBERS')) 
                message.channel.send('You do not have permission to use this command.');
            if(args.length === 0) return message.reply('Please provide an ID');
            //message.channel.send("Kicked the user!");
            const member = message.guild.members.cache.get(args[0]);
            if(member){
                member.kick()
                    .then((member)=>{
                        message.channel.send(`${member} was kicked...`);
                    })
                    .catch((err) => message.channel.send('I do not have the permission to kick this person.'));
            } else {
                message.channel.send('That member was not found');
            }
        }else if (CMD_NAME === "ban"){
            if(message.member.hasPermission('BAN_MEMBERS')) 
                message.channel.send('You do not have permission to use this command.');
            if(args.length === 0) return message.reply('Please provide an ID');

           // message.guild.members.ban(args[0]).catch((err)=>console.log(err)); without async
            try {
                const user = await message.guild.members.ban(args[0]);
                message.channel.send('User was banned successfully.')
            }catch(err){
                console.log(err);
                message.channel.send('Either I do not have permissions or the user cannot be found.');
            }
        }else if(CMD_NAME === 'annonce'){
            const msg = args.join(' ');
            webhookClient.send(msg);
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

client.login(process.env.DISCORDBOT_JS_TOKEN)
//log the bot into the server




