const { EmbedBuilder } = require("discord.js")
const nivelSchema = require("../../../schemas/nivel/nivel");
const nivelStatusSchema = require("../../../schemas/nivel/nivelStatus");

module.exports = {
    name: "messageCreate",

    async execute(message, client) {
        const { guild, author } = message;

        nivelStatusSchema.findOne({ GuildID: guild.id }, async (err, data) => {
            if (err) throw err;

            if(!data) {
            nivelStatusSchema.create({
                GuildID: guild.id,
                status: false
            })
            }
        })
        
        if(!guild || author.bot) return;

        nivelSchema.findOne({ Guild: guild.id, User: author.id}, async (err, data) => {
            if (err) throw err;

            if(!data) {
            nivelSchema.create({
                Guild: guild.id,
                User: author.id,
                XP: 0,
                Level: 0,
                Status: false
            })
            }
        })

        const channel = message.channel;
        
        const give = 1;
        
        const data = await nivelSchema.findOne({ Guild: guild.id, User: author.id});

        if(!data) return;

        const features = await nivelStatusSchema.findOne({ GuildID: guild.id })

        if (features.Leveling === false) return;

        const requiredXP = data.Level * data.Level * 20 + 20;

        if (data.XP + give >= requiredXP) {

            data.XP += give;
            data.Level += 1;
            await data.save()
            
            if(!channel) return;

            const embed = new EmbedBuilder()
            .setColor(client.config.prefix)
            .setDescription(`${author}, Haz subido de nivel a nivel ${data.Level}!`)

            channel.send({ embeds: [embed] });
        } else {
            data.XP += give;
            data.save()
        }
    }
}