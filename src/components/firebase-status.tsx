"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, limit } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function FirebaseStatus() {
    const [user, setUser] = useState<User | null>(null);
    const [firestoreStatus, setFirestoreStatus] = useState<"loading" | "connected" | "error">("loading");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        const checkFirestore = async () => {
            try {
                // Try to read from a test collection
                const q = query(collection(db, "connectivity_test"), limit(1));
                await getDocs(q);
                setFirestoreStatus("connected");
            } catch (err: any) {
                console.error("Firestore connectivity check failed:", err);
                // If it's a "permission denied" error, it still means we are "connected" to the project, just not authorized to read that path
                if (err.code === "permission-denied" || err.message.includes("permission")) {
                    setFirestoreStatus("connected");
                } else {
                    setFirestoreStatus("error");
                    setError(err.message);
                }
            }
        };

        checkFirestore();

        return () => unsubscribe();
    }, []);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-sm font-medium">Connectivity Status</CardTitle>
                <CardDescription>Firebase services status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm">Auth:</span>
                    {user ? (
                        <Badge variant="default" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Logged in ({user.isAnonymous ? "Guest" : user.email})
                        </Badge>
                    ) : (
                        <Badge variant="secondary">Not Logged In</Badge>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm">Firestore:</span>
                    {firestoreStatus === "loading" ? (
                        <Badge variant="outline">Connecting...</Badge>
                    ) : firestoreStatus === "connected" ? (
                        <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
                            <CheckCircle2 className="h-3 w-3" />
                            Connected
                        </Badge>
                    ) : (
                        <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Error: {error}
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
