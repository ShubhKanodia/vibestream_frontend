import { GoogleGenAI, createUserContent, createPartFromUri} from "@google/genai";
import ENV from "../config/env.js";

const ai = new GoogleGenAI({
     apiKey: ENV.GEMINI_API_KEY, 
});

export const geminiChatService = async (content) => {
    try{
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: content,
        });
    
        console.log("Gemini Response: \n",response.text);
        return response.text;

    }catch(err){
        console.error("Gemini Error:", err);
        throw err;
    }
}

export const geminiVisionService = async (content) => {
    const myFile = await ai.files.upload({
        file: "path/to/sample.jpg",
        config: { mimeType: "image/jpeg" },
    });
    
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: createUserContent([
          createPartFromUri(myFile.uri, myFile.mimeType),
          content || "Analyze the image and give 5 songs that suit this image",
        ]),
    });

    return response.text;
}
