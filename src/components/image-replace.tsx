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
    children?: React.ReactNode;
    className?: string;
}

export function ImageReplace({ storyId, currentImageUrl, onSuccess, children, className }: ImageReplaceProps) {
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
                (snapshot: any) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error: any) => {
                    console.error("Upload error:", error);
                    let errorMessage = "There was an error uploading your image.";

                    if (error.code === 'storage/unauthorized') {
                        errorMessage = "Permission denied. Please check your Firebase Storage security rules.";
                    } else if (error.code === 'storage/canceled') {
                        errorMessage = "Upload canceled.";
                    } else if (error.message) {
                        errorMessage = error.message;
                    }

                    toast({
                        title: "Upload failed",
                        description: errorMessage,
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
        if (!isUploading) {
            fileInputRef.current?.click();
        }
    };

    if (children) {
        return (
            <div className={`relative group cursor-pointer ${className}`} onClick={triggerFileInput}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
                {children}

                {/* Overlay on hover/upload */}
                <div className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center transition-opacity duration-300 ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2 text-white">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <span className="text-sm font-bold">{Math.round(uploadProgress)}%</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-1 text-white">
                            <Upload className="h-8 w-8" />
                            <span className="text-xs font-medium bg-black/50 px-2 py-1 rounded">
                                Click to {currentImageUrl ? 'Replace' : 'Add'} Image
                            </span>
                            <span className="text-[10px] opacity-70">1024x768 recommended</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
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
