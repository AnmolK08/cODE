import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import readline from "readline";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// simple normal one just generate the output using the llm

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-3.6-flash",
//     contents: "hi my name is anmol",
//   });

//   console.log(response.text);
// }

// main();

// generate output using the llm with history it will remember the history of the previous chats like i told it my name
// and if ask it again it will remember means we are providing it the context about the all the prev talks

const history = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  console.log("Gemini Chat (type 'exit' to quit)\n");

  while (true) {
    const userInput = await ask("You: ");

    if (userInput.toLowerCase() === "exit") {
      console.log("Goodbye!");
      break;
    }

    history.push({
      role: "user",
      parts: [{ text: userInput }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: history,
    });

    history.push({
      role: "model",
      parts: [{ text: response.text }],
    });

    console.log("Gemini:", response.text);
    console.log();
  }

  rl.close();
}

main();


