import { getCerebrasClient, getTavilyClient, SYSTEM_PROMPT } from '@/lib/agent-config';
import { NextRequest } from 'next/server';

const tools = [
  {
    type: 'function',
    function: {
      name: 'web_search',
      description: 'Search the web for academic sources, peer-reviewed journals, and educational information.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query to find academic information or sources.',
          },
        },
        required: ['query'],
      },
    },
  },
];

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    // Validate credentials early
    const cerebras = getCerebrasClient();
    const tvly = getTavilyClient();

    const fullMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ];

    // Initial call to check for tool usage
    let response = await (cerebras.chat.completions.create({
      model: 'qwen-3-32b',
      messages: fullMessages,
      tools: tools as any,
      tool_choice: 'auto',
    }) as any);

    let currentMessage = response.choices[0].message;

    // Handle tool calls in a loop (non-streaming for tools)
    while (currentMessage.tool_calls && currentMessage.tool_calls.length > 0) {
      fullMessages.push(currentMessage as any);

      for (const toolCall of currentMessage.tool_calls) {
        const tc = toolCall as any;
        if (tc.function.name === 'web_search') {
          const { query } = JSON.parse(tc.function.arguments);
          const searchResult = await tvly.search(query, {
            searchDepth: 'advanced',
            maxResults: 5,
          });

          fullMessages.push({
            role: 'tool',
            tool_call_id: tc.id,
            content: JSON.stringify(searchResult),
          } as any);
        }
      }

      // Check if another tool call is needed or if we should get the final response
      response = await (cerebras.chat.completions.create({
        model: 'qwen-3-32b',
        messages: fullMessages,
        tools: tools as any,
      }) as any);

      currentMessage = response.choices[0].message;
    }

    // Now we have the final context, let's stream the actual response
    const stream = await (cerebras.chat.completions.create({
      model: 'qwen-3-32b',
      messages: fullMessages,
      stream: true,
      reasoning_format: 'raw',
    }) as any);

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = (chunk as any).choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (e) {
          console.error('Streaming error:', e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal Server Error',
      details: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
