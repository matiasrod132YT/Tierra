const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const welcomeSchema = require('../../schemas/Bienvenidas/BienvenidasSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-bienvenida')
        .setDescription('Configura el Sistema de Bienvenida')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand((subcommand) =>
            subcommand
                .setName('crear')
                .setDescription('Crea el Sistema de Bienvenida')
                .addChannelOption((options) =>
                    options
                        .setName('canal')
                        .setDescription('Selecciona un canal')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
                .addStringOption((options) =>
                    options
                        .setName('descripcion')
                        .setDescription('Tags permitidos {usuario} | {usuario.tag} | {usuario.id} | {server} | {contador.usuarios}')
                        .setRequired(false)
                )
                .addRoleOption((options) =>
                    options
                        .setName('rol')
                        .setDescription('Auto Rol al entrar al server')
                        .setRequired(false)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('eliminar')
                .setDescription('Elimina el Sistema de Bienvenida')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('actualizar')
                .setDescription('Actualiza el canal')
                .addChannelOption((options) =>
                    options
                        .setName('actualizar_canal')
                        .setDescription('Sell')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        ),
    async execute(interaction, client) {
        const { options, guildId } = interaction;
        const prefix = 'Sistema de Bienvenida'

        const subcommand = options.getSubcommand();

        const canal = options.getChannel('canal');
        const actualizarCanal = options.getChannel('actualizar_canal');

        /** AUTO ROL */

        let autoRol
        let rol
        try {
            rol = options.getRole('rol')
            autoRol = options.getRole('rol').id
        } catch {
            autoRol = null
            rol = 'Rol no definido'
        }

        const descripcion = options.getString('descripcion') || null;

        const embed = new EmbedBuilder()
            .setFooter({ text: `${prefix} | ${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
            .setColor(client.config.prefix)

        if (subcommand === 'crear') {
            welcomeSchema.findOne({ guildId: guildId }, async (err, data) => {
                if (err) throw err;
                if (!data) {
                    await welcomeSchema.create({
                        guildId: guildId,
                        channelId: canal.id,
                        descripcion: descripcion,
                        rol: autoRol,
                    })
                    interaction.reply({
                        embeds: [
                            embed
                                .setDescription(`**👋 | ${prefix}**\n\n`)
                                .addFields({
                                    name: `Canal`,
                                    value: `${canal}`,
                                    inline: true
                                })
                                .addFields({
                                    name: `Descripcion`,
                                    value: `${descripcion == null ? 'Mensaje Default' : descripcion}`,
                                    inline: true
                                })
                                .addFields({
                                    name: `Auto Rol`,
                                    value: `${rol}`,
                                    inline: true
                                })
                                .setColor("#FF3939")
                        ],
                        ephemeral: true
                    })
                } else if (data) {
                    interaction.reply({
                        embeds: [
                            embed
                                .setDescription(`**👋 | Usa /setup-bienvenida eliminar y actualizar_canal**`)
                                .setColor("#FF3939")
                        ],
                        ephemeral: true
                    })
                }
            })
        } else if (subcommand == 'eliminar') {
            welcomeSchema.findOneAndDelete({ guildId: guildId }, async (err, data) => {
                if (err) throw err;
                if (!data) {
                    interaction.reply({
                        embeds: [
                            embed
                                .setDescription('**👋 | No se encontraron datos**')
                                .setColor("#FF3939")
                        ],
                        ephemeral: true
                    })
                } else if (data) {
                    interaction.reply({
                        embeds: [
                            embed
                                .setDescription(`**👋 | ${prefix} eliminado con exito**`)
                                .setColor("#FF3939")
                        ],
                        ephemeral: true
                    })
                }
            })
        } else if (subcommand == 'actualizar') {
            welcomeSchema.findOne({ guildId: guildId }, async (err, data) => {
                if (err) throw err;
                if (!data) {
                    interaction.reply({
                        embeds: [
                            embed
                                .setDescription('**👋 | No se encontraron datos**')
                                .setColor("#FF3939")
                        ],
                        ephemeral: true
                    })
                } else if (data) {
                    let antiguo = {
                        canal: data.channelId,
                    }
                    await data.updateOne({
                        channelId: actualizarCanal.id,
                    })
                    interaction.reply({
                        embeds: [
                            embed
                                .setDescription(`**👋 | ${prefix} fue actualizado con exito**\n\n`)
                                .addFields({
                                    name: `Canal`,
                                    value: `| Antiguo <#${antiguo.canal}>\n| Nuevo ${actualizarCanal}`,
                                })
                                .setColor("#FF3939")
                        ],
                        ephemeral: true
                    })
                }
            })
        }
    }
}