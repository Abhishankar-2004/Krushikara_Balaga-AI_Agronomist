



import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Language } from "../types";

// Ensure API_KEY is available in the environment
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelName = 'gemini-2.5-flash';

const robustJsonParse = (rawText: string): any => {
    let jsonString = rawText.trim();
    
    // Clean markdown fences
    if (jsonString.startsWith('```json')) {
        jsonString = jsonString.substring(7, jsonString.length - 3).trim();
    } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.substring(3, jsonString.length - 3).trim();
    }

    const firstBracket = jsonString.indexOf('[');
    const firstBrace = jsonString.indexOf('{');
    
    let start = -1;
    
    if (firstBracket === -1) {
        start = firstBrace;
    } else if (firstBrace === -1) {
        start = firstBracket;
    } else {
        start = Math.min(firstBracket, firstBrace);
    }

    if (start !== -1) {
        const lastBracket = jsonString.lastIndexOf(']');
        const lastBrace = jsonString.lastIndexOf('}');
        const end = Math.max(lastBracket, lastBrace);

        if (end > start) {
            jsonString = jsonString.substring(start, end + 1);
        }
    }
    
    return JSON.parse(jsonString);
};


export interface SchemeInfoWithSources {
  summary: string;
  sources: Array<{ uri: string; title: string }>;
  error?: string;
}

export interface WeatherForecast {
  day: string;
  condition: string;
  tempHigh: number;
  tempLow: number;
  windSpeed: number;
  humidity: number;
  isPast: boolean;
}
export interface WeatherAdvisory {
    location: string;
    forecast: WeatherForecast[];
    advisory: string;
    error?: string;
}

export interface FertilizerRecommendation {
  crop: string;
  area: number;
  unit: string;
  recommendation: {
    n: number;
    p: number;
    k: number;
  };
  applicationNotes: string;
  commonFertilizers: string;
  error?: string;
}

export interface LoanInfo {
    schemeName: string;
    bank: string;
    interestRate: string;
    maxAmount: string;
    tenure: string;
    eligibility: string;
    summary: string;
    howToApply: string;
}

export interface MarketTrendItem {
    cropName: string;
    change: number;
    currentPrice: number;
}

export interface MarketTrends {
    topRisers: MarketTrendItem[];
    topFallers: MarketTrendItem[];
    error?: string;
}

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const diagnoseCrop = async (imageFile: File, language: Language): Promise<string> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const langName = language === Language.KN ? 'Kannada' : 'English';
    const systemInstruction = `You are an expert agronomist specializing in Indian agriculture. Analyze the user-provided image of a plant. You must identify the crop, determine if it has any disease or pest, or state if it's healthy. Provide clear organic and chemical remedies if a disease is found. ALL RESPONSES (crop name, disease, remedies) MUST BE IN ${langName}. You must return a JSON object. If the plant is healthy, the 'disease' field should be the ${langName} word for 'Healthy', and the 'remedies' object can have empty arrays.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: modelName,
        contents: { parts: [imagePart] },
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cropName: { type: Type.STRING, description: "The name of the crop, e.g., 'Tomato Plant'." },
              isHealthy: { type: Type.BOOLEAN },
              disease: { type: Type.STRING, description: "Name of the disease/pest or 'Healthy' if no issue is found." },
              remedies: {
                type: Type.OBJECT,
                properties: {
                  organic: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of organic remedies." },
                  chemical: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of chemical remedies." }
                }
              }
            },
            required: ["cropName", "isHealthy", "disease", "remedies"]
          }
        }
    });

    return response.text;
  } catch (error) {
    console.error("Error in diagnoseCrop:", JSON.stringify(error, null, 2));
    const errorMessage = language === Language.KN ? "ಕ್ಷಮಿಸಿ, ನನಗೆ ಚಿತ್ರವನ್ನು ವಿಶ್ಲೇಷಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. AI ಮಾದರಿ ಕಾರ್ಯನಿರತವಾಗಿರಬಹುದು ಅಥವಾ ದೋಷ ಸಂಭವಿಸಿರಬಹುದು. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ." : "Sorry, I couldn't analyze the image. The AI model might be busy or an error occurred. Please try again later.";
    return JSON.stringify({ error: errorMessage });
  }
};

export const getMarketAnalysis = async (query: string, language: Language): Promise<string> => {
    try {
        const langName = language === Language.KN ? 'Kannada' : 'English';
        const systemInstruction = `You are an expert market analyst for Indian farmers. Analyze the user's query about a crop. Provide a JSON object including the crop name, a market trend ('Rising', 'Falling', or 'Stable'), a recommendation, a summary, and historical price data for the last 7 days. If real-time data isn't available, generate realistic mock data to show a trend. ALL TEXT RESPONSES MUST BE IN ${langName}. The 'trend' values must remain in English. The day names in priceData should be short (e.g., Mon, Tue).`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: modelName,
            contents: query,
            config: {
              systemInstruction: systemInstruction,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  crop: { type: Type.STRING, description: "The crop being analyzed, e.g., 'Tomatoes'."},
                  trend: { type: Type.STRING, description: "The market trend. Must be one of: 'Rising', 'Falling', or 'Stable'."},
                  recommendation: { type: Type.STRING, description: "Clear, actionable advice, e.g., 'This is a good time to sell your harvest.'"},
                  summary: { type: Type.STRING, description: "A brief paragraph explaining the reasoning behind the trend and recommendation."},
                  priceData: {
                    type: Type.ARRAY,
                    description: "An array of the last 7 days of price data.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            day: { type: Type.STRING, description: "The day of the week (e.g., 'Mon', 'Tue')." },
                            price: { type: Type.NUMBER, description: "The price for that day." }
                        },
                        required: ["day", "price"]
                    }
                  }
                },
                required: ["crop", "trend", "recommendation", "summary", "priceData"]
              }
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error in getMarketAnalysis:", JSON.stringify(error, null, 2));
        const errorMessage = language === Language.KN ? "ಕ್ಷಮಿಸಿ, ಇದೀಗ ಮಾರುಕಟ್ಟೆ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. AI ಸೇವೆಯಲ್ಲಿ ಸಮಸ್ಯೆಗಳಿರಬಹುದು. ದಯವಿಟ್ಟು ಕೆಲವು ಕ್ಷಣಗಳಲ್ಲಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ." : "Sorry, I couldn't fetch market analysis right now. The AI service may be experiencing issues. Please try again in a few moments.";
        return JSON.stringify({ error: errorMessage });
    }
};

export const getMarketTrends = async (language: Language): Promise<string> => {
    try {
        const langName = language === Language.KN ? 'Kannada' : 'English';
        const systemInstruction = `You are an expert market analyst for Indian agriculture. Based on your knowledge and recent trends (or realistic simulated data if real-time data is unavailable), identify the top 3 agricultural commodities with the highest price increase and the top 3 with the biggest price drop in the last day.

