const Discord = require('discord.js');
const config = require('./bot.json');
const client = new Discord.Client({disableEveryone: true});

client.on("guildMemberAdd", member => {
    let memberRole = member.guild.roles.cache.find(role => role.id === '772939341805912065'); 
    let rep = member.guild.roles.cache.find(role => role.id === '772923608515084298'); 
    let repStart = member.guild.roles.cache.find(role => role.id === '772927281105469452');
    let aboutu = member.guild.roles.cache.find(role => role.id === '772932560069722154'); 
    let pingy = member.guild.roles.cache.find(role => role.id === '772933132130582558');
    let starterRoles = [ memberRole, rep, repStart, aboutu, pingy ];
    starterRoles.forEach(role => {
        member.roles.add(role);
    });
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === config.leaveJoinChannel)
    welcomeChannel.send (`**${member.user.username}** sa k nám pripojil!`)
});

client.on("guildMemberRemove", member => {
    const leaveChannel = member.guild.channels.cache.find(channel => channel.name === config.leaveJoinChannel)
    leaveChannel.send (`**${member.user.username}** od nás odišiel :(`)
});

client.on("ready", () =>{
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('The Funny Server', { type: 'WATCHING' });
});

const fs = require("fs");
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js") 
    if(jsfile.length <= 0) {
         return console.log("[LOGS] Couldn't Find Commands!");
    }

    jsfile.forEach((f, i) => {
        let pull = require(`./commands/${f}`);
        client.commands.set(pull.config.name, pull);  
        pull.config.aliases.forEach(alias => {
            client.aliases.set(alias, pull.config.name)
        });
    });
});

client.on("message", message => {
    if(message.author === client || message.channel.type === "dm") return;
    config.blacklistedWords.forEach(word => {
        if (message.content.includes (word)) {
            message.reply('Nehreš >:(');
            message.delete();
        }
    });

    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = message.content.split(' ').shift();

    if(message.content.startsWith(prefix)) {
        let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)))
        if(commandfile) commandfile.run(client,message,args)
    } else if (message.content.startsWith('+') || message.content.startsWith('-') || cmd === 'rep') {
        let commandfile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd))
        if(commandfile) commandfile.run(client,message,args)
    }
})

client.login(process.env.token);