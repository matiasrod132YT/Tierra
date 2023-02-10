const contadorSchema = require("../../../schemas/contador/contadorSchema");

module.exports = {
    name: "messageCreate",

    async execute(message, client) {
        const guildId = message.guild.id;

        if(message.author.bot) return;
        
        if(isNaN(message.content)) return;

        contadorSchema.findOne({ GuildID: guildId }, async (err, data) => {
            if (!data || !data.Canal) return;

            if(message.channel.id === data.Canal) {
                if(message.author.id == data.UltimaPersona || message.content < data.Contador || message.content > data.Contador) {
                    message.delete()
                    return;
                }

                if(message.content == 100 && data.Contador == 100) {
                    message.react(`💯`)
                } else {
                    message.react(`✅`)
                }
    
                data.Contador += 1
                data.save()
    
                if(err) {
                    console.log(err)
                }
            }
        })
    }
}