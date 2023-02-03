const { DiscordTogether } = require("discord-together");
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const client = require("../../index")

const discordTogether = new DiscordTogether(client);

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`youtube`)
    .setDescription(`Youtube`)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
      option
        .setName("canal")
        .setDescription("Canal para la actividad de Youtube")
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {
        const { options } = interaction;

        const canal = options.getChannel("canal");
        const canalID = canal.id

        discordTogether
            .createTogetherCode(canalID, "youtube")
            .then((x) => interaction.reply(x.code));
    }
}