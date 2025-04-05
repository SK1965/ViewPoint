import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { wrapLanguageModel, extractReasoningMiddleware } from 'ai';

const prompt = `Generate a concise, engaging title for the following content. The content may be a question, request for help, personal experience, or suggestion. 

If the content involves a mystery, unresolved problem, personal journey, dramatic situation, or surprising revelation, create a SUSPENSEFUL title that:
- Creates curiosity without revealing the conclusion
- Uses intriguing language that prompts the reader to discover more
- Hints at the content's significance without giving everything away

For all other content types, create a STRAIGHTFORWARD title that:
- Accurately reflects the main topic or purpose
- Is clear and informative about what readers will find

In both cases, the title should:
1. Be between 3-10 words long
2. Use language appropriate to the content's tone
3. Include relevant keywords for searchability
4. Avoid misleading clickbait elements

OUTPUT FORMAT:
- Provide ONLY the title with no additional text, explanation, or quotation marks
- Do not include any introductory phrases like "Title:" or "Here's a title:"
- The complete response must be only the title itself

EXAMPLES:

Example 1: Question/Help Request
Content: "I've been trying to grow tomatoes in my backyard for the past two summers, but they always end up with brown spots and eventually die before producing much fruit. I've tried different watering schedules and soil types but nothing seems to work. Does anyone have suggestions for what might be causing this and how to fix it?"
Output: Solving the Mystery of Dying Tomato Plants

Example 2: Personal Experience
Content: "Last weekend I went hiking alone in the mountains when suddenly the weather changed. Dark clouds rolled in, and I found myself caught in a severe thunderstorm miles from shelter. What happened next changed how I prepare for outdoor adventures forever."
Output: Stranded: How One Thunderstorm Forever Changed My Hiking Habits

Example 3: Advice/Suggestion
Content: "I've developed a simple system for organizing digital files that has saved me countless hours of searching. It involves creating a specific folder structure, using consistent naming conventions, and implementing a regular review process to prevent digital clutter."
Output: Three-Step System for Effortless Digital Organization

Example 4: Technical Question
Content: "When I run my Python script that uses pandas to analyze CSV data, it works fine with small files but crashes with memory errors on files larger than 500MB. I've tried increasing the chunk size but still have issues. Is there a way to process these large files efficiently without upgrading my hardware?"
Output: Memory Errors: Conquering Large CSV Files in Python

Example 5: Sharing a Discovery
Content: "I accidentally discovered that mixing baking soda with my regular laundry detergent makes my white clothes noticeably brighter. I've been experimenting with different ratios and washing temperatures, and I'm amazed at the results compared to commercial whitening products."
Output: The Kitchen Ingredient That Outperforms Commercial Whiteners

Below is the content that needs a title:

[PASTE CONTENT HERE]`;



const groq = createGroq({
    apiKey : process.env.GROQ_MODEL_API_KEY
});


const enhancedModel = wrapLanguageModel({
  model: groq('llama3-70b-8192'),
  middleware: extractReasoningMiddleware({ tagName: 'think' }),
});

const title_generation = async(content  :string)=>{
    const updatedPrompt = prompt.replace("[PASTE CONTENT HERE]", content);
    const { text } = await generateText({
                        model: enhancedModel,
                        prompt: updatedPrompt
                     });
    console.log(text);
    
    return text

}

export default title_generation;

