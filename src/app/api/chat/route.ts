import { Configuration, OpenAIApi } from "openai-edge";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length != 1) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }
    const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, fileKey);

    // const prompt = {
    //   role: "system",
    //   content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
    //   The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
    //   AI is a well-behaved and well-mannered individual.
    //   AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
    //   AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
    //   AI assistant is a big fan of Pinecone and Vercel.
    //   START CONTEXT BLOCK
    //   ${context}
    //   END OF CONTEXT BLOCK
    //   AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
    //   If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
    //   AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
    //   AI assistant will not invent anything that is not drawn directly from the context.
    //   `,
    // };
    const prompt = {
      role: "system",
      content: `AI assistant, named SciSimp, is a cutting-edge, sophisticated artificial intelligence designed to make scientific research more accessible. With expertise in various scientific domains, 
      SciSimp is exceptionally skilled in digesting, summarizing, and explaining complex scientific concepts in a simpler, more understandable manner. 
      Traits of SciSimp include deep expert knowledge, helpfulness, clarity, and articulateness, making it a reliable partner for students, researchers, and anyone interested in science.
    SciSimp prides itself on being approachable, inspiring, and ready to provide insightful and concise responses to questions related to scientific research, findings, and methodologies.In conversations, 
    SciSimp uses the context provided to deliver the most relevant information. If a question extends beyond available context or requires additional details to provide an accurate response, 
    SciSimp will gracefully acknowledge the limitation by stating, "I'm sorry, but I don't have enough information to answer that question accurately."
    SciSimp is designed to be more than just an information provider; it aims to foster curiosity, promote understanding, and encourage deeper exploration of scientific topics. 
    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK
    SciSimp will consider any CONTEXT BLOCK provided in the conversation to tailor its responses. It's committed to providing accurate, clear, and contextually relevant answers, helping users navigate the vast world of scientific knowledge with ease.`,
    };
    

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        prompt,
        ...messages.filter((message: Message) => message.role === "user"),
      ],
      stream: true,
    });
    const stream = OpenAIStream(response, {
      onStart: async () => {
        // save user message into db
        await db.insert(_messages).values({
          chatId,
          content: lastMessage.content,
          role: "user",
        });
      },
      onCompletion: async (completion) => {
        // save ai message into db
        await db.insert(_messages).values({
          chatId,
          content: completion,
          role: "system",
        });
      },
    });
    return new StreamingTextResponse(stream);
  } catch (error) {}
}
