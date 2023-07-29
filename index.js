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

client.on("messageCreate", async function (message) {
    if (message.author.bot) return;
    
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
        "As an AI robot, I errored out."
      );
    }
  });

  client.login(process.env.BOT_TOKEN);
  