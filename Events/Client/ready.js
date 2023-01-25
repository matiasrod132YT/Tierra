const { loadCommands } = require("../../Handlers/commandHandler");
const {Client, ActivityType} = require('discord.js');
const config = require("../../config.json");

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
      console.log(`Bot ${client.user} iniciado`.green);
      const activities = [
      
        { name: `/help`, type: 0 }, // LISTENING
        
            { name: `${client.guilds.cache.size} Servers`, type: 3 }, // PLAYING
            { name: `${client.users.cache.size} Usuarios`, type: 3 }, // WATCHING
        ];
        const status = [
            'online'
        ];
        let i = 0;
        setInterval(() => {
            if(i >= activities.length) i = 0
            client.user.setActivity(activities[i])
            i++;
        }, 5000);

      loadCommands(client);
    },
};