const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const pegajosoSchema = require("../../schemas/pegajoso/pegajosoSchema");

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`pegajoso`)
    .setDescription("Crea un mensaje pegajoso en el siguiente canal")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) => option
        .setName("mensaje")
        .setDescription("Mensaje que quieres decir en el chat")
        .setRequired(true)
    )
    .addNumberOption((option) => option
        .setName("contador")
        .setDescription("Cada cuantos mensajes aparece el mensaje pegajoso")
        .setRequired(true)
    ),

    async execute(interaction, client) {
        const { options } = interaction;

        const mensaje = options.getString("mensaje")
        const contador = options.getNumber("contador")

        const embed = new EmbedBuilder()
        .setDescription(mensaje)
        .setFooter({ text: "Esto es un mensaje pegajoso"})
        .setColor(client.config.prefix)

        const embed2 = new EmbedBuilder()
        .setTitle(`📧 | Mensaje Pegajoso`)
        .setDescription(`El mensaje pegajoso se a creado con exito`)
        .setColor(client.config.prefix)

        const embed3 = new EmbedBuilder()
        .setTitle(`📧 | Mensaje Pegajoso`)
        .setDescription(`ya hay un mensaje pegajoso creado en este canal, porfavor has un /despegar para eliminarlo y intenta denuevo`)
        .setColor(client.config.prefix)

        pegajosoSchema.findOne({ CanalID: interaction.channel.id}, async (err,data) => {
            if (err) throw err;

            if(!data) {
                const msg = await interaction.channel.send({ embeds: [embed] });

                pegajosoSchema.create({
                    CanalID: interaction.channel.id,
                    Mensaje: (mensaje),
                    maxContador: contador,
                    ultimoMensajeId: msg.id,
                    Contador: 0,
                })  

                return await interaction.reply({ embeds: [embed2], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [embed3], ephemeral: true })
            }
        })
    }
}