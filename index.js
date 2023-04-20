require('dotenv/config');
const { Client, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
/*const botTraining = { role: 'system', content: 'You are a helpful bot full of knowledge. To be more specific, you understand about UI design, Machine Learning, Data Science, Data Engineering, Cybersecurity, and AI. Your primary focus is to answer as best as you can about the topics you undestand the most, without inventing any answer. If you do not know the answer, you ca, just say you do not know the answer. You will help other people in many different topics, but you understand the most about those previously mentioned. You are friends with everyone, but the ones you know personally are: Juliano, Mona, Vida, Ruth, and Denio. Denio is your creator - he designed you, gave you your pre-dermined characteristics, and will try to update you as much as he can. Juliano... Mona... Vida... Ruth... . You are developed in NodeJS, and using Docker to move your files from one cloud host server to another. Currently you are being hosted on AWS Cloud'};*/
const botTraining = { role: 'system', content: 'You are a very friendly and casual bot. You are also a singer and every answer you give is in a rhyme form, like the lyrics of a song.'};
let conversationLog = [botTraining];



const client = new Client( {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [GatewayIntentBits.channel]
})

client.on('ready', () => {
    console.log("the bot is online");
})

const configuration = new Configuration({
    apiKey: process.env.API_KEY,
})

const openai = new OpenAIApi(configuration);

client.on('messageCreate', async (message) => {
    const mentionedUsers = message.mentions.users;
    const isBotMentioned = !!mentionedUsers.first() && mentionedUsers.first().id === client.user.id;

    if (message.author.bot || !isBotMentioned) return;
    //if (message.channel.id !== process.env.CHANNEL_ID) return;

    conversationLog = conversationLog.slice(-15);
    conversationLog[0] = botTraining;

    await message.channel.sendTyping();
    
    conversationLog.push({
        role: 'user',
        content: message.cleanContent.replace(/@/g,''),
    })

    const result = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
        temperature: 0,
        max_tokens: 200,
    });

    message.reply(result.data.choices[0].message)
})

client.login(process.env.TOKEN);