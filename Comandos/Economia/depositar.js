const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const cuentaSchema = require("../../schemas/Economia/cuenta");

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`economia-depositar`)
    .setDescription(`Deposita dinero a tu cuenta`)
    .addStringOption(option =>
      option
        .setName("retirar")
        .setDescription("¿Cuanto dinero quieres depositar?")
        .setRequired(true)
    ),
    
    async execute(interaction, client) {
        const { options, user, guild } = interaction;

        const retirar = options.getString("retirar")

        const embed = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`Porfavor, Crea una cuenta primero`)
        .setColor(client.config.prefix)

        const embed2 = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`No tienes dinero en tu cuenta para depositar`)
        .setColor(client.config.prefix)

        const embed3 = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`Has depositado todo tu dinero`)
        .setColor(client.config.prefix)

        const embed4 = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`Solo puede ser un numero o \`todo\`!`)
        .setColor(client.config.prefix)

        const embed5 = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`No tienes dinero en tu billetera para depositarlo`)
        .setColor(client.config.prefix)

        const embed6 = new EmbedBuilder()
        .setDescription(`Se a depositado con exito $${perseInt(Converted)} a tu cuenta`)
        .setColor(client.config.prefix)

        let Data = await cuentaSchema.findOne({ Guild: interaction.guild.id, User: user.id }).catch(err => { })
        if (!Data) return interaction.reply({ embeds: [embed], ephemeral: true }),
            setTimeout(function(){interaction.deleteReply({ embeds: [embed] })}, 5000)

        if(retirar.toLowerCase() === "todo") {
            if (Data.Wallet == 0) return interaction.reply({ embeds: [embed2], ephemeral: true }),
                setTimeout(function(){interaction.deleteReply({ embeds: [embed2] })}, 5000)

            Data.Bank += Data.Wallet
            Data.Wallet = 0

            await Data.save()

            return interaction.reply({ embeds: [embed3], ephemeral: true }),
                setTimeout(function(){interaction.deleteReply({ embeds: [embed3] })}, 5000)
        } else {
            const Converted = Number(retirar)

            if (isNaN(Converted) === true) return interaction.reply({ embeds: [embed4], ephemeral: true}),
                setTimeout(function(){interaction.deleteReply({ embeds: [embed4] })}, 5000)
            if (Data.Wallet < perseInt(Converted) || Infinity) return interaction.reply({ embeds: [embed5]})
                setTimeout(function(){interaction.deleteReply({ embeds: [embed5] })}, 5000)

            Data.Bank += perseInt(Converted)
            Data.Wallet -= perseInt(Converted)
            Data.Wallet = Math.abs(Data.Bank)

            await Data.save()

            return interaction.reply({ embeds: [embed6]})
        }
    }
}