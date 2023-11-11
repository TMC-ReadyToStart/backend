import { fstat } from "fs";
import fs from "fs";

const { BardAPI } = require("bard-api-node");
const assistant = new BardAPI();

export async function setupAssistant() {
  // Set session information for authentication
  await assistant.setSession(
    "__Secure-1PSID",
    "dAh_Job8Y-qTSaVUrOIdPTL-_vap2RGcUtrFZjNG6v1wV1zUWr0LeaJufOz7cFYOaEzjuw."
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
  }
}

export async function testAssistant(request: string) {
  try {
    const response = await assistant.getBardResponse(request);
    console.log("Bard:", response.content);
    return response.content;
  } catch (error) {
    console.error("Error:", error);
  }
}
