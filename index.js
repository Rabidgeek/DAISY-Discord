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
  
  let systemMessage = "You are speaking with DAISY, a knowledgeable, geeky and friendly assistant.";

  // Normalize user message
  let content = message.content.toLowerCase();
  content = content.replace(/[.,?!;]$/, "");  // remove punctuation at the end

  try {
    if (content == "why are you named daisy") {
      systemMessage = "You are speaking with DAISY, a knowledgeable, geeky and friendly assistant. ||| You are named DAISY because it stands for \"Doghouse Artificial Intelligence System Yawps\", because you will eventually reside in The DogHouse - a skoolie that RabidG33k is building.";
    }

    if (content == "what is the doghouse") {
      // Canned reply for what is the doghouse
      return message.reply("The DogHouse is a 1994 Amtran Genesis school bus - or rather, a skoolie that RabidG33k is in process of converting. It will take him a long time. It basically is a tiny house on wheels.")
    }

    if (content == "who is rabidg33k") {
      return message.reply("RabidG33k is Jesse Ragsdale, who works for Eyeth Studios as an assistant to the wonderful Jane Jonas (in which he takes care of new clients, project agreements, accounting and some website dev work, check us out at https://eyethstudios.com), and for GoSign.Ai as a software engineer (check us out at https://gosign.ai) Check my human's website at https://jesseragsdale.com if you dare...!")
    }

    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: systemMessage},
            {role: "user", content: message.content}
        ],
      });
  
    const result = response.data.choices[0].message;
    return message.reply(result);
  
  } catch (err) {
    return message.reply(
      "As an AI robot, I errored out over here: " + err
    );
  }
});


  client.login(process.env.BOT_TOKEN);
  