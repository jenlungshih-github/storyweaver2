"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { ImageIcon, Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';

interface ImageReplaceProps {
    storyId: string;
    currentImageUrl?: string;
    onSuccess?: (url: string) => void;
}

export function ImageReplace({ storyId, currentImageUrl, onSuccess }: ImageReplaceProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const { t } = useLanguage();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({
                title: "Invalid file type",
                description: "Please upload an image file.",
                variant: "destructive",
            });
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Create a storage reference
            const storageRef = ref(storage, `stories/${storyId}/${Date.now()}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot: any) => { // Using any for Firebase internal types to simplify
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error: Error) => {
                    console.error("Upload error:", error);
                    toast({
                        title: "Upload failed",
                        description: "There was an error uploading your image.",
                        variant: "destructive",
                    });
                    setIsUploading(false);
                },
                async () => {
                    // Upload complete, get download URL
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    // Update Firestore
                    await updateDoc(doc(db, 'stories', storyId), {
                        imageUrl: downloadURL
                    });

                    toast({
                        title: "Success",
                        description: "Story image updated successfully!",
                    });

                    if (onSuccess) {
                        onSuccess(downloadURL);
                    }
                    setIsUploading(false);
                }
            );
        } catch (error) {
            console.error("Error updating story image:", error);
            toast({
                title: "Error",
                description: "Failed to update story image.",
                variant: "destructive",
            });
            setIsUploading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col gap-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            <Button
                variant="outline"
                size="sm"
                className="gap-2 w-full bg-background/50 backdrop-blur-sm border-dashed"
                onClick={triggerFileInput}
                disabled={isUploading}
            >
                {isUploading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{Math.round(uploadProgress)}%</span>
                    </>
                ) : (
                    <>
                        <Upload className="h-4 w-4" />
                        <span>{currentImageUrl ? 'Replace Image' : 'Add Image'}</span>
                    </>
                )}
            </Button>
            <p className="text-[10px] text-muted-foreground text-center">
                Suggested: 1024x768 (Landscape)
            </p>
        </div>
    );
}
