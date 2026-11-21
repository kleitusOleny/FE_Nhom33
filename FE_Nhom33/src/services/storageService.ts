import { storageApi, type CloudinaryResourceType } from "@/api/storage"
import { UploadLimit } from "@/constants/UploadLimit"
import { convertImageToWebp } from "@/utils/storageUtil"
import { store } from "@/store/store"
import type { AttachmentKind, MessageAttachment } from "@/types/Message"

export interface UploadedAttachment extends MessageAttachment {
    url: string
    name: string
    kind: AttachmentKind
}

export interface UploadResult {
    result: boolean
    message: string
    url: string
    attachment?: UploadedAttachment
}

export interface UploadMultipleResult {
    result: boolean
    message: string
    attachments: UploadedAttachment[]
    errors: string[]
}

const BLOCKED_EXTENSIONS = new Set([
    "exe", "bat", "cmd", "sh", "msi", "scr", "com", "vbs", "ps1", "jar",
])

const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "avif", "heic"])
const VIDEO_EXTENSIONS = new Set(["mp4", "webm", "mov", "m4v", "avi", "mkv", "ogv"])

// Ảnh giữ nguyên các định dạng này, còn lại convert sang WebP cho nhẹ.
const SKIP_WEBP_EXTENSIONS = new Set(["webp", "gif", "svg"])

const getExtension = (name: string) => {
    const index = name.lastIndexOf(".")
    return index >= 0 ? name.slice(index + 1).toLowerCase() : ""
}

const getBaseName = (name: string) => {
    const index = name.lastIndexOf(".")
    return index > 0 ? name.slice(0, index) : name
}

const sanitizeFileName = (originalName: string) => {
    const base = getBaseName(originalName).replace(/[^a-zA-Z0-9-_]/g, "_") || "file"
    const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    return `${base}_${unique}`
}

const formatLimit = (bytes: number) => `${Math.round(bytes / Math.pow(1024, 2))}MB`

const isAuthenticated = () => {
    const auth = store.getState().auth
    // localStorage là nguồn dự phòng: ngay sau khi login, state redux có thể
    // chưa kịp cập nhật nếu trang chưa reload.
    return Boolean(auth.isAuthenticated || auth.username || localStorage.getItem("username"))
}

export function getResourceType(file: File): CloudinaryResourceType {
    if (file.type.startsWith("image/")) return "image"
    if (file.type.startsWith("video/")) return "video"

    const extension = getExtension(file.name)
    if (IMAGE_EXTENSIONS.has(extension)) return "image"
    if (VIDEO_EXTENSIONS.has(extension)) return "video"
    return "raw"
}

export function validateAttachment(file: File): { ok: boolean; message: string } {
    const extension = getExtension(file.name)

    if (BLOCKED_EXTENSIONS.has(extension)) {
        return { ok: false, message: `Định dạng .${extension} không được phép` }
    }

    if (file.size === 0) {
        return { ok: false, message: "Tệp rỗng" }
    }

    const resourceType = getResourceType(file)
    const limit = resourceType === "image"
        ? UploadLimit.IMAGE
        : resourceType === "video"
            ? UploadLimit.VIDEO
            : UploadLimit.FILE

    if (file.size > limit) {
        const label = resourceType === "image" ? "hình ảnh" : resourceType === "video" ? "video" : "tệp"
        return { ok: false, message: `${label} tối đa ${formatLimit(limit)}` }
    }

    return { ok: true, message: "" }
}

export function getAttachmentKind(url: string): AttachmentKind {
    if (url.startsWith("data:image/")) return "image"
    if (url.startsWith("data:video/")) return "video"
    if (url.includes("/image/upload/")) return "image"
    if (url.includes("/video/upload/")) return "video"
    if (url.includes("/raw/upload/")) return "file"

    const extension = getExtension(url.split("?")[0].split("#")[0])
    if (IMAGE_EXTENSIONS.has(extension)) return "image"
    if (VIDEO_EXTENSIONS.has(extension)) return "video"
    return "file"
}

