const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

const {
    prefix,
    token,
} = require('./config.json');


const ytdl = require('ytdl-core');
const queue = new Map();



// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login('process.env. .token');

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
    console.log("Connected as " + client.user.tag)
})

client.once('reconnecting', () => {
    console.log('Reconnecting!');
});

client.once('disconnect', () => {
    console.log('Disconnect!');
});


client.on('ready', () => {
    // List servers the bot is connected to
    console.log("Servers:")
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name)

        // List all channels
        guild.channels.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
        })
    })

    var generalChannel = client.channels.get("655791617499856899") // Replace with known channel ID
    generalChannel.send("Hello, world! We meet again.")

    // Set bot status to: "Playing with something"
    client.user.setActivity("( ͡° ͜ʖ ͡°)")

    // Alternatively, you can set the activity to any of the following:
    // PLAYING, STREAMING, LISTENING, WATCHING
    // For example:
    // client.user.setActivity("TV", {type: "WATCHING"})
})

client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return
    }

    const serverQueue = queue.get(receivedMessage.guild.id);



    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage, serverQueue)
        console.log("Responding to people")
    }

    if (!receivedMessage.content.startsWith(prefix)) return;

    // You can copy/paste the actual unicode emoji in the code (not _every_ unicode emoji works)
    receivedMessage.react("👍")

    // Unicode emojis: https://unicode.org/emoji/charts/full-emoji-list.html

    // Get every custom emoji from the server (if any) and react with each one
    /*receivedMessage.guild.emojis.forEach(customEmoji => {
            console.log(`Reacting with custom emoji: ${customEmoji.name} (${customEmoji.id})`)
            receivedMessage.react(customEmoji)
        })*/
    // If you know the ID of the custom emoji you want, you can get it directly with:
    // let customEmoji = receivedMessage.guild.emojis.get(emojiId)





})

// To play a file, we need to give an absolute path to it

/*const dispatcher = connection.playFile('C:/Users/Black/DiscordBot/music/slaveKnightGael.mp3');
dispatcher.on('end', () => {
    // The song has finished
});
dispatcher.on('error', e => {
    // Catch any errors that may arise
    console.log(e);
});
dispatcher.setVolume(0.5); // Set the volume to 50%
dispatcher.setVolume(1); // Set the volume back to 100%
console.log(dispatcher.time); // The time in milliseconds that the stream dispatcher has been playing for
dispatcher.pause(); // Pause the stream
dispatcher.resume(); // Carry on playing
dispatcher.end(); // End the dispatcher, emits 'end' event*/





function processCommand(receivedMessage, serverQueue) {
    let fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments) // There may not be any arguments

    if (primaryCommand == "help") {
        helpCommand(arguments, receivedMessage)
    } else if (primaryCommand == "multiply") {
        multiplyCommand(arguments, receivedMessage)
    } else if (primaryCommand == 'join') {
        joinCommand(arguments, receivedMessage)
    } else if (primaryCommand == 'play') {
        playCommand(arguments, receivedMessage, serverQueue)
    } else {
        receivedMessage.channel.send("I don't understand the command. Try `!help` or `!multiply`")
    }

    receivedMessage.react("🛐")
}

function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 0) {
        receivedMessage.channel.send("It looks like you might need help with " + arguments)

    } else {
        receivedMessage.channel.send("I'm not sure what you need help with. Try `!help [topic]`")
    }
}

function multiplyCommand(arguments, receivedMessage) {
    if (arguments.length < 2) {
        receivedMessage.channel.send("Not enough values to multiply. Try `!multiply 2 4 10` or `!multiply 5.2 7`")
        return
    }
    let product = 1
    arguments.forEach((value) => {
        product = product * parseFloat(value)
    })
    receivedMessage.channel.send("The product of " + arguments + " multiplied together is: " + product.toString())
}

function joinCommand(arguments, receivedMessage) {
    if (!receivedMessage.guild) return;
    console.log("Here testing voice channel")
        // Only try to join the sender's voice channel if they are in one themselves
    if (receivedMessage.member.voiceChannel) {
        receivedMessage.member.voiceChannel.join()
            .then(connection => { // Connection is an instance of VoiceConnection
                receivedMessage.reply('I have successfully connected to the channel!');
            })
            .catch(console.log);
    } else {
        receivedMessage.reply('You need to join a voice channel first!');
    }
}

function playCommand(arguments, receivedMessage, serverQueue) {
    if (arguments.length > 0) {
        joinCommand(arguments, "join")



        if (receivedMessage.content.startsWith(`${prefix}play`)) {
            execute(receivedMessage, serverQueue);
            return;
        } else if (receivedMessage.content.startsWith(`${prefix}skip`)) {
            skip(receivedMessage, serverQueue);
            return;
        } else if (receivedMessage.content.startsWith(`${prefix}stop`)) {
            stop(receivedMessage, serverQueue);
            return;
        }

    } else {
        receivedMessage.channel.send("I did not understand. Try `!play [music]`")
    }

}

async function execute(message, serverQueue) {
    const args = message.content.split(' ');

    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return message.channel.send('I need the permissions to join and speak in your voice channel!');
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url,
    };

    message.channel.send("Going to play " + song.title)

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }

}

function skip(message, serverQueue) {
    if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if (!serverQueue) return message.channel.send('There is no song that I could skip!');
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', () => {
            console.log('Music ended!');
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on('error', error => {
            console.error(error);
        });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}
