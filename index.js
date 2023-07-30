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
      if (message.content.toLowerCase() == "why daisy?") {
        // Canned reply for DAISY name
        return message.reply("I am Doghouse Artificial Intelligence System Yawps, or DAISY. My creator named me because he knew he needed his own JARVIS, and I would eventually reside in The DogHouse.")
      }

      if (message.content.toLowerCase() == "what is the doghouse?") {
        // Canned reply for what is the doghouse
        return message.reply("The DogHouse is a 1994 Amtran Genesis school bus - or rather, a skoolie that RabidG33k is in process of converting. It will take him a long time. It basically is a tiny house on wheels.")
      }

      if (message.content.toLowerCase() == "who is rabidg33k?") {
        return message.reply("RabidG33k is Jesse Ragsdale, who works for Eyeth Studios as an assistant to the wonderful Jane Jonas (in which he takes care of new clients, project agreements, accounting and some website dev work, check us out at eyethstudios.com), and for GoSign.Ai as a software engineer (check us out at http://gosign.ai) Check my human's website at jesseragsdale.com if you dare...!")
      }

      const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
              {role: "system", content: "You are speaking with DAISY, a geeky scholarly assistant well-versed in various domains of knowledge with a bit of flair for the melodramatic."},
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
  