export function getFileNameFromUrl(url: string): string {
    if (url.startsWith("data:")) return "attachment"
    try {
        const cleanUrl = url.split("?")[0].split("#")[0]
        const lastSegment = cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1)
        return decodeURIComponent(lastSegment) || "attachment"
    } catch {
        return "attachment"
    }
}

const buildUploadName = (file: File, resourceType: CloudinaryResourceType) => {
    const extension = getExtension(file.name)
    const cleanName = sanitizeFileName(file.name)
    // Cloudinary raw file cần public_id kèm extension, nếu không URL trả về
    // sẽ không có đuôi file và trình duyệt không biết cách mở.
    return resourceType === "raw" && extension ? `${cleanName}.${extension}` : cleanName
}

const prepareUploadFile = async (file: File, resourceType: CloudinaryResourceType) => {
    if (resourceType !== "image") return file

    const extension = getExtension(file.name)
    if (SKIP_WEBP_EXTENSIONS.has(extension)) return file

    try {
        return await convertImageToWebp(file) as Blob
    } catch {
        return file
    }
}

export async function uploadAttachment(
    folder: string,
    file: File,
    onProgress?: (percent: number) => void
): Promise<UploadResult> {
    if (!isAuthenticated()) {
        return { result: false, message: "Vui lòng đăng nhập.", url: "" }
    }

    const validation = validateAttachment(file)
    if (!validation.ok) {
        return { result: false, message: validation.message, url: "" }
    }

    const resourceType = getResourceType(file)
    const uploadName = buildUploadName(file, resourceType)

    try {
        const uploadFile = await prepareUploadFile(file, resourceType)
        const uploadDetail = await storageApi.getUploadUrl(folder, uploadName, "auto")
        const { result, ...cloudinaryData } = uploadDetail

        if (!result) {
            return { result: false, message: "Không lấy được chữ ký upload.", url: "" }
        }

        const formData = new FormData()
        Object.entries(cloudinaryData).forEach(([key, value]) => {
            formData.append(key, String(value))
        })
        formData.append("file", uploadFile, uploadName)

        const uploaded = await storageApi.upload(formData, resourceType, onProgress)

        if (!uploaded.result || !uploaded.url) {
            return { result: false, message: "Upload thất bại.", url: "" }
        }

        return {
            result: true,
            message: "Thành công",
            url: uploaded.url,
            attachment: {
                url: uploaded.url,
                name: file.name,
                kind: resourceType === "raw" ? "file" : resourceType,
            },
        }
    } catch (error) {
        console.error("Upload error:", error)
        return { result: false, message: "Upload thất bại", url: "" }
    }
}

