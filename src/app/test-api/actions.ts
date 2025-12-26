'use server';

import { ai } from '@/ai/genkit';

export async function testApiKey() {
    const rawKey = process.env.GOOGLE_GENAI_API_KEY;
    let keyInfo = '';

    if (!rawKey) {
        keyInfo = 'Key is MISSING';
    } else {
        const len = rawKey.length;
        const is78 = len === 78;
        const half = len / 2;
        const firstHalf = rawKey.substring(0, half);
        const secondHalf = rawKey.substring(half);
        const isDuplicated = is78 && firstHalf === secondHalf;

        keyInfo = `Raw Length: ${len}, Starts: ${rawKey.substring(0, 4)}... Ends: ...${rawKey.substring(len - 4)}`;
        if (isDuplicated) {
            keyInfo += ` [DETECTED DUPLICATION: Both halves match! De-duplication applied.]`;
        } else if (is78) {
            keyInfo += ` [78 CHARS BUT HALVES DO NOT MATCH]`;
        }
    }

    try {
        // We use the 'ai' object which now has the de-duplication logic in genkit.ts
        const response = await ai.generate({
            prompt: 'Say "API Key de-duplication successful!" if you can see this.',
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
