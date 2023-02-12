const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        
        const scamLinks = require('./scamLinks.json');
        const scamlinks = scamLinks.known_links;
        
        for (let i in scamlinks) {
            if (message.content.toLowerCase().includes(scamlinks[i].toLowerCase())) {
                
                await message.delete();
                
                message.channel.send(`<@${message.author.id}> mando un link engañoso`);
            }
        }
    },
};