const { Client, ChatInputCommandInteraction, ComponentType, ActionRowBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const ms = require("ms")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ppt")
        .setDescription("Juega piedra, papel o tijera"),
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { user, guild } = interaction;

        let elecciones = ["piedra", "papel", "tijera"]
        const eleccionbot = `${elecciones[(Math.floor(Math.random() * elecciones.length))]}`

        const Embed = new EmbedBuilder()
        .setAuthor({ name: "Piedra Papel Tijera", iconURL: user.displayAvatarURL() })
        .setDescription(`<@${user.id}> escoje piedra, papel o tijera!`)
        .setColor(client.config.prefix)

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("piedra")
                .setLabel("Piedra")
                .setEmoji(`⛰`),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("papel")
                .setLabel("Papel")
                .setEmoji(`📄`),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("tijera")
                .setLabel("Tijera")
                .setEmoji(`✂`),

        )

        const Page = await interaction.reply({

            embeds: [Embed],
            components: [row]
        })
        const col = Page.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: ms("10s")
        })
        col.on("collect", i => {

            switch (i.customId) {

                case "piedra": {

                    if (eleccionbot == "piedra") {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("#FF3939")
                                    .setAuthor({ name: "Piedra Papel Tijera", iconURL: user.displayAvatarURL() })
                                    .setDescription(`\`\`\`EMPATE\`\`\``)
                                    .addFields(
                                        { name: "Tu Respuesta", value: "Piedra", inline: true },
                                        { name: "Mi Respuesta", value: "Piedra", inline: true }
                                    )
                            ],
                            components: []
                        })
                    }

                    if (eleccionbot == "papel") {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("#FF3939")
                                    .setAuthor({ name: "Piedra Papel Tijera", iconURL: user.displayAvatarURL() })
                                    .setDescription(`\`\`\`PERDISTES\`\`\``)
                                    .addFields(
                                        { name: "Tu Respuesta", value: "Piedra", inline: true },
                                        { name: "Mi Respuesta", value: "Papel", inline: true }
                                    )
                            ],
                            components: []
                        })
                    }
                    if (eleccionbot == "tijera") {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("#FF3939")
                                    .setAuthor({ name: "Piedra Papel Tijera", iconURL: user.displayAvatarURL() })
                                    .setDescription(`\`\`\`GANASTES\`\`\``)
                                    .addFields(
                                        { name: "Tu Respuesta", value: "Piedra", inline: true },
                                        { name: "Mi Respuesta", value: "Tijera", inline: true }
                                    )
                            ],
                            components: []
                        })
                    }
                }
                    break;
                case "papel": {
                    if (eleccionbot == "piedra") {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("#FF3939")
                                    .setAuthor({ name: "Piedra Papel Tijera", iconURL: user.displayAvatarURL() })
                                    .setDescription(`\`\`\`GANASTES\`\`\``)
                                    .addFields(
                                        { name: "Tu Respuesta", value: "Papel", inline: true },
                                        { name: "Mi Respuesta", value: "Piedra", inline: true }
                                    )
                            ],
                            components: []
                        })
                    }

                    if (eleccionbot == "papel") {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("#FF3939")
                                    .setAuthor({ name: "Piedra Papel Tijera", iconURL: user.displayAvatarURL() })
                                    .setDescription(`\`\`\`EMPATE\`\`\``)
                                    .addFields(
                                        { name: "Tu Respuesta", value: "Papel", inline: true },
                                        { name: "Mi Respuesta", value: "Papel", inline: true }
                                    )
                            ],
                            components: []
                        })
                    }
                    if (eleccionbot == "tijera") {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("#FF3939")
                                    .setAuthor({ name: "Piedra Papel Tijera", iconURL: user.displayAvatarURL() })
                                    .setDescription(`\`\`\`PERDISTES\`\`\``)
                                    .addFields(
                                        { name: "Tu Respuesta", value: "Papel", inline: true },
                                        { name: "Mi Respuesta", value: "Tijera", inline: true }
                                    )
                            ],
                            components: []
                        })
                    }
                }
                    break;

                case "tijera": {

                    if (eleccionbot == "piedra") {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("#FF3939")
                                    .setAuthor({ name: "Piedra Papel Tijera", iconURL: user.displayAvatarURL() })
                                    .setDescription(`\`\`\`PERDISTES\`\`\``)
                                    .addFields(
                                        { name: "Tu Respuesta", value: "Tijera", inline: true },
                                        { name: "Mi Respuesta", value: "Piedra", inline: true }
                                    )
                            ],
                            components: []
                        })
                    }

                    if (eleccionbot == "papel") {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("#FF3939")
                                    .setAuthor({ name: "Piedra Papel Tijera", iconURL: user.displayAvatarURL() })
                                    .setDescription(`\`\`\`GANASTES\`\`\``)
                                    .addFields(
                                        { name: "Tu Respuesta", value: "Tijera", inline: true },
                                        { name: "Mi Respuesta", value: "Papel", inline: true }
                                    )
                            ],
                            components: []
                        })
                    }
                    if (eleccionbot == "tijera") {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("#FF3939")
                                    .setAuthor({ name: "Piedra Papel Tijera", iconURL: user.displayAvatarURL() })
                                    .setDescription(`\`\`\`EMPATE\`\`\``)
                                    .addFields(
                                        { name: "Tu Respuesta", value: "Tijera", inline: true },
                                        { name: "Mi Respuesta", value: "Tijera", inline: true }
                                    )
                            ],
                            components: []
                        })
                    }
                }
                    break;
            }
        })
        col.on("end", (collected) => {

            if (collected.size > 0) return

            interaction.editReply({
                embeds: [
                    Embed.setDescription(`No escojistes nada`)
                ],
                components: []
            })
        })
    }
}