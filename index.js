import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { Configuration, OpenAIApi } from "openai";
import express from "express";


dotenv.config();

const app = express();

const port = process.env.PORT || 3000; // Use the assigned port or fallback to 3000
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Route for the root path
app.get("/", (req, res) => {
  res.send("Hello, this is your Discord bot!");
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

async function runCompletion (message) {
  const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message,
      max_tokens: 200,
  });
  return completion.data.choices[0].text;
}

client.on("messageCreate", async function (message) {
    if (message.author.bot) return;
    
    if(message.content.startsWith("#")) {
      runCompletion(message.content.substring(1)).then(result => bot.createMessage(message.channel.id, result));
  } 

    try {
      const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
              {role: "system", content: "You are a helpful assistant who responds succinctly"},
              {role: "user", content: message.content}
          ],
        });
  
      const content = response.data.choices[0].message;
      return message.reply(content);
  
    } catch (err) {
      return message.reply(
        "As an AI robot, I errored out over here: " + err
      );
    }
  });

  client.login(process.env.BOT_TOKEN);
  