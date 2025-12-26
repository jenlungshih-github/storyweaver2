'use server';

import { ai } from '@/ai/genkit';

export async function testApiKey() {
    const key = process.env.GOOGLE_GENAI_API_KEY;
    const keyInfo = key
        ? `Key length: ${key.length}, Starts with: ${key.substring(0, 4)}... Ends with: ...${key.substring(key.length - 4)}`
        : 'Key is MISSING (undefined)';

    console.log('--- API Key Diagnostic ---');
    console.log(keyInfo);
    console.log('---------------------------');

    try {
        const response = await ai.generate({
            prompt: 'Say "API Key is working!" if you can see this.',
        });
        return {
            success: true,
            message: response.text,
            diagnostic: keyInfo
        };
    } catch (error: any) {
        console.error('API Key Test Error:', error);
        return {
            success: false,
            error: error.message || 'Unknown error occurred',
            diagnostic: keyInfo
        };
    }
}
