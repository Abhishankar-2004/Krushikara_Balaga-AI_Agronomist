import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Language } from "../types";

const getAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const FLASH_MODEL = 'gemini-3-flash-preview';
const PRO_MODEL = 'gemini-3-pro-preview';

const robustJsonParse = (rawText: string): any => {
    let cleanText = rawText.trim();
    
    // Find the first occurrence of '{' or '[' and the last occurrence of '}' or ']'
    const firstBrace = cleanText.indexOf('{');
    const firstBracket = cleanText.indexOf('[');
    let start = -1;
    if (firstBrace !== -1 && firstBracket !== -1) {
        start = Math.min(firstBrace, firstBracket);
    } else {
        start = firstBrace !== -1 ? firstBrace : firstBracket;
    }

    const lastBrace = cleanText.lastIndexOf('}');
    const lastBracket = cleanText.lastIndexOf(']');
    const end = Math.max(lastBrace, lastBracket);

    if (start !== -1 && end !== -1 && end > start) {
        cleanText = cleanText.substring(start, end + 1);
    }
    
    // Remove potential markdown code blocks
    cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
        return JSON.parse(cleanText);
    } catch (e) {
        console.error("Failed to parse JSON. Cleaned text:", cleanText);
        // Fallback for extremely messy output: search for the first valid JSON object/array
        throw e;
    }
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
    const ai = getAI();
    const imagePart = await fileToGenerativePart(imageFile);
    const langName = language === Language.KN ? 'Kannada' : 'English';
    const systemInstruction = `You are an expert Indian agronomist. Analyze the plant leaf image provided. Identify the crop and any disease. Provide detailed organic and chemical remedies. Your response MUST be in valid JSON format. Language for all display text: ${langName}. JSON keys: cropName, isHealthy (boolean), disease, remedies (object with keys 'organic' and 'chemical', both as string arrays).`;

    const response = await ai.models.generateContent({
        model: FLASH_MODEL,
        contents: { parts: [imagePart, { text: `Examine the crop health and respond in ${langName}.` }] },
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
    });

    const parsed = robustJsonParse(response.text);
    return JSON.stringify(parsed);
  } catch (error) {
    console.error("Error in diagnoseCrop:", error);
    return JSON.stringify({ error: "Failed to analyze image. Please try again with a clearer photo." });
  }
};

export const getMarketAnalysis = async (query: string, language: Language): Promise<string> => {
    try {
        const ai = getAI();
        const langName = language === Language.KN ? 'Kannada' : 'English';
        const systemInstruction = `You are a professional agricultural market analyst. Analyze the price trends for the specified crop query. Provide a summary, recommendation, and 7-day price forecast. Response MUST be valid JSON. Language: ${langName}. Keys: crop, trend (string: Rising, Falling, or Stable), recommendation, summary, priceData (array of {day: string, price: number}).`;

        const response = await ai.models.generateContent({
            model: FLASH_MODEL,
            contents: query,
            config: { systemInstruction, responseMimeType: "application/json" }
        });
        const parsed = robustJsonParse(response.text);
        return JSON.stringify(parsed);
    } catch (error) {
        console.error("Error in getMarketAnalysis:", error);
        return JSON.stringify({ error: "Market data insights currently unavailable." });
    }
};

export const getMarketTrends = async (language: Language): Promise<string> => {
    try {
        const ai = getAI();
        const langName = language === Language.KN ? 'Kannada' : 'English';
        const systemInstruction = `Provide current market highlights for Indian agriculture. Identify top 3 rising and top 3 falling crops. Respond ONLY in valid JSON. Language: ${langName}. Keys: topRisers, topFallers (both arrays of {cropName, change (number as percentage), currentPrice (number)}).`;
        
        const response = await ai.models.generateContent({
            model: FLASH_MODEL,
            contents: 'Get the latest agricultural market trends in India.',
            config: { systemInstruction, responseMimeType: "application/json" }
        });
        const parsed = robustJsonParse(response.text);
        return JSON.stringify(parsed);
    } catch (error) {
        console.error("Error in getMarketTrends:", error);
        return JSON.stringify({ error: "Could not fetch current trends." });
    }
};

export const getSchemeInfo = async (query: string, language: Language): Promise<SchemeInfoWithSources> => {
    try {
        const ai = getAI();
        const langName = language === Language.KN ? 'Kannada' : 'English';
        const prompt = `Research and provide a detailed summary of Indian agricultural schemes matching: "${query}". Include eligibility, benefits, and how to apply. Respond in ${langName}. Use Markdown for formatting.`;
        
        const response = await ai.models.generateContent({
            model: PRO_MODEL,
            contents: prompt,
            config: { tools: [{googleSearch: {}}] }
        });

        const summary = response.text;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        const sources = groundingChunks
          .map(chunk => chunk.web)
          .filter(web => web?.uri && web?.title) as Array<{ uri: string; title: string }>;

        return { 
          summary, 
          sources: Array.from(new Map(sources.map(s => [s.uri, s])).values()) 
        };
    } catch (error) {
        console.error("Error in getSchemeInfo:", error);
        return { summary: '', sources: [], error: "Search for schemes failed." };
    }
};

