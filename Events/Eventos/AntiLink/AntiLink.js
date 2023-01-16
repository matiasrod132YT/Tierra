const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const antilinkSchema = require("../../../schemas/AntiLink/AntiLink");

module.exports = {
  name: "messageCreate",

  /**
   * @param {Client} client
   */
  async execute(msg) {
    if (!msg.guild) return;
    if (msg.author?.bot) return;

    const guild = msg.guild;

    let requireDB = await antilinkSchema.findOne({ _id: guild.id });
    if (!requireDB) return;

    if (requireDB.logs === false) return;

    if (requireDB.logs === true) {
      if (
        !guild.members.me.permissions.has(
          PermissionsBitField.Flags.ManageMessages
        )
      )
        return;
      if (msg.member.permissions.has(PermissionsBitField.Flags.Administrator))
        return;

      const embed = new EmbedBuilder()
        .setDescription(`🗑 En **${guild.name}** los links no estan permitidos!`)
        .setColor("#FF3939");

      const url =
        /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;


      if (url.test(msg) || msg.content.includes("discord.gg/")) {
          msg.channel
            .send({ embeds: [embed], content: `${msg.author}` })
            .then((mg) => setTimeout(mg.delete.bind(mg), 10000));
          msg.delete();

          return;
        }
    }
  },
};