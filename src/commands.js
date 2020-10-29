function add(x, y) {
  return x + y;
}

function subtract(x, y) {
  return x - y;
}

kick_CMD =  (message,args) =>{
    if(message.member.hasPermission('KICK_MEMBERS') === false) 
                message.channel.send('You do not have permission to use this command.');  
    else if(args.length === 0) return message.reply('Please provide an ID');
    else {
        const member = message.guild.members.cache.get(args[0]);
        if(member){
            member.kick()
                .then((member)=>{
                    message.channel.send(`${member} was kicked...`);
                })
                .catch((err) => message.channel.send('I do not have the permission to kick this person.'));
        } else {
            message.channel.send('That member was not found');
    }}
}

ban_CMD = async (message,args) => {
    if(message.member.hasPermission('BAN_MEMBERS') === false) 
                message.channel.send('You do not have permission to use this command.');
    else if(args.length === 0) return message.reply('Please provide an ID');
    else {
            try {
                const user = await message.guild.members.ban(args[0]);
                message.channel.send('User was banned successfully.')
            }catch(err){
                //console.log(err);
                message.channel.send('Either I do not have permissions or the user cannot be found.');
            }
    }
}
help_CMD = (message,args) =>{

        if (args.length > 0) {
            message.channel.send("It looks like you might need help with " + args)
        } else {
            message.channel.send("I'm not sure what you need help with. Try `!help [topic]`")
        }
}

multiply_CMD = (message,args) => {
    if (args.length < 2) {
        message.channel.send("Not enough values to multiply. Try `!multiply 2 4 10` or `!multiply 5.2 7`")
        return
    }
    let product = 1
    args.forEach((value) => {
        product = product * parseFloat(value)
    })
    message.channel.send("The product of " + args + " multiplied together is: " + product.toString())

}


           

module.exports = { join_CMD,
    multiply_CMD, 
    help_CMD, 
    ban_CMD,
    kick_CMD, 
    add,
    subtract }