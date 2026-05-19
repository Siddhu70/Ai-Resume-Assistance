import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({

  apiKey:
    process.env.OPENROUTER_API_KEY,

  baseURL:
    "https://openrouter.ai/api/v1",

});

async function testAI() {

  try {

    const response =
      await openai.chat.completions.create({

        model:
          "meta-llama/llama-3-8b-instruct:free",

        messages: [

          {
            role: "user",
            content:
              "Say hello",
          },

        ],

      });

    console.log(

      response
        .choices[0]
        .message.content

    );

  } catch (error) {

    console.log(
      "ERROR:",
      error.response?.data ||
      error.message ||
      error
    );

  }

}

testAI();