You MUST respond with a single JSON object. The 'cropName' must be in ${langName}. The 'change' value must be a number representing the percentage change (positive for risers, negative for fallers).`;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: modelName,
            contents: 'Get top market trends for Indian agriculture',
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        topRisers: {
                            type: Type.ARRAY,
                            description: "Top 3 commodities with the highest price increase.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    cropName: { type: Type.STRING },
                                    change: { type: Type.NUMBER, description: "Positive percentage change, e.g., 5.2" },
                                    currentPrice: { type: Type.NUMBER, description: "Current price per quintal" }
                                },
                                required: ["cropName", "change", "currentPrice"]
                            }
                        },
                        topFallers: {
                            type: Type.ARRAY,
                            description: "Top 3 commodities with the largest price decrease.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    cropName: { type: Type.STRING },
                                    change: { type: Type.NUMBER, description: "Negative percentage change, e.g., -3.1" },
                                    currentPrice: { type: Type.NUMBER, description: "Current price per quintal" }
                                },
                                required: ["cropName", "change", "currentPrice"]
                            }
                        }
                    },
                    required: ["topRisers", "topFallers"]
                }
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error in getMarketTrends:", JSON.stringify(error, null, 2));
        const errorMessage = language === Language.KN ? "ಕ್ಷಮಿಸಿ, ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿಗಳನ್ನು ಇದೀಗ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ." : "Sorry, couldn't fetch market trends right now.";
        return JSON.stringify({ error: errorMessage });
    }
};

export const getSchemeInfo = async (query: string, language: Language): Promise<SchemeInfoWithSources> => {
    try {
        const langName = language === Language.KN ? 'Kannada' : 'English';
        const fullPrompt = `You are an expert on Indian government agricultural schemes. A farmer asks about: "${query}". Based on your search results, provide a comprehensive summary of the most relevant scheme IN ${langName}. Structure your response with clear headings for "Scheme Name", "Description", "Eligibility", and "Benefits", all translated to ${langName}. Do not invent a URL. Explain how a farmer can find the application portal, for example, by searching for the official scheme name on a government website.`;
        
        const response = await ai.models.generateContent({
            model: modelName,
            contents: fullPrompt,
            config: {
              tools: [{googleSearch: {}}],
            }
        });

        const summary = response.text;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        
        const sources = groundingChunks
          .map(chunk => chunk.web)
          .filter(web => web?.uri && web?.title) as Array<{ uri: string; title: string }>;
        
        const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());

        return { summary, sources: uniqueSources };
    } catch (error) {
        console.error("Error in getSchemeInfo:", error);
        const errorMessage = language === Language.KN ? "ಕ್ಷಮಿಸಿ, ಆ ಯೋಜನೆಯ ಬಗ್ಗೆ ನನಗೆ ಮಾಹಿತಿ ಸಿಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಬೇರೆ ರೀತಿಯಲ್ಲಿ ಕೇಳಲು ಪ್ರಯತ್ನಿಸಿ." : "Sorry, I couldn't find information on that scheme. Please try phrasing your question differently.";
        return { summary: '', sources: [], error: errorMessage };
    }
};

export const getWeatherAdvisory = async (location: string, language: Language): Promise<string> => {
  try {
    const langName = language === Language.KN ? 'Kannada' : 'English';
    const systemInstruction = `You are a helpful agricultural assistant. Your task is to provide a 7-day weather report and farming advisory for a given location. This report must cover the past 2 days, today, and the next 4 days, in chronological order.

