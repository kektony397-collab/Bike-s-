
import { GoogleGenAI } from "@google/genai";

// Ensure you have the API key set in your environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export interface DrivingData {
  averageSpeed: number; // km/h
  accelerationEvents: number; // count of rapid accelerations
  brakingEvents: number; // count of hard brakes
  distance: number; // km
}

export const analyzeDrivingData = async (data: DrivingData): Promise<string> => {
  if (!API_KEY) {
    return "AI analysis is currently unavailable. Please configure the Gemini API key.";
  }
  
  try {
    const prompt = `
      Analyze the following bike driving data and provide actionable suggestions to improve mileage.
      The user is on a commuter bike in India. Be concise and encouraging.

      Driving Data:
      - Average Speed: ${data.averageSpeed.toFixed(1)} km/h
      - Rapid Acceleration Events: ${data.accelerationEvents}
      - Hard Braking Events: ${data.brakingEvents}
      - Total Distance Tracked: ${data.distance.toFixed(2)} km

      Provide 2-3 specific tips based on this data. Format the output as a friendly chat message.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I couldn't analyze the data right now. There might be an issue with the AI service.";
  }
};
