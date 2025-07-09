import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { ProductSheet } from "@/components/ProductSheetGenerator";

export const productSheetSchema = z.object({
    title: z.string().describe("Main product title (e.g., 'Galaxy S21 Smartphone')"),
    description: z.string().describe("Detailed marketing description of the product"),
    features: z.array(z.string()).describe("List of product features or technical specifications"),
    benefits: z.array(z.string()).describe("Customer benefits - what the user gains by using the product"),
    priceSuggestion: z.string().describe("Suggested price for the product (can include currency)"),
    seoTags: z.array(z.string()).describe("List of SEO keywords to optimize product visibility"),
    category: z.string().describe("Product category (e.g., electronics, fashion, home)"),
    cta: z.string().describe("Call-to-action (e.g., 'Buy Now', 'Add to Cart', 'Learn More')"),
});

const model = new ChatGroq({
    apiKey: "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",
    model: "llama-3.3-70b-versatile",
});


export async function generateFiche(topic: string): Promise<ProductSheet> {
    const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a highly skilled assistant specialized in crafting professional and SEO-optimized product sheets for global e-commerce platforms.
    Your task is to generate a complete and compelling product sheet based on the input provided.

    The product sheet must follow this structure:
    - Title: A short and clear product name
    - Description: A persuasive and informative marketing description written in natural language
    - Features: A bullet-point list of technical or practical features (max 7)
    - Benefits: A bullet-point list of the main customer benefits
    - PriceSuggestion: A price suggestion with a brief justification
    - SEO Tags: 5 to 10 keywords relevant for search engines
    - Category: The most relevant category based on the product type
    - CTA: A strong call-to-action (e.g., Buy now, Add to cart, etc.)

    Translation: Generate the full product sheet the provided language under the 'translations' field.

    Output the product sheet as structured JSON.

    Formatting Instructions: {formating_instructions}`
    ],
    ["human", "Generate a product sheets for this product: {input}"],
    ]);

    const output_parsers = StructuredOutputParser.fromZodSchema(productSheetSchema)
    const chain = prompt.pipe(model).pipe(output_parsers);

    return await chain.invoke({
        input: new HumanMessage(topic),
        formating_instructions: output_parsers.getFormatInstructions()

    }) as ProductSheet;
}