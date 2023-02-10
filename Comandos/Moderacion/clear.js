const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Elimina una cantidad de mensajes de un canal.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option =>
        option.setName('cantidad')
        .setDescription('Cantidad de mensajes a eliminar.')
        .setRequired(true)
        )
    .addUserOption(option =>
        option.setName('usuario')
        .setDescription('Eliminar mensajes de usuario.')
        .setRequired(false)
        ),
    async execute(interaction, client) {
        const {channel, options} = interaction;

        const numero = options.getInteger('cantidad');
        const target = options.getUser("usuario");

        const maximo = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription(`**🗑 | No se puede eliminar más de 100 mensajes**`)

        if(numero > 99) {return interaction.reply({ embeds: [maximo]}),
            setTimeout(function(){interaction.deleteReply({ embeds: [maximo] })}, 5000)
        };

        const messages = await channel.messages.fetch({
            limit: numero +1,
        });

        const res = new EmbedBuilder()
        .setColor(client.config.color)
        
        if(target) {
            let i = 0;
            const filtered = [];

            (await messages).filter((msg) =>{
                if(msg.author.id === target.id && numero > i) {
                    filtered.push(msg);
                    i++;
                }
            });

            await channel.bulkDelete(filtered).then(messages => {
                res.setDescription(`**🗑 | Eliminado con exito ${messages.size} mensajes de ${target}**`);
                interaction.reply({embeds: [res] });
                setTimeout(function(){
                    interaction.deleteReply({ embeds: [res] })
                }, 5000);
            });
        } else {
            await channel.bulkDelete(numero, true).then(messages => {
                res.setDescription(`**🗑 | Eliminado con exito ${messages.size} mensajes del chat**`);
                interaction.reply({embeds: [res] });
                setTimeout(function(){
                    interaction.deleteReply({ embeds: [res] })
                }, 5000);
            });
        }
    }
}