You MUST respond with a single JSON object. Do not include any text, markdown, or formatting before or after the JSON. The JSON object must have the following structure:
{
  "location": "The name of the location provided by the user.",
  "forecast": [
    { "day": "Day of the week", "condition": "A brief weather condition", "tempHigh": number, "tempLow": number, "windSpeed": number, "humidity": number, "isPast": boolean },
    ... (for a total of 7 days)
  ],
  "advisory": "A paragraph of actionable farming advice based on the full 7-day weather data (past and future). The advice should be practical for farmers."
}

DETAILS:
- All text values ('location', 'day', 'advisory') MUST be in ${langName}.
- The 'condition' value MUST be one of the following English strings: 'Sunny', 'Clear', 'Partly Cloudy', 'Cloudy', 'Rain', 'Storm', 'Haze'. Do NOT translate the 'condition' value.
- Temperature values must be in Celsius.
- windSpeed must be in kilometers per hour (km/h).
- humidity must be a percentage number (e.g., 85).
- 'isPast' must be 'true' for the 2 past days, and 'false' for today and the 4 future days.
- The 'forecast' array must be sorted chronologically, starting with the day from two days ago.`;

    const response = await ai.models.generateContent({
        model: modelName,
        contents: `Get a 7-day weather report (2 past, 1 today, 4 future) and advisory for: ${location}`,
        config: {
          systemInstruction,
          tools: [{googleSearch: {}}],
        }
    });

    const parsedData = robustJsonParse(response.text);
    return JSON.stringify(parsedData);

  } catch (error) {
    console.error("Error in getWeatherAdvisory:", error);
    const errorMessage = language === Language.KN ? "ಕ್ಷಮಿಸಿ, ಹವಾಮಾನ ಡೇಟಾವನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ." : "Sorry, I couldn't retrieve weather data. Please try again later.";
    return JSON.stringify({ error: errorMessage });
  }
};

export const getFertilizerRecommendation = async (
  crop: string,
  area: number,
  unit: string,
  language: Language,
  npk?: { n: number; p: number; k: number }
): Promise<string> => {
  try {
    const langName = language === Language.KN ? 'Kannada' : 'English';
    const soilInfo = npk
      ? `The user has provided soil test results: N=${npk.n} ppm, P=${npk.p} ppm, K=${npk.k} ppm.`
      : 'The user has not provided soil test results. Use general recommendations for the specified crop.';

    const systemInstruction = `You are an expert agronomist for Indian farming conditions. Your task is to calculate fertilizer requirements. You must return a single JSON object.

The user wants to grow ${crop} on ${area} ${unit} of land. ${soilInfo}

Based on this, provide a fertilizer recommendation. The final N-P-K values should be in kilograms per the total area specified. Also, provide a brief note on application timing. For the 'commonFertilizers' field, suggest three common fertilizers (like Urea, DAP, MOP) and how they can be combined to achieve the N-P-K values.