export const getWeatherAdvisory = async (location: string, language: Language): Promise<string> => {
  try {
    const ai = getAI();
    const langName = language === Language.KN ? 'Kannada' : 'English';
    const systemInstruction = `Provide a 7-day weather forecast (2 past days, today, 4 future days) and customized agricultural advice for ${location}. Respond ONLY in valid JSON. Condition MUST be one of: Sunny, Clear, Cloudy, Rain, Storm, Haze. Language: ${langName}. Keys: location, forecast (array of {day, condition, tempHigh, tempLow, windSpeed, humidity, isPast (boolean)}), advisory (string).`;

    const response = await ai.models.generateContent({
        model: PRO_MODEL,
        contents: `Weather forecast and farming advice for ${location}.`,
        config: { tools: [{googleSearch: {}}], systemInstruction }
    });
    const parsed = robustJsonParse(response.text);
    return JSON.stringify(parsed);
  } catch (error) {
    console.error("Error in getWeatherAdvisory:", error);
    return JSON.stringify({ error: "Weather lookup failed for the given location." });
  }
};

export const getFertilizerRecommendation = async (crop: string, area: number, unit: string, language: Language, npk?: { n: number; p: number; k: number }): Promise<string> => {
  try {
    const ai = getAI();
    const langName = language === Language.KN ? 'Kannada' : 'English';
    const soil = npk ? `Soil test results: N=${npk.n}, P=${npk.p}, K=${npk.k} ppm.` : 'No soil test data available.';
    const systemInstruction = `As an agronomist, calculate fertilizer requirements for ${crop} on ${area} ${unit}. ${soil} Respond ONLY in valid JSON. Language: ${langName}. Keys: crop, area, unit, recommendation (object with n, p, k as numbers in kg), applicationNotes, commonFertilizers.`;

    const response = await ai.models.generateContent({
        model: FLASH_MODEL,
        contents: `Provide fertilizer recommendation for ${crop} on ${area} ${unit}.`,
        config: { systemInstruction, responseMimeType: "application/json" }
    });
    const parsed = robustJsonParse(response.text);
    return JSON.stringify(parsed);
  } catch (error) {
    console.error("Error in getFertilizerRecommendation:", error);
    return JSON.stringify({ error: "Could not calculate fertilizer requirements." });
  }
};

export const getAIResponseForPost = async (postText: string, language: Language, imageFile?: File): Promise<string> => {
  try {
      const ai = getAI();
      const langName = language === Language.KN ? 'Kannada' : 'English';
      if (imageFile) {
          const res = await diagnoseCrop(imageFile, language);
          const diag = JSON.parse(res);
          if(diag.error) return JSON.stringify({ aiResponse: diag.error });
          let txt = `**Crop Identified:** ${diag.cropName}\n**Health Status:** ${diag.isHealthy ? 'Healthy' : diag.disease}\n\n`;
          if (!diag.isHealthy) {
              if (diag.remedies.organic?.length) txt += `**Organic Remedies:**\n- ${diag.remedies.organic.join('\n- ')}\n\n`;
              if (diag.remedies.chemical?.length) txt += `**Chemical Remedies:**\n- ${diag.remedies.chemical.join('\n- ')}`;
          }
          return JSON.stringify({ aiResponse: txt.trim() });
      } else {
          const response = await ai.models.generateContent({
              model: FLASH_MODEL,
              contents: postText,
              config: { systemInstruction: `You are a helpful and experienced agronomist. Respond to the farmer's post in a supportive way. Response language: ${langName}. Keep it practical and concise.` }
          });
          return JSON.stringify({ aiResponse: response.text });
      }
  } catch (error) {
      console.error("Error in getAIResponseForPost:", error);
      return JSON.stringify({ aiResponse: "The AI agronomist is currently unavailable." });
  }
};

export const getLoanInfo = async (amount: number, purpose: string, language: Language): Promise<string> => {
    try {
        const ai = getAI();
        const langName = language === Language.KN ? 'Kannada' : 'English';
        const systemInstruction = `Agricultural financial advisor. Find at least 3 relevant Indian agri-loans for a purpose of '${purpose}' and amount ₹${amount}. Respond ONLY in a valid JSON array of objects. Language: ${langName}. Each object keys: schemeName, bank, interestRate, maxAmount, tenure, eligibility, summary, howToApply.`;

        const response = await ai.models.generateContent({
            model: PRO_MODEL,
            contents: `Search for agricultural loans for ${purpose} with amount ₹${amount} in India.`,
            config: { tools: [{googleSearch: {}}], systemInstruction }
        });
        const parsed = robustJsonParse(response.text);
        return JSON.stringify(parsed);
    } catch (error) {
        console.error("Error in getLoanInfo:", error);
        return JSON.stringify([{ error: "Loan options search failed." }]);
    }
};
