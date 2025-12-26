'use server';

import { ai } from '@/ai/genkit';

export async function testApiKey() {
    try {
        const response = await ai.generate({
            prompt: 'Say "API Key is working!" if you can see this.',
        });
        return { success: true, message: response.text };
    } catch (error: any) {
        console.error('API Key Test Error:', error);
        return { success: false, error: error.message || 'Unknown error occurred' };
    }
}
