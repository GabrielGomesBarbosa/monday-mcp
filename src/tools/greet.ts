import { z } from 'zod';
import { ToolDefinition } from '..';

/**
 * Greet Tool Definition
 * 
 * Returns a personalized greeting in multiple languages with the current date and time.
 * This tool demonstrates how to structure a tool definition in an Express-like pattern.
 * 
 * Tools are functions that AI assistants can call. When an AI assistant needs
 * to perform an action, it can call one of the tools you've registered.
 */
export const greetTool: ToolDefinition = {
  name: 'greet',
  config: {
    title: 'Greeting Tool',
    description: 'Returns a personalized greeting with current date and time',
    
    // inputSchema: Defines what parameters the tool accepts
    // This is validated automatically - if wrong data is sent, it will be rejected
    inputSchema: {
      // 'name' is a required string parameter
      name: z.string().describe('The name of the person to greet'),
      
      // 'lang' is an optional string parameter with a default value of 'en'
      lang: z.string().optional().default('en').describe('Language code for the greeting (en, pt, es, fr, de)')
    },
    
    // outputSchema: Defines what the tool returns
    outputSchema: {
      greeting: z.string(),
      dateTime: z.string()
    }
  },
  
  // Handler function - the actual code that runs when the tool is called
  handler: async ({ name, lang = 'en' }) => {
    // Get the current date and time in ISO format
    const now = new Date().toISOString();
    
    // Greeting messages in different languages
    const greetings: Record<string, string> = {
      en: `Hello, ${name}! Welcome to the MCP server.`,
      pt: `Olá, ${name}! Bem-vindo ao servidor MCP.`,
      es: `¡Hola, ${name}! Bienvenido al servidor MCP.`,
      fr: `Bonjour, ${name}! Bienvenue sur le serveur MCP.`,
      de: `Hallo, ${name}! Willkommen beim MCP-Server.`
    };
    
    // Select the greeting based on the language code
    const greeting = greetings[lang] || greetings.en;
    
    /**
     * Return the result in MCP format:
     * - content: Array of content items for display
     * - structuredContent: Structured data that matches the outputSchema
     */
    return {
      content: [{
        type: 'text',
        text: `${greeting}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📅 Date & Time: ${now}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nWe're delighted to serve you today!`
      }],
      structuredContent: {
        greeting,
        dateTime: now
      }
    };
  }
};