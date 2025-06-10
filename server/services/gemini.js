import { GoogleGenerativeAI } from '@google/generative-ai';
import ENV from "../config/env.js";

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

export const geminiChatService = async (content) => {
    if(!content){
        throw new Error('no prompt given!!');
    }
    try{   
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp'
        });

        const result = await model.generateContent([content]);
        const response = await result.response;

        return response.text();
    }catch(err){
        console.error("Gemini Error:", err);
        throw err;
    }
}

export const geminiVisionService = async ({ image, mimeType, prompt }) => {
    if(!image){
        throw new Error('No image provided!');
    }

    try{
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp'
        });

        const imagePart = {
            inlineData: {
                data: image,
                mimeType: mimeType || 'image/jpeg'
            }
        };

        const defaultPrompt = "Analyze the image and give 5 songs that suit this image for an Instagram story! We live in 2025 so suggest recent songs from 2020 onwards!";

        const result = await model.generateContent([
            prompt || defaultPrompt,
            imagePart
        ]);

        const response = await result.response;
        return response.text();
    }catch(err){
        console.error('Gemini Vision Service Error:', err);
        throw new Error(`Image analysis failed: ${err.message}`);
    }
}