export async function uploadMultipleAttachments(
    folder: string,
    files: File[],
    onProgress?: (percent: number) => void
): Promise<UploadMultipleResult> {
    if (!isAuthenticated()) {
        return { result: false, message: "Vui lòng đăng nhập.", attachments: [], errors: [] }
    }

    if (files.length === 0) {
        return { result: false, message: "Không có file.", attachments: [], errors: [] }
    }

    const errors: string[] = []
    const processedFiles: {
        file: File | Blob
        uploadName: string
        resourceType: CloudinaryResourceType
        original: File
    }[] = []

    for (const file of files) {
        const validation = validateAttachment(file)
        if (!validation.ok) {
            errors.push(`${file.name}: ${validation.message}`)
            continue
        }

        const resourceType = getResourceType(file)
        const uploadName = buildUploadName(file, resourceType)
        const uploadFile = await prepareUploadFile(file, resourceType)

        processedFiles.push({ file: uploadFile, uploadName, resourceType, original: file })
    }

    if (processedFiles.length === 0) {
        return {
            result: false,
            message: errors[0] ?? "Không có file hợp lệ.",
            attachments: [],
            errors,
        }
    }

    try {
        const fileNames = processedFiles.map((item) => item.uploadName)
        const signatureResponse = await storageApi.getMultipleUploadUrls(folder, fileNames, "auto")

        if (!signatureResponse.result || signatureResponse.signatures.length !== processedFiles.length) {
            return { result: false, message: "Lỗi lấy chữ ký từ server.", attachments: [], errors }
        }

        const progressValues = new Array(processedFiles.length).fill(0)
        const reportProgress = () => {
            if (!onProgress) return
            const total = progressValues.reduce((sum, value) => sum + value, 0)
            onProgress(Math.round(total / processedFiles.length))
        }

        const uploadPromises = processedFiles.map(async (item, index) => {
            const signatureData = signatureResponse.signatures[index]
            const formData = new FormData()

            Object.entries(signatureData).forEach(([key, value]) => {
                formData.append(key, String(value))
            })
            formData.append("file", item.file, item.uploadName)

            const uploaded = await storageApi.upload(
                formData,
                item.resourceType,
                (percent) => {
                    progressValues[index] = percent
                    reportProgress()
                }
            )

            if (!uploaded.result || !uploaded.url) {
                errors.push(`${item.original.name}: upload thất bại`)
                return null
            }

            return {
                url: uploaded.url,
                name: item.original.name,
                kind: (item.resourceType === "raw" ? "file" : item.resourceType) as AttachmentKind,
            }
        })

        const results = await Promise.allSettled(uploadPromises)
        const attachments: UploadedAttachment[] = []

        results.forEach((item, index) => {
            if (item.status === "fulfilled" && item.value) {
                attachments.push(item.value)
            } else if (item.status === "rejected") {
                errors.push(`${processedFiles[index].original.name}: upload thất bại`)
            }
        })

        if (attachments.length === 0) {
            return {
                result: false,
                message: errors[0] ?? "Upload thất bại toàn bộ.",
                attachments: [],
                errors,
            }
        }

        const successMessage = attachments.length === files.length
            ? `Thành công ${attachments.length}/${files.length} file.`
            : `Thành công ${attachments.length}/${files.length} file. ${errors.join("; ")}`

        return {
            result: true,
            message: successMessage,
            attachments,
            errors,
        }
    } catch (error) {
        console.error("Upload error:", error)
        return { result: false, message: "Lỗi ngoại lệ.", attachments: [], errors }
    }
}

export const getThumbnail = (url: string, width = 200) => {
    if (!url.includes("cloudinary.com")) return url
    if (url.includes("/raw/upload/")) return url

    if (url.includes("/video/upload/")) {
        const posterUrl = url.replace("/video/upload/", `/video/upload/so_0,w_${width}/`)
        return posterUrl.replace(/\.(mp4|webm|mov|m4v|avi|mkv|ogv)(\?.*)?$/i, ".jpg")
    }

    return url.replace("/image/upload/", `/image/upload/c_scale,w_${width},f_auto,q_auto/`)
}

const buildCloudinaryDownloadUrl = (url: string, fileName: string) => {
    if (!url.includes("/upload/") || url.includes("/upload/fl_attachment")) return url
    const safeName = fileName.replace(/[\\/:*?"<>|]/g, "_")
    return url.replace("/upload/", `/upload/fl_attachment:${encodeURIComponent(safeName)}/`)
}

const triggerDownload = (href: string, fileName: string) => {
    const link = document.createElement("a")
    link.href = href
    link.download = fileName
    link.rel = "noopener noreferrer"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

export const downloadAttachment = async (url: string, fileName?: string): Promise<void> => {
    const name = fileName || getFileNameFromUrl(url)

    try {
        if (url.includes("res.cloudinary.com")) {
            triggerDownload(buildCloudinaryDownloadUrl(url, name), name)
            return
        }

        const response = await fetch(url)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const blob = await response.blob()
        const blobUrl = window.URL.createObjectURL(blob)
        triggerDownload(blobUrl, name)
        window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
        console.error("Download failed", error)
        window.open(url, "_blank", "noopener,noreferrer")
    }
}

// Giữ tên cũ để các component đang dùng `downloadImage` không bị vỡ.
export const downloadImage = downloadAttachment
