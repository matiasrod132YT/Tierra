const {
  Client,
  GatewayIntentBits,
  Partials,
  ChannelType,
  Events,
  Collection,
  EmbedBuilder,
} = require("discord.js");
const mongoose = require("mongoose");

require("discord-player/smoothVolume");
const { Player } = require("discord-player");

const { Guilds, GuildMembers, GuildMessageReactions, GuildMessages, MessageContent, GuildVoiceStates } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessageReactions, GuildMessages, MessageContent, GuildVoiceStates],
  partials: [User, Message, GuildMember, ThreadMember],
});

mongoose.connect("mongodb+srv://Matiasrod132:Wesersa12345@tierra.dhgdheq.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Conectado correctamente a MongoDB.")
}).catch(() => {
  console.log("Ocurrio un error al conectarse a MongoDB.")
})

const { loadEvents } = require("./Handlers/eventHandler");

client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();

loadEvents(client);

const player = new Player(client);
player.on("trackStart", (queue, track) =>
  queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`)
);

// Add the player on the client
client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

client.login(client.config.token);

const config = require(`${process.cwd()}/config.json`);
require(`colors`);

process.on("unhandledRejection", (razon, p) => {
  const CanalId = "1055744060230467634";
  console.error("Unhandled promise rejection:", razon, p);
  const Embed = new EmbedBuilder()
    .setTitle("Error Encontrado")
    .setFooter({ text: "⚠️Sistema AntiCrash" })
    .setTimestamp()
    .setColor("#FF3939");
  const Canal = client.channels.cache.get(CanalId);
  if (!Canal) return;
  Canal.send({
    embeds: [
      Embed.setDescription(
        "```" + razon + "```"
      ),
    ],
  });
});

const nivelSchema = require("./schemas/nivel/nivel");
const nivelStatusSchema = require("./schemas/nivel/nivelStatus");
client.on(Events.MessageCreate, async (message) => {
  
  const { guild, author } = message;

  const nivelstatus = await nivelStatusSchema.findOne({ GuildID: guild.id })

  if(!nivelstatus) {
    nivelStatusSchema.create({
      GuildID: guild.id,
      Leveling: false
    })
}

  if(!nivelstatus.status) return;
  
  if(!guild || author.bot) return;

  nivelSchema.findOne({ Guild: guild.id, User: author.id}, async (err, data) => {
    if (err) throw err;

    if(!data) {
      nivelSchema.create({
        Guild: guild.id,
        User: author.id,
        XP: 0,
        Level: 0,
        Status: false,
      })
    }
  })

  const channel = message.channel;
  
  const give = 1;
  
  const data = await nivelSchema.findOne({ Guild: guild.id, User: author.id});

  if(!data) return;

  const features = await nivelStatusSchema.findOne({ GuildID: guild.id })

  if (features.Leveling === false) return;

  const requiredXP = data.Level * data.Level * 20 + 20;

  if (data.XP + give >= requiredXP) {

    data.XP += give;
    data.Level += 1;
    await data.save()
    
    if(!channel) return;

    const embed = new EmbedBuilder()
    .setColor(client.config.prefix)
    .setDescription(`${author}, Haz subido de nivel a nivel ${data.Level}!`)

    channel.send({ embeds: [embed] });
  } else {
    data.XP += give;
    data.save()
  }
})