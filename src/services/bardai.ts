import { fstat } from "fs";
import fs from "fs";

const { BardAPI } = require("bard-api-node");
const assistant = new BardAPI();

export async function setupAssistant() {
  // Set session information for authentication
  await assistant.setSession(
    "__Secure-1PSID",
    "dAho_07htO5jVISyTAEmu4TigUYrvSEh9ocjNPnGLEK8BdRj8f8K-tRs6GFI7tnBwOoVGw."
  ); // or '__Secure-3PSID'
  const setup = `Entrée:\
Un file tree d'un projet, le tout suivi du contenu de chaque fichier. Le contenu de chaque fichier est précédé par un commentaire contenant le nom du fichier. Le tout est séparé par des sauts de ligne.\

Sortie:\
Un fichier JSON contenant une seule question portant sur la compréhension des modules et des fonctions (demander quel est l'usage d'une certaine fonction), et quatre réponses,ainsi que la bonne répoonse, parmi lesquelles seule une est la bonne. Le fichier JSON doit être structuré de la manière suivante :\
JSON\
{\
  "question": "La question",\
  "réponses": [\
    "La réponse correcte",\
    "Une réponse incorrecte",
    "Une autre réponse incorrecte",
    "Encore une réponse incorrecte"
  ],\
  "bonne réponse": "La réponse correcte"\
}

Assure toi de me repondre sans introduction, sans explications, sans rien d'autre que le json. J'ai besoin de savoir si tu as compris. Je ne veux pas de code, je veux du json.
As tu compris? Si oui réponds exclusivement et uniquement par "compris"`;
  const response = await assistant.getBardResponse(setup);
  console.log("Bard:", response.content);
}

export async function testAssistant(request: string) {
  try {
    // ...

    // Send a query to Bard

    const response = await assistant.getBardResponse(request);
    console.log("Bard:", response.content);
  } catch (error) {
    console.error("Error:", error);
  }
}
