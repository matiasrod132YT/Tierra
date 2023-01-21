const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const cuentaSchema = require("../../schemas/Economia/cuenta");

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`economia`)
    .setDescription(`Mira cuanto dinero tienes`)
    .addStringOption(option =>
      option
        .setName("opciones")
        .setDescription("Selecciona una opcion")
        .setRequired(true)
        .addChoices(
          { name: "Crear", value: "crear" },
          { name: "Eliminar", value: "eliminar" },
          { name: "Dinero", value: "dinero" }
        )
    ),

    async execute(interaction, client) {
     try{
      const { options, user, guild } = interaction;

      let Data = await cuentaSchema.findOne({ Guild: interaction.guild.id, User: user.id}).catch(err => { })

      const embed2 = new EmbedBuilder()
      .setTitle(`💳 | Banco de ${interaction.guild.name}`)
      .setDescription(`Ya tienes una cuenta`)
      .setColor(client.config.prefix)
      
      const embed4 = new EmbedBuilder()
      .setTitle(`💳 | Banco de ${interaction.guild.name}`)
      .setDescription(`Porfavor, Crea una cuenta primero`)
      .setColor(client.config.prefix)

      const embed5 = new EmbedBuilder()
      .setTitle(`💳 | Banco de ${interaction.guild.name}`)
      .setDescription(`Tu cuenta fue eliminada en este servidor`)
      .setColor(client.config.prefix)

      switch(options.getString("opciones")) {
        case "crear": {
          if(Data) {return interaction.reply({ embeds: [embed2], ephemeral: true }),
            setTimeout(function(){interaction.deleteReply({ embeds: [embed2] })}, 5000)
          };

          Data = new cuentaSchema({
            Guild: interaction.guild.id,
            User: user.id,
            Bank: 0,
            Wallet: 1000
          })

          await Data.save()

          const embed3 = new EmbedBuilder()
          .setTitle(`💳 | Banco de ${interaction.guild.name}`)
          .setDescription(`Tu cuenta fue creada con exito! Tienes ${Data.Wallet} en tu billetera`)
          .setColor(client.config.prefix)

          interaction.reply({ embeds: [embed3], ephemeral: true })
           setTimeout(function(){interaction.deleteReply({ embeds: [embed3] })}, 5000);
        }
        break;
        case "dinero": {
          if (!Data) {return interaction.reply({ embeds: [embed4], ephemeral: true }),
          setTimeout(function(){interaction.deleteReply({ embeds: [embed4] })}, 5000)
        };

          const embed = new EmbedBuilder()
          .setTitle(`Banco de ${interaction.guild.name}`)
          .setDescription(`**Banco:** $${Data.Bank}\n**Billetera:** $${Data.Wallet}\n**Total:** $${Data.Bank + Data.Wallet}`)
          .setColor(client.config.prefix)

          await interaction.reply({ embeds: [embed] })
        }
        break;
        
        case "eliminar": {
          if (!Data) return interaction.reply({ embeds: [embed4], ephemeral: true })
          setTimeout(function(){interaction.deleteReply({ embeds: [embed4] })}, 5000)

          await Data.delete()

          interaction.reply({ embeds: [embed5], ephemeral: true})
          setTimeout(function(){interaction.deleteReply({ embeds: [embed4] })}, 5000)
        }

        break;
      }
    } catch (err) {
      console.log(err)
    }
    }
}