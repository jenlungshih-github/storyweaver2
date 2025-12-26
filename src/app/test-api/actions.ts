'use server';

import { ai } from '@/ai/genkit';

export async function testApiKey() {
    try {
        const response = await ai.generate({
            prompt: 'Say "API Key is working!"',
        });

        return {
            success: true,
            message: response.text
        };
    } catch (error: any) {
        console.error('AI Error:', error);
        return {
            success: false,
            error: error.message || 'Unknown error occurred'
        };
    }
}