All text in the JSON response (crop name, notes, etc.) must be in ${langName}.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: modelName,
        contents: `Calculate fertilizer for ${crop}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              crop: { type: Type.STRING },
              area: { type: Type.NUMBER },
              unit: { type: Type.STRING },
              recommendation: {
                type: Type.OBJECT,
                properties: {
                  n: { type: Type.NUMBER, description: "Total Nitrogen (N) required in kg" },
                  p: { type: Type.NUMBER, description: "Total Phosphorus (P) required in kg" },
                  k: { type: Type.NUMBER, description: "Total Potassium (K) required in kg" },
                },
                required: ["n", "p", "k"]
              },
              applicationNotes: { type: Type.STRING, description: "Brief advice on when and how to apply the fertilizer." },
              commonFertilizers: { type: Type.STRING, description: "Suggests three common fertilizers (e.g., Urea, DAP, MOP) and how they can be combined to meet the NPK requirements." }
            },
            required: ["crop", "area", "unit", "recommendation", "applicationNotes", "commonFertilizers"]
          }
        }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error in getFertilizerRecommendation:", error);
    const errorMessage = language === Language.KN ? "ಕ್ಷಮಿಸಿ, ರಸಗೊಬ್ಬರ ಶಿಫಾರಸನ್ನು ಲೆಕ್ಕಾಚಾರ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ." : "Sorry, I couldn't calculate the fertilizer recommendation. Please try again.";
    return JSON.stringify({ error: errorMessage });
  }
};

export const getAIResponseForPost = async (postText: string, language: Language, imageFile?: File): Promise<string> => {
  try {
      const langName = language === Language.KN ? 'Kannada' : 'English';

      if (imageFile) {
          // If there's an image, it's likely a crop issue. Use the detailed diagnosis.
          const diagnosisJson = await diagnoseCrop(imageFile, language);
          const diagnosis = JSON.parse(diagnosisJson);
          if(diagnosis.error) return JSON.stringify({ aiResponse: diagnosis.error });
          
          let responseText = `**Crop:** ${diagnosis.cropName}\n**Diagnosis:** ${diagnosis.disease}\n\n`;
          if (!diagnosis.isHealthy) {
              if (diagnosis.remedies.organic?.length > 0) {
                  responseText += `**Organic Remedies:**\n- ${diagnosis.remedies.organic.join('\n- ')}\n\n`;
              }
              if (diagnosis.remedies.chemical?.length > 0) {
                  responseText += `**Chemical Remedies:**\n- ${diagnosis.remedies.chemical.join('\n- ')}`;
              }
          }
          return JSON.stringify({ aiResponse: responseText.trim() });
      } else {
          // If no image, provide a general text-based response.
          const systemInstruction = `You are a helpful AI agronomist assistant. A farmer has posted the following to a community forum: "${postText}". Provide a concise, helpful, and supportive response in ${langName} that addresses their question or comment. Offer actionable advice if possible. Keep it brief and to the point.`;
          
          const response = await ai.models.generateContent({
              model: modelName,
              contents: postText,
              config: { systemInstruction }
          });
          
          return JSON.stringify({ aiResponse: response.text });
      }
  } catch (error) {
      console.error("Error in getAIResponseForPost:", error);
      const errorMessage = language === Language.KN ? "ಕ್ಷಮಿಸಿ, AI ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ." : "Sorry, could not generate an AI response.";
      return JSON.stringify({ aiResponse: errorMessage, error: true });
  }
};

export const getLoanInfo = async (
    amount: number, 
    purpose: string, 
    language: Language
): Promise<string> => {
    try {
        const langName = language === Language.KN ? 'Kannada' : 'English';
        const systemInstruction = `You are a financial advisor for Indian farmers. Based on search results, find the top three most relevant and common agricultural loan schemes that match the user's query.

You MUST respond with a JSON array of up to three loan objects. Each object must have this exact structure:
{
  "schemeName": "Name of the loan scheme",
  "bank": "Name of the bank or financial institution",
  "interestRate": "Interest rate (e.g., '7% p.a.')",
  "maxAmount": "Maximum loan amount (e.g., 'Up to ₹3 lakh')",
  "tenure": "Loan tenure (e.g., 'Up to 5 years')",
  "summary": "A brief one or two-sentence summary of the loan's purpose and benefits.",
  "eligibility": "Key eligibility criteria for the farmer.",
  "howToApply": "Brief instructions on how to apply (e.g., 'Visit the nearest branch with KYC documents and land records.')"
}

All text values in the JSON MUST be in ${langName}. Do not invent information; use only the data from the search results. If no specific loans are found, return an empty array.`;

        const userQuery = `Find agricultural loans in India for the purpose of '${purpose}' for an amount of around ${amount} INR.`;

        const response = await ai.models.generateContent({
            model: modelName,
            contents: userQuery,
            config: {
                systemInstruction,
                tools: [{ googleSearch: {} }]
            }
        });
        
        const parsedData = robustJsonParse(response.text);
        if (!Array.isArray(parsedData)) {
            throw new Error('AI response was not a JSON array.');
        }

        return JSON.stringify(parsedData);
        
    } catch (error) {
        console.error("Error in getLoanInfo:", error);
        const errorMessage = language === Language.KN ? "ಕ್ಷಮಿಸಿ, ಸಾಲದ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ." : "Sorry, could not retrieve loan information.";
        return JSON.stringify([{ error: errorMessage }]);
    }
};
