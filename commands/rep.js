const Discord = require("discord.js")
const mongoose = require('mongoose');

mongoose.connect(process.env.mongooPass, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Data = require('../models/data.js');

module.exports.run = async (bot, message, arguments) => {
    let user = message.mentions.users.first() || message.author;

    Data.findOne({
        userID: user.id
    }, (err, data) => {
        if(err) throw err;
        if(!data) {
            const newData = new Data({
                name: user.username,
                userID: user.id,
                rep: 0,
            });
            newData.save().catch(err => console.log(err));
            console.log('Created database table for ' + user.username);
            return message.channel.send(`${user.username} má 0 bodov reputácie.`);
        } else {
            return message.channel.send(`${user.username} má ${data.rep} bodov reputácie.`);
        }
    })
}

module.exports.config = {
    name: "rep",
    description: "",
    usage: "rep",
    accessableby: "Members",
    aliases: []
}