const {
    SlashCommandBuilder,
    Client,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
} = require("discord.js");
const nivelStatusSchema = require('../../schemas/nivel/nivelStatus')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup-nivel")
        .setDescription("Set the status of the level system")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        

    async execute(interaction, client) {
        const guild = interaction.guild;

        await interaction.deferReply();

        const nivelstatus = await nivelStatusSchema.findOne({ GuildID: guild.id })

        if(!nivelstatus) {
            nivelStatusSchema.create({
              GuildID: guild.id,
              Leveling: false
            })
        }

        const sistema = nivelstatus.status === true ? "📗 Activado" : "📕 Desabilitado";

        const e2 = new EmbedBuilder()
        .setTitle(`✨ Nivel`)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(
            `Sistema de nivel de **${guild.name}**\n\nEl sistema esta \`${sistema}\`.\n\n¡Usa los botones de abajo para configurar el sistema de nivel del servidor!`
        )
        .setFooter({
            text: guild.name,
            iconURL: guild.iconURL({ dynamic: true }),
        })
        .setTimestamp(new Date())
        .setColor(client.config.color);

        const b = new ButtonBuilder()
            .setLabel(`Activar`)
            .setCustomId(`true`)
            .setStyle(3)
            .setEmoji(`📗`);

        const b1 = new ButtonBuilder()
            .setLabel(`Desactivar`)
            .setCustomId(`false`)
            .setStyle(4)
            .setEmoji(`📕`);

        const ac = new ActionRowBuilder().addComponents(b, b1);

        const tf = await interaction.editReply({ embeds: [e2], components: [ac] });

        const coll = tf.createMessageComponentCollector();

        coll.on("collect", async (ds) => {
            if (ds.user.id !== interaction.user.id) return;

            if (ds.customId === `true`) {
                const e = new EmbedBuilder()
                .setDescription(`📗 El Sistema de niveles esta **Activado**`)
                .setColor(client.config.prefix)

                ds.update({ embeds: [e], components: [] });

                await nivelStatusSchema.findOneAndUpdate(
                    { GuildID: guild.id },
                    {
                      $set: { status: true },
                    },
                    { upsert: true }
                );

            } else if (ds.customId === `false`) {
                const e = new EmbedBuilder()
                .setDescription(`📕 El Sistema de niveles esta **Desactivado**`)
                .setColor(client.config.prefix)

                ds.update({ embeds: [e], components: [] });

                await nivelStatusSchema.findOneAndUpdate(
                    { GuildID: guild.id },
                    {
                      $set: { status: false },
                    },
                    { upsert: true }
                );
            }
        });
    }
}