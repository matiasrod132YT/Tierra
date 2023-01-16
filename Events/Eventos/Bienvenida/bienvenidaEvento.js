const { EmbedBuilder, GuildMember } = require("discord.js");
const welcomeSchema = require('../../../schemas/Bienvenidas/BienvenidasSchema');

module.exports = {
    name: 'guildMemberAdd',
    /**
     * 
     * @param {GuildMember} member 
     */
    async execute(member, client) {
        welcomeSchema.findOne({ guildId: member.guild.id }, async (err, data) => {
            if (err) throw err;
            if (!data) {
                return
            } else if (data) {
                let messageWelcome
                try {
                    messageWelcome = data.descripcion
                        .replace(/{usuario}/, member)
                        .replace(/{usuario.tag}/, member.tag)
                        .replace(/{usuario.id}/, member.id)
                        .replace(/{server}/, member.guild.name)
                        .replace(/{contador.usuarios}/, member.guild.memberCount)
                } catch { }
                const defaultMessage = `Hey ${member}, bienvenido a ${member.guild.name}`;
                const canal = client.channels.cache.get(data.channelId);

                let rol = member.guild.roles.cache.get(data.rol);

                try { await member.roles.add(rol) } catch { }

                const embed = new EmbedBuilder()
                .setAuthor({ name: member.guild.name, iconURL: member.user.avatarURL() })
                .setDescription(messageWelcome == null ? defaultMessage : messageWelcome)
                .setColor("#FF3939")

                canal.send({ embeds: [embed], ephemeral: true })
            }
        })
    }
}