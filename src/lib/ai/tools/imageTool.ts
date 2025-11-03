import { tool } from "@langchain/core/tools";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "<YOUR_SITE_URL>",
    "X-Title": "<YOUR_SITE_NAME>",
  },
});

export const describeImageTool = tool(
  async ({ image_url }) => {
    /**
     * Analyze the given image and describe its content.
     */
    try {
      const completion = await openai.chat.completions.create({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "What is in this image?" },
              { type: "image_url", image_url: { url: image_url } },
            ],
          },
        ],
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Error describing image:", error);
      return "I couldnt analyze that image.";
    }
  },
  {
    name: "describe_image",
    description:
      "Use this tool when the user provides an image URL or asks about what's in a picture. It visually analyzes the image content.",
    schema: z.object({
      image_url: z
        .string()
        .url()
        .describe(
          "Direct URL (ending with .jpg, .png, or similar) of the image the user wants described."
        ),
    }),
  }
);











// Describe this image: https://upload.wikimedia.org/wikipedia/commons/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg