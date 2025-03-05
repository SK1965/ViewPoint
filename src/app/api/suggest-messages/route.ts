import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const groq = createGroq({
    apiKey : process.env.GROQ_MODEL_API_KEY
});

import { wrapLanguageModel, extractReasoningMiddleware } from 'ai';

const enhancedModel = wrapLanguageModel({
  model: groq('llama3-70b-8192'),
  middleware: extractReasoningMiddleware({ tagName: 'think' }),
});

const { text } = await generateText({
    model: enhancedModel,
    prompt: 'write a essay on a your model',
  });

  export async function GET(request:Request) {
    return new Response(
        JSON.stringify({
          success: false,
          data : text,
          message: "Not Authenticated",
        }),
        {
          status: 200,
        }
      );
  }