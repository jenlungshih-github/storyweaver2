'use client';

import { useState } from 'react';
import { testApiKey } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function TestApiPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

    const handleTest = async () => {
        setLoading(true);
        setResult(null);
        try {
            const res = await testApiKey();
            setResult(res);
        } catch (err) {
            setResult({ success: false, error: 'Failed to invoke server action' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-950 p-4">
            <Card className="w-full max-w-md border-neutral-800 bg-neutral-900 text-neutral-100">
                <CardHeader>
                    <CardTitle>API Key Verification (v2)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-neutral-400">
                        Click the button below to validatethe GOOGLE_GENAI_API_KEY configuration on the server.
                    </p>

                    <Button
                        onClick={handleTest}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Testing...
                            </>
                        ) : (
                            'Test API Key'
                        )}
                    </Button>

                    {result && (
                        <div className="space-y-2">
                            <div className={`p-4 rounded-md text-sm ${result.success ? 'bg-green-900/30 text-green-300 border border-green-800' : 'bg-red-900/30 text-red-300 border border-red-800'}`}>
                                <p className="font-bold mb-1">{result.success ? 'Success!' : 'Error Failed'}</p>
                                <p className="font-mono text-xs break-all">{result.success ? result.message : result.error}</p>
                            </div>

                            <div className="p-3 rounded-md bg-neutral-800/50 border border-neutral-700 text-[10px] font-mono text-neutral-400">
                                <p className="font-bold mb-1 text-neutral-300">SERVER DIAGNOSTIC:</p>
                                <p>{(result as any).diagnostic || 'No diagnostic info available'}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
