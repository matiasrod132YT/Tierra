const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const cuentaSchema = require("../../schemas/Economia/cuenta");

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`economia-pagar`)
    .setDescription(`Paga a alguien dinero`)
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Selecciona un usuario")
        .setRequired(true)
    )
    .addNumberOption(option =>
      option
        .setName("pagar")
        .setDescription("¿Cuanto dinero quieres pagarle?")
        .setRequired(true)
    ),

    async execute(interaction, client) {
        const { user, options, guild } = interaction;

        const Member = options.getUser("usuario")
        const pagar = options.getNumber("pagar")
        const sender = user;

        const embed = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`El usuario no tiene una cuenta`)
        .setColor(client.config.color)

        const embed2 = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`Porfavor, Crea una cuenta primero`)
        .setColor(client.config.color)

        const embed4 = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`No puedes mandarte dinero a ti mismo`)
        .setColor(client.config.color)

        const embed5 = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`Has pagado \`\`$${pagar}\`\` a ${Member}`)
        .setColor(client.config.color)

        const embed6 = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`**Has recibido un pago**\n\n\`\`De: \`\`${user}\n\`\`Cantidad: $${pagar}\`\``)
        .setColor(client.config.color)
        
        const embed8 = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`Has cancelado el pago`)
        .setColor(client.config.color)
        
        let data = await cuentaSchema.findOne({ Guild: interaction.guild.id, User: user.id }).catch(err => { })
        if (!data) return interaction.reply({ embeds: [embed2], ephemeral: true })

        let Data = await cuentaSchema.findOne({ Guild: interaction.guild.id, User: Member.id }).catch(err => { })
        if (!Data) return interaction.reply({ embeds: [embed], ephemeral: true })

        const Sender = await cuentaSchema.findOne({
            Guild: interaction.guild.id,
            User: sender.id
        })

        const embed3 = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`No tienes esa cantidad de dinero. \n\n**Banco:** ${Sender.Bank}\n**Cantidad a pagar:** ${pagar}`)
        .setColor(client.config.color)

        const dinerorecivido = await cuentaSchema.findOne({
            Guild: interaction.guild.id,
            User: Member.id
        })

        if (Sender.Bank < pagar) {
            return interaction.reply({ embeds: [embed3], ephemeral: true })
        }

        if (sender === Member) {
            return interaction.reply({ embeds: [embed4], ephemeral: true })
        }

        const embed7 = new EmbedBuilder()
        .setTitle(`💳 | Banco de ${interaction.guild.name}`)
        .setDescription(`**Confirmacion de pago**\n\n**Para: ${Member}**\n**De: ${sender}**\n**Cantidad: ${pagar}**\n\n**Para confirmar el pago dale al boton \`\`CONFIRMAR\`\` y para rechazar darle al boton \`\`RECHAZAR\`\`.**`)
        .setColor(client.config.color)

        const botones = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
            .setCustomId('pagar-confirmar')
            .setLabel('CONFIRMAR')
            .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
            .setCustomId('pagar-rechazar')
            .setLabel('RECHAZAR')
            .setStyle(ButtonStyle.Danger),
        );

        await interaction.reply({ embeds: [embed7], components: [botones], ephemeral: true })

        const ifilter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter: ifilter, time: 60000 })

        collector.on('collect', async i => {
            if(i.isButton()){
            if(i.customId === "pagar-confirmar"){
                await i.deferUpdate()
                const datosenviados = await cuentaSchema.findOne({
                    Guild: interaction.guild.id,
                    User: sender.id
                })
                datosenviados.Bank -= pagar
                datosenviados.save()

                const datosrecividos = await cuentaSchema.findOne({
                    Guild: interaction.guild.id,
                    User: Member.id
                })
                datosrecividos.Bank += pagar
                datosrecividos.save()

                Member.send({ embeds: [embed6], ephemeral: true })
               return interaction.channel.send({ embeds: [embed5], ephemeral: true })
            }}
            collector.stop()
        })

        collector.on('collect', async i => {
            if(i.isButton()){
            if(i.customId === "pagar-rechazar"){
                await i.deferUpdate();
                interaction.channel.send({ embeds: [embed8], ephemeral: true });
            }
            }
            collector.stop()
        })
    }
}