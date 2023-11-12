import OpenAI from "openai";
import fs from "fs";
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const levels = ["Simple", "Moyen", "Dur"];
let already_setup: boolean = false;

let conversationContext: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
  [];

export function clear() {
  conversationContext = [];
}
async function example() {
  const setup = fs.readFileSync("src/contexts/contextMCQDur.txt", "utf8");
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "system", content: setup }],
    model: "gpt-3.5-turbo",
  });
  console.log(chatCompletion.choices);
  conversationContext.push({ role: "system", content: setup });
  conversationContext.push({
    role: "assistant",
    content: chatCompletion.choices[0].message.content,
  });
}

export async function setupAssistant() {
  // Set session information for authentication
  /* await assistant.setSession(
    "__Secure-1PSID",
    "cwjOPzvzgSSUcwTPvdgM15ldSyHcqYItNPTa1I2ErkVBgwoM8BEMXF3Rqtp49xIePowXRQ."
  ); // or '__Secure-3PSID'
  const setup = fs.readFileSync("src/contexts/context.txt", "utf8");
  try {
    const response = await assistant.getBardResponse(setup);
    if (!response.content.includes("Comprise")) {
      console.log("Bard: failed to setup context");
      setupAssistant();
    }
    console.log("Bard:", response.content);
  } catch (error) {
    console.error("Error:");
    setupAssistant();
  } */
}

export async function get_infos(file_tree: string) {
  const file = fs.readFileSync(`src/contexts/contextDescription.txt`, "utf8");
  conversationContext.push(
    { role: "system", content: file },
    { role: "assistant", content: "Compris" }
  );
  const chatCompletion = await openai.chat.completions.create({
    messages: [...conversationContext, { role: "user", content: file_tree }],
    model: "gpt-3.5-turbo",
  });
  console.log(chatCompletion.choices[0].message.content);
  return chatCompletion.choices[0].message.content;
}

async function setup(level: number) {
  if (already_setup) {
    return;
  }
  console.log("setup");
  const file = fs.readFileSync(
    `src/contexts/contextMCQ${levels[level]}.txt`,
    "utf8"
  );
  conversationContext = [{ role: "system", content: file }];
  const res = await openai.chat.completions.create({
    messages: [{ role: "system", content: file }],
    model: "gpt-3.5-turbo",
  });
  conversationContext.push({
    role: "assistant",
    content: res.choices[0].message.content,
  });
  console.log("response setup", res.choices[0].message.content);
  already_setup = true;
  return;
}

export async function testAssistant(request: string, level: number) {
  try {
    console.log("test assistant");
    await setup(level);
    console.log("request", request);
    const chatCompletion = await openai.chat.completions.create({
      messages: [...conversationContext, { role: "user", content: request }],
      model: "gpt-3.5-turbo",
    });
    conversationContext.push({
      role: "user",
      content: request,
    });
    conversationContext.push({
      role: "assistant",
      content: chatCompletion.choices[0].message.content,
    });
    console.log(chatCompletion.choices[0].message.content);
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
  }
}
