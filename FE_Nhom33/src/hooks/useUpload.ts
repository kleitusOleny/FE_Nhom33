import {
    uploadAttachment,
    uploadMultipleAttachments,
    type UploadMultipleResult,
    type UploadResult,
} from "@/services/storageService";
import { useState } from "react";

export function useUpload() {
    const [progress, setProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)

    const startUpload = async (folder: string, file: File): Promise<UploadResult> => {
        setIsUploading(true)
        setProgress(0)
        try {
            const result = await uploadAttachment(folder, file, (p) => setProgress(p))
            if (result.result) setProgress(100)
            return result
        } finally {
            setIsUploading(false)
        }
    }

    const startMultipleUpload = async (
        folder: string,
        files: File[]
    ): Promise<UploadMultipleResult> => {
        setIsUploading(true)
        setProgress(0)
        try {
            const result = await uploadMultipleAttachments(folder, files, (p) => setProgress(p))
            if (result.result) setProgress(100)
            return result
        } finally {
            setIsUploading(false)
        }
    }

    return { progress, isUploading, startUpload, startMultipleUpload }
}
