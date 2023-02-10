const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: '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',
});

const openai = new OpenAIApi(configuration);

module.exports = {
    data: new SlashCommandBuilder()
    .setName("chatgpt")
    .setDescription("Pregunta algo a la Inteligencia Artificial")
    .addStringOption(option =>
        option
            .setName("pregunta")
            .setDescription("Pregunta algo")
            .setRequired(true)
    ),

    async execute(interaction, client) {

        await interaction.deferReply();

        const question = interaction.options.getString("pregunta");
        try {
            const rest = await openai.createCompletion({
                model: 'text-davinci-003',
                max_tokens: 2048,
                temperature: 0.5,
                prompt: question
            })

            const embed = new EmbedBuilder()

            .setDescription(`\`\`\`${rest.data.choices[0].text}\`\`\``)
            .setColor(client.config.color)


            await interaction.editReply({ embeds: [embed] });
            
        } catch(e) {
            return await interaction.editReply({ content: `Solicitud fallida. Codigo de error **${e.response.status}**`, ephemeral: true})
        }
    }
}