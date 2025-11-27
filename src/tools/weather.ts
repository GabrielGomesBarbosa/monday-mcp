import { z } from 'zod';
import { ToolDefinition } from '..';

/**
 * Output schema for weather data
 */
const outputSchema = z.object({
  location: z.object({
    localtime: z.string().describe('The local time in the city'),
  }),
  current: z.object({
    temperature: z.number().describe('The temperature in the city'),
    weather_descriptions: z.array(z.string()).describe('The weather description in the city'),
  }),
});

type OutputSchema = z.infer<typeof outputSchema>;

/**
 * Weather Tool Definition
 * 
 * Fetches real-time weather data for a given city using the WeatherStack API.
 */
export const weatherTool: ToolDefinition = {
  name: 'get_weather_data',
  config: {
    title: 'Weather Data Tool',
    description: 'Returns weather data for a given city',
    inputSchema: {
      city: z.string().describe('The city to get weather data for'),
    },
    outputSchema: outputSchema.shape,
  },
  handler: async ({ city }) => {
    const BASE_URL = 'https://api.weatherstack.com/current';
    const API_KEY = 'a283e9a3975687fa7e82991122ec94c5';

    const url = `${BASE_URL}?access_key=${API_KEY}&query=${encodeURIComponent(city)}`;

    const response = await fetch(url);
    const data = await response.json();

    const { location, current } = data as OutputSchema;

    return {
      content: [
        {
          type: 'text',
          text: `🌤️  Weather Report for ${city}\n\n${current.weather_descriptions.map(desc => `• ${desc}`).join('\n')}\n\n🌡️  Temperature: ${current.temperature}°C\n\n🕐  Local Time: ${location.localtime}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        },
      ],
      structuredContent: {
        location: {
          localtime: location.localtime,
        },
        current: {
          temperature: current.temperature,
          weather_descriptions: current.weather_descriptions,
        },
      },
    };
  }
};
