import axios from 'axios'

const SERVER_URL = `${import.meta.env.VITE_SERVER_URL}`
const CLOUDINARY_URL = `${import.meta.env.VITE_CLOUDINARY_URL ?? ""}`
const ENV_CLOUD_NAME = `${import.meta.env.VITE_CLOUD_NAME ?? ""}`

export type CloudinaryResourceType = "image" | "video" | "raw"

export interface CloudinaryUploadResult {
    result: boolean
    url: string
    publicId: string
    resourceType: CloudinaryResourceType
}

const getCloudNameFromUrl = () => {
    const match = CLOUDINARY_URL.match(/res\.cloudinary\.com\/([^/]+)/)
    return match?.[1] ?? ""
}

export const storageApi = {
    getUploadUrl: async (folder: string, fileName: string, contentType: string) => {
        return await axios.get(`${SERVER_URL}/get-upload-url?folder=${folder}&fileName=${fileName}&contentType=${contentType}`).then(response => {
            try {
                const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
                return data as {
                    signature: string
                    api_key: string
                    cloud_name: string
                    result: boolean
                }
            }
            catch {
                return {
                    signature: "",
                    api_key: "",
                    cloud_name: "",
                    result: false
                }
            }
        })
    },
    getMultipleUploadUrls: async (folder: string, fileNames: string[], contentType: string) => {
        return await axios.get(`${SERVER_URL}/upload/upload-multiple-attachment`, {
            params: { folder, fileName: fileNames, contentType },
            paramsSerializer: (params) => {
                const searchParams = new URLSearchParams();
                searchParams.append("folder", params.folder);
                searchParams.append("contentType", params.contentType);
                params.fileName.forEach((name: string) => {
                    searchParams.append("fileName", name);
                });
                return searchParams.toString();
            }
        }).then(response => {
            try {
                const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
                return data as {
                    result: boolean;
                    signatures: Array<{
                        signature: string;
                        api_key: string;
                        cloud_name: string;
                        // timestamp: number;
                        // public_id: string;
                        // folder: string;
                        [key: string]: any;
                    }>
                }
            } catch {
                return { result: false, signatures: [] }
            }
        })
    },


    upload: async (
        formData: FormData,
        resourceType: CloudinaryResourceType,
        onProgress?: (percent: number) => void
    ): Promise<CloudinaryUploadResult> => {
        // Ưu tiên cloud_name do backend trả về trong signature, sau đó tới env,
        // cuối cùng là tách từ VITE_CLOUDINARY_URL.
        const cloudName = String(
            formData.get("cloud_name") || ENV_CLOUD_NAME || getCloudNameFromUrl()
        )

        if (!cloudName) {
            return { result: false, url: "", publicId: "", resourceType }
        }

        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
            formData,
            {
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        onProgress(percent)
                    }
                }
            }
        )

        return {
            result: response.status === 200,
            url: response.data?.secure_url ?? "",
            publicId: response.data?.public_id ?? "",
            resourceType,
        }
    }
}
