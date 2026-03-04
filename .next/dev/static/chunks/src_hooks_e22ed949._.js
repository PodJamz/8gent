(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/hooks/useFileAttachment.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFileAttachment",
    ()=>useFileAttachment
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_MAX_FILES = 5;
const DEFAULT_ACCEPTED_TYPES = [
    'image/*',
    'application/pdf',
    'text/plain',
    'text/markdown',
    'application/json',
    'text/csv'
];
function useFileAttachment(options = {}) {
    _s();
    const { maxFiles = DEFAULT_MAX_FILES, maxSizeBytes = DEFAULT_MAX_SIZE, acceptedTypes = DEFAULT_ACCEPTED_TYPES, onError } = options;
    const [attachments, setAttachments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isProcessing, setIsProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const generateId = ()=>`attach_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const isAcceptedType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFileAttachment.useCallback[isAcceptedType]": (file)=>{
            return acceptedTypes.some({
                "useFileAttachment.useCallback[isAcceptedType]": (type)=>{
                    if (type.endsWith('/*')) {
                        const category = type.split('/')[0];
                        return file.type.startsWith(`${category}/`);
                    }
                    return file.type === type;
                }
            }["useFileAttachment.useCallback[isAcceptedType]"]);
        }
    }["useFileAttachment.useCallback[isAcceptedType]"], [
        acceptedTypes
    ]);
    const createPreview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFileAttachment.useCallback[createPreview]": (file)=>{
            return new Promise({
                "useFileAttachment.useCallback[createPreview]": (resolve)=>{
                    if (!file.type.startsWith('image/')) {
                        resolve(undefined);
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = ({
                        "useFileAttachment.useCallback[createPreview]": ()=>resolve(reader.result)
                    })["useFileAttachment.useCallback[createPreview]"];
                    reader.onerror = ({
                        "useFileAttachment.useCallback[createPreview]": ()=>resolve(undefined)
                    })["useFileAttachment.useCallback[createPreview]"];
                    reader.readAsDataURL(file);
                }
            }["useFileAttachment.useCallback[createPreview]"]);
        }
    }["useFileAttachment.useCallback[createPreview]"], []);
    const addFiles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFileAttachment.useCallback[addFiles]": async (files)=>{
            const fileArray = Array.from(files);
            // Check max files limit
            if (attachments.length + fileArray.length > maxFiles) {
                onError?.(`Maximum ${maxFiles} files allowed`);
                return;
            }
            setIsProcessing(true);
            const newAttachments = [];
            for (const file of fileArray){
                // Validate file type
                if (!isAcceptedType(file)) {
                    onError?.(`File type not supported: ${file.type || 'unknown'}`);
                    continue;
                }
                // Validate file size
                if (file.size > maxSizeBytes) {
                    const maxSizeMB = Math.round(maxSizeBytes / (1024 * 1024));
                    onError?.(`File too large: ${file.name} (max ${maxSizeMB}MB)`);
                    continue;
                }
                const preview = await createPreview(file);
                newAttachments.push({
                    id: generateId(),
                    file,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    preview
                });
            }
            setAttachments({
                "useFileAttachment.useCallback[addFiles]": (prev)=>[
                        ...prev,
                        ...newAttachments
                    ]
            }["useFileAttachment.useCallback[addFiles]"]);
            setIsProcessing(false);
        }
    }["useFileAttachment.useCallback[addFiles]"], [
        attachments.length,
        maxFiles,
        maxSizeBytes,
        isAcceptedType,
        createPreview,
        onError
    ]);
    const removeAttachment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFileAttachment.useCallback[removeAttachment]": (id)=>{
            setAttachments({
                "useFileAttachment.useCallback[removeAttachment]": (prev)=>prev.filter({
                        "useFileAttachment.useCallback[removeAttachment]": (a)=>a.id !== id
                    }["useFileAttachment.useCallback[removeAttachment]"])
            }["useFileAttachment.useCallback[removeAttachment]"]);
        }
    }["useFileAttachment.useCallback[removeAttachment]"], []);
    const clearAttachments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFileAttachment.useCallback[clearAttachments]": ()=>{
            setAttachments([]);
        }
    }["useFileAttachment.useCallback[clearAttachments]"], []);
    const openFilePicker = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFileAttachment.useCallback[openFilePicker]": ()=>{
            fileInputRef.current?.click();
        }
    }["useFileAttachment.useCallback[openFilePicker]"], []);
    const handleFileInputChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFileAttachment.useCallback[handleFileInputChange]": (e)=>{
            if (e.target.files && e.target.files.length > 0) {
                addFiles(e.target.files);
                // Reset input so same file can be selected again
                e.target.value = '';
            }
        }
    }["useFileAttachment.useCallback[handleFileInputChange]"], [
        addFiles
    ]);
    // Format file size for display
    const formatFileSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFileAttachment.useCallback[formatFileSize]": (bytes)=>{
            if (bytes < 1024) return `${bytes} B`;
            if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        }
    }["useFileAttachment.useCallback[formatFileSize]"], []);
    // Get files ready for upload (as FormData-compatible array)
    const getFilesForUpload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFileAttachment.useCallback[getFilesForUpload]": ()=>{
            return attachments.map({
                "useFileAttachment.useCallback[getFilesForUpload]": (a)=>a.file
            }["useFileAttachment.useCallback[getFilesForUpload]"]);
        }
    }["useFileAttachment.useCallback[getFilesForUpload]"], [
        attachments
    ]);
    // Convert attachments to base64 for API calls
    const getAttachmentsAsBase64 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFileAttachment.useCallback[getAttachmentsAsBase64]": async ()=>{
            const results = await Promise.all(attachments.map({
                "useFileAttachment.useCallback[getAttachmentsAsBase64]": async (attachment)=>{
                    const data = await new Promise({
                        "useFileAttachment.useCallback[getAttachmentsAsBase64]": (resolve)=>{
                            const reader = new FileReader();
                            reader.onload = ({
                                "useFileAttachment.useCallback[getAttachmentsAsBase64]": ()=>{
                                    const base64 = reader.result.split(',')[1];
                                    resolve(base64);
                                }
                            })["useFileAttachment.useCallback[getAttachmentsAsBase64]"];
                            reader.readAsDataURL(attachment.file);
                        }
                    }["useFileAttachment.useCallback[getAttachmentsAsBase64]"]);
                    return {
                        name: attachment.name,
                        type: attachment.type,
                        data
                    };
                }
            }["useFileAttachment.useCallback[getAttachmentsAsBase64]"]));
            return results;
        }
    }["useFileAttachment.useCallback[getAttachmentsAsBase64]"], [
        attachments
    ]);
    return {
        attachments,
        isProcessing,
        fileInputRef,
        addFiles,
        removeAttachment,
        clearAttachments,
        openFilePicker,
        handleFileInputChange,
        formatFileSize,
        getFilesForUpload,
        getAttachmentsAsBase64,
        hasAttachments: attachments.length > 0,
        acceptedTypesString: acceptedTypes.join(',')
    };
}
_s(useFileAttachment, "RmMp2BF8Utd0H3nAfo1mzrwYGNY=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useVoiceRecorder.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useVoiceRecorder",
    ()=>useVoiceRecorder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
// ============================================================================
// Constants
// ============================================================================
const DEFAULT_MAX_DURATION = 120; // 2 minutes
const DEFAULT_SAMPLE_RATE = 16000; // Optimal for Whisper
const DEFAULT_LEVELS_COUNT = 20;
// ============================================================================
// Helpers
// ============================================================================
function getErrorMessage(type) {
    switch(type){
        case 'permission-denied':
            return 'Microphone access denied. Please enable microphone permissions.';
        case 'not-supported':
            return 'Audio recording is not supported in this browser.';
        case 'no-audio':
            return 'No audio input detected. Please check your microphone.';
        default:
            return 'An error occurred while recording. Please try again.';
    }
}
function useVoiceRecorder(options = {}) {
    _s();
    const { maxDuration = DEFAULT_MAX_DURATION, levelsCount = DEFAULT_LEVELS_COUNT, onMaxDurationReached } = options;
    // State
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [duration, setDuration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [audioLevels, setAudioLevels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(Array(levelsCount).fill(0));
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Refs
    const mediaRecorderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioContextRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const analyserRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const streamRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const chunksRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const durationIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const levelsIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const startTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // Check browser support
    const isSupported = ("TURBOPACK compile-time value", "object") !== 'undefined' && typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined';
    // Cleanup function
    const cleanup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceRecorder.useCallback[cleanup]": ()=>{
            // Stop intervals
            if (durationIntervalRef.current) {
                clearInterval(durationIntervalRef.current);
                durationIntervalRef.current = null;
            }
            if (levelsIntervalRef.current) {
                clearInterval(levelsIntervalRef.current);
                levelsIntervalRef.current = null;
            }
            // Stop media recorder
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                try {
                    mediaRecorderRef.current.stop();
                } catch  {
                // Ignore errors when stopping
                }
            }
            // Stop all tracks
            if (streamRef.current) {
                streamRef.current.getTracks().forEach({
                    "useVoiceRecorder.useCallback[cleanup]": (track)=>track.stop()
                }["useVoiceRecorder.useCallback[cleanup]"]);
                streamRef.current = null;
            }
            // Close audio context
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
            analyserRef.current = null;
            mediaRecorderRef.current = null;
            chunksRef.current = [];
        }
    }["useVoiceRecorder.useCallback[cleanup]"], []);
    // Update audio levels for waveform visualization
    const updateAudioLevels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceRecorder.useCallback[updateAudioLevels]": ()=>{
            if (!analyserRef.current) return;
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            // Calculate average level
            let sum = 0;
            for(let i = 0; i < dataArray.length; i++){
                sum += dataArray[i];
            }
            const average = sum / dataArray.length / 255; // Normalize to 0-1
            // Add new level and remove oldest
            setAudioLevels({
                "useVoiceRecorder.useCallback[updateAudioLevels]": (prev)=>{
                    const newLevels = [
                        ...prev.slice(1),
                        average
                    ];
                    return newLevels;
                }
            }["useVoiceRecorder.useCallback[updateAudioLevels]"]);
        }
    }["useVoiceRecorder.useCallback[updateAudioLevels]"], []);
    // Start recording
    const startRecording = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceRecorder.useCallback[startRecording]": async ()=>{
            if (!isSupported) {
                const err = {
                    type: 'not-supported',
                    message: getErrorMessage('not-supported')
                };
                setError(err);
                setStatus('error');
                return;
            }
            // Reset state
            setError(null);
            setDuration(0);
            setAudioLevels(Array(levelsCount).fill(0));
            chunksRef.current = [];
            try {
                // Request microphone access
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    }
                });
                streamRef.current = stream;
                // Set up audio context and analyser for levels
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                const audioContext = new AudioContextClass();
                audioContextRef.current = audioContext;
                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.5;
                analyserRef.current = analyser;
                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);
                // Determine the best mime type
                const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : 'audio/wav';
                // Create media recorder
                const mediaRecorder = new MediaRecorder(stream, {
                    mimeType
                });
                mediaRecorderRef.current = mediaRecorder;
                // Handle data available
                mediaRecorder.ondataavailable = ({
                    "useVoiceRecorder.useCallback[startRecording]": (event)=>{
                        if (event.data.size > 0) {
                            chunksRef.current.push(event.data);
                        }
                    }
                })["useVoiceRecorder.useCallback[startRecording]"];
                // Start recording
                mediaRecorder.start(100); // Collect data every 100ms
                setStatus('recording');
                startTimeRef.current = Date.now();
                // Start duration timer
                durationIntervalRef.current = setInterval({
                    "useVoiceRecorder.useCallback[startRecording]": ()=>{
                        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
                        setDuration(elapsed);
                        // Check max duration
                        if (elapsed >= maxDuration) {
                            onMaxDurationReached?.();
                        }
                    }
                }["useVoiceRecorder.useCallback[startRecording]"], 100);
                // Start audio levels updates
                levelsIntervalRef.current = setInterval(updateAudioLevels, 50);
            } catch (err) {
                cleanup();
                let errorType = 'unknown';
                if (err instanceof DOMException) {
                    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                        errorType = 'permission-denied';
                    } else if (err.name === 'NotFoundError') {
                        errorType = 'no-audio';
                    }
                }
                const recordingError = {
                    type: errorType,
                    message: getErrorMessage(errorType)
                };
                setError(recordingError);
                setStatus('error');
            }
        }
    }["useVoiceRecorder.useCallback[startRecording]"], [
        isSupported,
        levelsCount,
        maxDuration,
        onMaxDurationReached,
        cleanup,
        updateAudioLevels
    ]);
    // Stop recording and return audio blob
    const stopRecording = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceRecorder.useCallback[stopRecording]": async ()=>{
            if (!mediaRecorderRef.current || status !== 'recording') {
                return null;
            }
            setStatus('processing');
            return new Promise({
                "useVoiceRecorder.useCallback[stopRecording]": (resolve)=>{
                    const mediaRecorder = mediaRecorderRef.current;
                    mediaRecorder.onstop = ({
                        "useVoiceRecorder.useCallback[stopRecording]": ()=>{
                            // Create blob from chunks
                            const mimeType = mediaRecorder.mimeType;
                            const blob = new Blob(chunksRef.current, {
                                type: mimeType
                            });
                            cleanup();
                            setStatus('idle');
                            setAudioLevels(Array(levelsCount).fill(0));
                            resolve(blob);
                        }
                    })["useVoiceRecorder.useCallback[stopRecording]"];
                    mediaRecorder.stop();
                }
            }["useVoiceRecorder.useCallback[stopRecording]"]);
        }
    }["useVoiceRecorder.useCallback[stopRecording]"], [
        status,
        cleanup,
        levelsCount
    ]);
    // Cancel recording without returning audio
    const cancelRecording = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceRecorder.useCallback[cancelRecording]": ()=>{
            cleanup();
            setStatus('idle');
            setDuration(0);
            setAudioLevels(Array(levelsCount).fill(0));
            setError(null);
        }
    }["useVoiceRecorder.useCallback[cancelRecording]"], [
        cleanup,
        levelsCount
    ]);
    // Cleanup on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useVoiceRecorder.useEffect": ()=>{
            return ({
                "useVoiceRecorder.useEffect": ()=>{
                    cleanup();
                }
            })["useVoiceRecorder.useEffect"];
        }
    }["useVoiceRecorder.useEffect"], [
        cleanup
    ]);
    return {
        // State
        status,
        isRecording: status === 'recording',
        duration,
        audioLevels,
        error,
        // Capabilities
        isSupported,
        // Actions
        startRecording,
        stopRecording,
        cancelRecording
    };
}
_s(useVoiceRecorder, "C+cciMlt0y96RWCIi20804unVD4=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useSpeechRecognition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSpeechRecognition",
    ()=>useSpeechRecognition
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
// ============================================================================
// Helpers
// ============================================================================
function getSpeechRecognition() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    return SpeechRecognition || null;
}
function mapErrorType(errorCode) {
    switch(errorCode){
        case 'not-allowed':
        case 'service-not-allowed':
            return 'not-allowed';
        case 'no-speech':
            return 'no-speech';
        case 'network':
            return 'network';
        case 'aborted':
            return 'aborted';
        default:
            return 'unknown';
    }
}
function getErrorMessage(type) {
    switch(type){
        case 'not-allowed':
            return 'Microphone access denied. Please enable microphone permissions.';
        case 'no-speech':
            return 'No speech detected. Please try again.';
        case 'network':
            return 'Network error. Please check your connection.';
        case 'aborted':
            return 'Speech recognition was cancelled.';
        default:
            return 'An error occurred. Please try again.';
    }
}
function useSpeechRecognition(options = {}) {
    _s();
    const { continuous = false, interimResults = true, language = 'en-US', onResult, onError, onEnd, onStart, autoStop = true, silenceTimeout = 2000 } = options;
    // State
    const [transcript, setTranscript] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [interimTranscript, setInterimTranscript] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isMicrophoneAvailable, setIsMicrophoneAvailable] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Refs
    const recognitionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const silenceTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isListeningRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Check browser support
    const isSupported = ("TURBOPACK compile-time value", "object") !== 'undefined' && getSpeechRecognition() !== null;
    // Clear silence timer
    const clearSilenceTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSpeechRecognition.useCallback[clearSilenceTimer]": ()=>{
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
                silenceTimerRef.current = null;
            }
        }
    }["useSpeechRecognition.useCallback[clearSilenceTimer]"], []);
    // Reset silence timer
    const resetSilenceTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSpeechRecognition.useCallback[resetSilenceTimer]": ()=>{
            clearSilenceTimer();
            if (autoStop && isListeningRef.current) {
                silenceTimerRef.current = setTimeout({
                    "useSpeechRecognition.useCallback[resetSilenceTimer]": ()=>{
                        if (recognitionRef.current && isListeningRef.current) {
                            recognitionRef.current.stop();
                        }
                    }
                }["useSpeechRecognition.useCallback[resetSilenceTimer]"], silenceTimeout);
            }
        }
    }["useSpeechRecognition.useCallback[resetSilenceTimer]"], [
        autoStop,
        silenceTimeout,
        clearSilenceTimer
    ]);
    // Stop listening
    const stopListening = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSpeechRecognition.useCallback[stopListening]": ()=>{
            clearSilenceTimer();
            if (recognitionRef.current && isListeningRef.current) {
                isListeningRef.current = false;
                try {
                    recognitionRef.current.stop();
                } catch  {
                // Ignore errors when stopping
                }
            }
            setStatus('idle');
        }
    }["useSpeechRecognition.useCallback[stopListening]"], [
        clearSilenceTimer
    ]);
    // Start listening
    const startListening = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSpeechRecognition.useCallback[startListening]": ()=>{
            if (!isSupported) {
                setStatus('unsupported');
                const err = {
                    type: 'unknown',
                    message: 'Speech recognition is not supported in this browser.'
                };
                setError(err);
                onError?.(err);
                return;
            }
            // Reset state
            setError(null);
            setInterimTranscript('');
            const SpeechRecognitionClass = getSpeechRecognition();
            if (!SpeechRecognitionClass) return;
            // Create new instance
            const recognition = new SpeechRecognitionClass();
            recognitionRef.current = recognition;
            // Configure
            recognition.continuous = continuous;
            recognition.interimResults = interimResults;
            recognition.lang = language;
            recognition.maxAlternatives = 1;
            // Handle results
            recognition.onresult = ({
                "useSpeechRecognition.useCallback[startListening]": (event)=>{
                    clearSilenceTimer();
                    let finalTranscript = '';
                    let interim = '';
                    for(let i = event.resultIndex; i < event.results.length; i++){
                        const result = event.results[i];
                        const text = result[0].transcript;
                        if (result.isFinal) {
                            finalTranscript += text;
                        } else {
                            interim += text;
                        }
                    }
                    if (finalTranscript) {
                        setTranscript({
                            "useSpeechRecognition.useCallback[startListening]": (prev)=>prev + finalTranscript
                        }["useSpeechRecognition.useCallback[startListening]"]);
                        onResult?.(finalTranscript, true);
                    }
                    setInterimTranscript(interim);
                    if (interim) {
                        onResult?.(interim, false);
                    }
                    // Reset silence timer on any speech
                    resetSilenceTimer();
                }
            })["useSpeechRecognition.useCallback[startListening]"];
            // Handle errors
            recognition.onerror = ({
                "useSpeechRecognition.useCallback[startListening]": (event)=>{
                    const errorType = mapErrorType(event.error);
                    const err = {
                        type: errorType,
                        message: event.message || getErrorMessage(errorType)
                    };
                    setError(err);
                    setStatus('error');
                    if (errorType === 'not-allowed') {
                        setIsMicrophoneAvailable(false);
                    }
                    onError?.(err);
                    isListeningRef.current = false;
                }
            })["useSpeechRecognition.useCallback[startListening]"];
            // Handle end
            recognition.onend = ({
                "useSpeechRecognition.useCallback[startListening]": ()=>{
                    clearSilenceTimer();
                    isListeningRef.current = false;
                    if (status !== 'error') {
                        setStatus('idle');
                    }
                    setInterimTranscript('');
                    onEnd?.();
                }
            })["useSpeechRecognition.useCallback[startListening]"];
            // Handle start
            recognition.onstart = ({
                "useSpeechRecognition.useCallback[startListening]": ()=>{
                    isListeningRef.current = true;
                    setStatus('listening');
                    onStart?.();
                    resetSilenceTimer();
                }
            })["useSpeechRecognition.useCallback[startListening]"];
            // Start recognition
            try {
                recognition.start();
            } catch (e) {
                const err = {
                    type: 'unknown',
                    message: e instanceof Error ? e.message : 'Failed to start speech recognition'
                };
                setError(err);
                setStatus('error');
                onError?.(err);
            }
        }
    }["useSpeechRecognition.useCallback[startListening]"], [
        isSupported,
        continuous,
        interimResults,
        language,
        onResult,
        onError,
        onEnd,
        onStart,
        clearSilenceTimer,
        resetSilenceTimer,
        status
    ]);
    // Reset transcript
    const resetTranscript = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSpeechRecognition.useCallback[resetTranscript]": ()=>{
            setTranscript('');
            setInterimTranscript('');
        }
    }["useSpeechRecognition.useCallback[resetTranscript]"], []);
    // Cleanup on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSpeechRecognition.useEffect": ()=>{
            return ({
                "useSpeechRecognition.useEffect": ()=>{
                    clearSilenceTimer();
                    if (recognitionRef.current) {
                        try {
                            recognitionRef.current.abort();
                        } catch  {
                        // Ignore
                        }
                    }
                }
            })["useSpeechRecognition.useEffect"];
        }
    }["useSpeechRecognition.useEffect"], [
        clearSilenceTimer
    ]);
    // Check initial support
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSpeechRecognition.useEffect": ()=>{
            if (!isSupported) {
                setStatus('unsupported');
            }
        }
    }["useSpeechRecognition.useEffect"], [
        isSupported
    ]);
    return {
        transcript,
        interimTranscript,
        status,
        error,
        isListening: status === 'listening',
        isSupported,
        isMicrophoneAvailable,
        startListening,
        stopListening,
        resetTranscript
    };
}
_s(useSpeechRecognition, "88lJowELstJh0KPdfZ4BW4BUS48=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useTextToSpeech.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTextToSpeech",
    ()=>useTextToSpeech
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
// ============================================================================
// Audio unlock state (shared across all hook instances)
// ============================================================================
let globalAudioUnlocked = false;
let globalAudioContext = null;
let globalBlessedAudio = null;
let globalUnlockListenerAdded = false;
/**
 * Unlock audio playback by playing a silent sound.
 * This must be called from a user interaction (click, tap, etc.)
 */ async function unlockAudioPlayback() {
    if (globalAudioUnlocked) return true;
    try {
        // Create or resume AudioContext
        if (!globalAudioContext) {
            globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (globalAudioContext.state === 'suspended') {
            await globalAudioContext.resume();
        }
        // Create a "blessed" Audio element that we can reuse
        // iOS Safari requires the Audio element to be created AND played during user interaction
        if (!globalBlessedAudio) {
            globalBlessedAudio = new Audio();
            globalBlessedAudio.volume = 1;
        }
        // Play a silent sound to unlock audio on iOS/Safari
        // Using a very short silent WAV
        globalBlessedAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
        const playPromise = globalBlessedAudio.play();
        if (playPromise !== undefined) {
            await playPromise;
        }
        globalBlessedAudio.pause();
        globalBlessedAudio.currentTime = 0;
        globalAudioUnlocked = true;
        console.log('[TTS] Audio playback unlocked');
        return true;
    } catch (error) {
        console.warn('[TTS] Failed to unlock audio:', error);
        return false;
    }
}
/**
 * Add a document-level listener to auto-unlock audio on first user interaction.
 * This ensures audio is unlocked even if the user doesn't explicitly click the voice button.
 */ function setupGlobalUnlockListener() {
    if (globalUnlockListenerAdded || typeof document === 'undefined') return;
    const unlockHandler = ()=>{
        if (!globalAudioUnlocked) {
            unlockAudioPlayback().catch(console.warn);
        }
    };
    // Listen for any user interaction
    document.addEventListener('click', unlockHandler, {
        once: false,
        passive: true
    });
    document.addEventListener('touchstart', unlockHandler, {
        once: false,
        passive: true
    });
    document.addEventListener('keydown', unlockHandler, {
        once: false,
        passive: true
    });
    globalUnlockListenerAdded = true;
    console.log('[TTS] Global unlock listeners added');
}
function useTextToSpeech(options = {}) {
    _s();
    const { voice = 'nova', speed = 1.0, provider = 'openai', onStart, onEnd, onError, autoPlay = true } = options;
    // State
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentText, setCurrentText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isAudioUnlocked, setIsAudioUnlocked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(globalAudioUnlocked);
    // Refs
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Set up global unlock listener on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTextToSpeech.useEffect": ()=>{
            setupGlobalUnlockListener();
        }
    }["useTextToSpeech.useEffect"], []);
    // Sync audio unlock state with global state
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTextToSpeech.useEffect": ()=>{
            const checkUnlockState = {
                "useTextToSpeech.useEffect.checkUnlockState": ()=>{
                    if (globalAudioUnlocked && !isAudioUnlocked) {
                        setIsAudioUnlocked(true);
                    }
                }
            }["useTextToSpeech.useEffect.checkUnlockState"];
            // Check periodically in case global state was updated
            const interval = setInterval(checkUnlockState, 500);
            return ({
                "useTextToSpeech.useEffect": ()=>clearInterval(interval)
            })["useTextToSpeech.useEffect"];
        }
    }["useTextToSpeech.useEffect"], [
        isAudioUnlocked
    ]);
    // Unlock audio (call this on user interaction like clicking mic button)
    const unlockAudio = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTextToSpeech.useCallback[unlockAudio]": async ()=>{
            const unlocked = await unlockAudioPlayback();
            setIsAudioUnlocked(unlocked);
        }
    }["useTextToSpeech.useCallback[unlockAudio]"], []);
    // Clean up audio element
    const cleanupAudio = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTextToSpeech.useCallback[cleanupAudio]": ()=>{
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
                audioRef.current.load();
                audioRef.current = null;
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        }
    }["useTextToSpeech.useCallback[cleanupAudio]"], []);
    // Stop speaking
    const stop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTextToSpeech.useCallback[stop]": ()=>{
            cleanupAudio();
            setStatus('idle');
            setCurrentText(null);
        }
    }["useTextToSpeech.useCallback[stop]"], [
        cleanupAudio
    ]);
    // Pause speaking
    const pause = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTextToSpeech.useCallback[pause]": ()=>{
            if (audioRef.current && status === 'speaking') {
                audioRef.current.pause();
            }
        }
    }["useTextToSpeech.useCallback[pause]"], [
        status
    ]);
    // Resume speaking
    const resume = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTextToSpeech.useCallback[resume]": ()=>{
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.play().catch(console.error);
            }
        }
    }["useTextToSpeech.useCallback[resume]"], []);
    // Speak text
    const speak = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTextToSpeech.useCallback[speak]": async (text)=>{
            if (!text.trim()) return;
            // Stop any current speech
            cleanupAudio();
            setError(null);
            setCurrentText(text);
            setStatus('loading');
            // Ensure AudioContext is resumed (iOS Safari requirement)
            if (globalAudioContext && globalAudioContext.state === 'suspended') {
                try {
                    await globalAudioContext.resume();
                    console.log('[TTS] AudioContext resumed');
                } catch (e) {
                    console.warn('[TTS] Failed to resume AudioContext:', e);
                }
            }
            // Create abort controller for this request
            abortControllerRef.current = new AbortController();
            try {
                // Use appropriate endpoint based on provider
                const endpoint = provider === 'elevenlabs' ? '/api/tts/elevenlabs' : '/api/tts';
                const body = provider === 'elevenlabs' ? {
                    text
                } // ElevenLabs uses voice ID from env var
                 : {
                    text,
                    voice,
                    speed
                };
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body),
                    signal: abortControllerRef.current.signal
                });
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "useTextToSpeech.useCallback[speak]": ()=>({})
                    }["useTextToSpeech.useCallback[speak]"]);
                    throw new Error(errorData.error || 'Failed to generate speech');
                }
                // Get the audio blob
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                // Use the blessed audio element if available (for iOS Safari compatibility)
                // Otherwise create a new one
                const audio = globalBlessedAudio || new Audio();
                audioRef.current = audio;
                // Set up event handlers
                audio.onloadeddata = ({
                    "useTextToSpeech.useCallback[speak]": ()=>{
                        if (autoPlay) {
                            // Try to play with retry on failure
                            const attemptPlay = {
                                "useTextToSpeech.useCallback[speak].attemptPlay": async (retries = 2)=>{
                                    try {
                                        await audio.play();
                                        setStatus('speaking');
                                        setIsAudioUnlocked(true);
                                        onStart?.();
                                    } catch (playError) {
                                        console.warn('[TTS] Play failed:', playError.message, `(retries left: ${retries})`);
                                        if (retries > 0) {
                                            // Try to resume AudioContext and retry
                                            if (globalAudioContext?.state === 'suspended') {
                                                await globalAudioContext.resume().catch({
                                                    "useTextToSpeech.useCallback[speak].attemptPlay": ()=>{}
                                                }["useTextToSpeech.useCallback[speak].attemptPlay"]);
                                            }
                                            await new Promise({
                                                "useTextToSpeech.useCallback[speak].attemptPlay": (r)=>setTimeout(r, 100)
                                            }["useTextToSpeech.useCallback[speak].attemptPlay"]);
                                            return attemptPlay(retries - 1);
                                        }
                                        // All retries failed - show user-friendly message
                                        const err = {
                                            type: 'audio',
                                            message: 'Tap anywhere to enable voice responses'
                                        };
                                        setError(err);
                                        setStatus('error');
                                        onError?.(err);
                                    }
                                }
                            }["useTextToSpeech.useCallback[speak].attemptPlay"];
                            attemptPlay();
                        }
                    }
                })["useTextToSpeech.useCallback[speak]"];
                audio.onended = ({
                    "useTextToSpeech.useCallback[speak]": ()=>{
                        URL.revokeObjectURL(audioUrl);
                        setStatus('idle');
                        setCurrentText(null);
                        onEnd?.();
                    }
                })["useTextToSpeech.useCallback[speak]"];
                audio.onerror = ({
                    "useTextToSpeech.useCallback[speak]": ()=>{
                        URL.revokeObjectURL(audioUrl);
                        const err = {
                            type: 'audio',
                            message: 'Failed to load audio'
                        };
                        setError(err);
                        setStatus('error');
                        onError?.(err);
                    }
                })["useTextToSpeech.useCallback[speak]"];
                // Load the audio
                audio.src = audioUrl;
                audio.load();
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    // Request was aborted, not an error
                    setStatus('idle');
                    return;
                }
                const error = {
                    type: 'network',
                    message: err instanceof Error ? err.message : 'Unknown error'
                };
                setError(error);
                setStatus('error');
                onError?.(error);
            }
        }
    }["useTextToSpeech.useCallback[speak]"], [
        cleanupAudio,
        provider,
        voice,
        speed,
        autoPlay,
        onStart,
        onEnd,
        onError
    ]);
    // Cleanup on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTextToSpeech.useEffect": ()=>{
            return ({
                "useTextToSpeech.useEffect": ()=>{
                    cleanupAudio();
                }
            })["useTextToSpeech.useEffect"];
        }
    }["useTextToSpeech.useEffect"], [
        cleanupAudio
    ]);
    // Sync global unlock state
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTextToSpeech.useEffect": ()=>{
            setIsAudioUnlocked(globalAudioUnlocked);
        }
    }["useTextToSpeech.useEffect"], []);
    return {
        status,
        error,
        isSpeaking: status === 'speaking',
        isLoading: status === 'loading',
        currentText,
        isAudioUnlocked,
        speak,
        stop,
        pause,
        resume,
        unlockAudio
    };
}
_s(useTextToSpeech, "HeprRNiAYW+q1ceE33tE8svLcNw=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useVoiceChat.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useVoiceChat",
    ()=>useVoiceChat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpeechRecognition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSpeechRecognition.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTextToSpeech$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useTextToSpeech.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function useVoiceChat(options = {}) {
    _s();
    const { voice = 'nova', provider = 'elevenlabs', language = 'en-US', continuous = false, autoSpeak = true, onTranscriptComplete, onSpeakingStart, onSpeakingEnd, onError } = options;
    // State
    const [isVoiceEnabled, setIsVoiceEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Refs for tracking state across callbacks
    const pendingTranscriptRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])('');
    const isProcessingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Speech Recognition (input)
    const speechRecognition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpeechRecognition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpeechRecognition"])({
        continuous,
        language,
        interimResults: true,
        autoStop: true,
        silenceTimeout: 2000,
        onResult: {
            "useVoiceChat.useSpeechRecognition[speechRecognition]": (transcript, isFinal)=>{
                if (isFinal) {
                    pendingTranscriptRef.current += transcript;
                }
            }
        }["useVoiceChat.useSpeechRecognition[speechRecognition]"],
        onEnd: {
            "useVoiceChat.useSpeechRecognition[speechRecognition]": ()=>{
                // When speech recognition ends, process the transcript
                if (pendingTranscriptRef.current.trim() && !isProcessingRef.current) {
                    const finalTranscript = pendingTranscriptRef.current.trim();
                    pendingTranscriptRef.current = '';
                    setMode('processing');
                    isProcessingRef.current = true;
                    onTranscriptComplete?.(finalTranscript);
                    isProcessingRef.current = false;
                } else if (mode === 'listening') {
                    setMode('idle');
                }
            }
        }["useVoiceChat.useSpeechRecognition[speechRecognition]"],
        onError: {
            "useVoiceChat.useSpeechRecognition[speechRecognition]": (err)=>{
                const voiceError = {
                    type: 'speech',
                    message: err.message
                };
                setError(voiceError);
                setMode('idle');
                onError?.(voiceError);
            }
        }["useVoiceChat.useSpeechRecognition[speechRecognition]"]
    });
    // Text-to-Speech (output)
    const tts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTextToSpeech$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTextToSpeech"])({
        voice,
        provider,
        speed: 1.0,
        onStart: {
            "useVoiceChat.useTextToSpeech[tts]": ()=>{
                setMode('speaking');
                onSpeakingStart?.();
            }
        }["useVoiceChat.useTextToSpeech[tts]"],
        onEnd: {
            "useVoiceChat.useTextToSpeech[tts]": ()=>{
                setMode('idle');
                onSpeakingEnd?.();
            }
        }["useVoiceChat.useTextToSpeech[tts]"],
        onError: {
            "useVoiceChat.useTextToSpeech[tts]": (err)=>{
                const voiceError = {
                    type: 'tts',
                    message: err.message
                };
                setError(voiceError);
                setMode('idle');
                onError?.(voiceError);
            }
        }["useVoiceChat.useTextToSpeech[tts]"]
    });
    // Update mode based on speech recognition status
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useVoiceChat.useEffect": ()=>{
            if (speechRecognition.isListening && mode !== 'speaking') {
                setMode('listening');
            }
        }
    }["useVoiceChat.useEffect"], [
        speechRecognition.isListening,
        mode
    ]);
    // Enable voice mode
    const enableVoice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceChat.useCallback[enableVoice]": ()=>{
            setIsVoiceEnabled(true);
            setError(null);
            // Unlock audio on user interaction
            tts.unlockAudio();
        }
    }["useVoiceChat.useCallback[enableVoice]"], [
        tts
    ]);
    // Disable voice mode
    const disableVoice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceChat.useCallback[disableVoice]": ()=>{
            setIsVoiceEnabled(false);
            speechRecognition.stopListening();
            tts.stop();
            setMode('idle');
            pendingTranscriptRef.current = '';
        }
    }["useVoiceChat.useCallback[disableVoice]"], [
        speechRecognition,
        tts
    ]);
    // Toggle voice mode
    const toggleVoice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceChat.useCallback[toggleVoice]": ()=>{
            if (isVoiceEnabled) {
                disableVoice();
            } else {
                enableVoice();
            }
        }
    }["useVoiceChat.useCallback[toggleVoice]"], [
        isVoiceEnabled,
        enableVoice,
        disableVoice
    ]);
    // Start listening
    const startListening = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceChat.useCallback[startListening]": ()=>{
            if (!isVoiceEnabled) {
                enableVoice();
            }
            // Stop any current speech first
            tts.stop();
            setError(null);
            pendingTranscriptRef.current = '';
            speechRecognition.resetTranscript();
            speechRecognition.startListening();
        }
    }["useVoiceChat.useCallback[startListening]"], [
        isVoiceEnabled,
        enableVoice,
        tts,
        speechRecognition
    ]);
    // Stop listening
    const stopListening = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceChat.useCallback[stopListening]": ()=>{
            speechRecognition.stopListening();
        }
    }["useVoiceChat.useCallback[stopListening]"], [
        speechRecognition
    ]);
    // Speak AI response
    const speakResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceChat.useCallback[speakResponse]": async (text)=>{
            if (!isVoiceEnabled || !autoSpeak) return;
            // Clean the text for speech (remove markdown, links, etc.)
            const cleanText = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
            .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
            .replace(/\*([^*]+)\*/g, '$1') // Remove italic
            .replace(/`([^`]+)`/g, '$1') // Remove code
            .replace(/#{1,6}\s/g, '') // Remove headers
            .replace(/\n+/g, '. ') // Replace newlines with periods
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
            if (cleanText) {
                await tts.speak(cleanText);
            }
        }
    }["useVoiceChat.useCallback[speakResponse]"], [
        isVoiceEnabled,
        autoSpeak,
        tts
    ]);
    // Stop speaking
    const stopSpeaking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceChat.useCallback[stopSpeaking]": ()=>{
            tts.stop();
            setMode('idle');
        }
    }["useVoiceChat.useCallback[stopSpeaking]"], [
        tts
    ]);
    // Reset transcript
    const resetTranscript = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceChat.useCallback[resetTranscript]": ()=>{
            speechRecognition.resetTranscript();
            pendingTranscriptRef.current = '';
        }
    }["useVoiceChat.useCallback[resetTranscript]"], [
        speechRecognition
    ]);
    return {
        // State
        mode,
        isVoiceEnabled,
        transcript: speechRecognition.transcript,
        interimTranscript: speechRecognition.interimTranscript,
        error,
        // Capabilities
        isSpeechSupported: speechRecognition.isSupported,
        isMicrophoneAvailable: speechRecognition.isMicrophoneAvailable,
        // Actions
        enableVoice,
        disableVoice,
        toggleVoice,
        startListening,
        stopListening,
        speakResponse,
        stopSpeaking,
        resetTranscript
    };
}
_s(useVoiceChat, "rX52sIBO4vau7bxzV3eXd81GUJQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpeechRecognition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpeechRecognition"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTextToSpeech$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTextToSpeech"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/usePauseMusicForVoice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "usePauseMusicForVoice",
    ()=>usePauseMusicForVoice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$MusicContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/MusicContext.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function usePauseMusicForVoice({ isRecording = false, isSpeaking = false, isTranscribing = false }) {
    _s();
    // Use context directly to avoid throwing if not in provider
    const musicContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$MusicContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MusicContext"]);
    // Track if we paused the music (to avoid redundant pause calls)
    const didPauseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Pause music when recording starts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePauseMusicForVoice.useEffect": ()=>{
            if (!musicContext) return;
            if (isRecording && musicContext.isPlaying) {
                musicContext.pause();
                didPauseRef.current = true;
            }
        }
    }["usePauseMusicForVoice.useEffect"], [
        isRecording,
        musicContext
    ]);
    // Pause music when TTS speaking starts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePauseMusicForVoice.useEffect": ()=>{
            if (!musicContext) return;
            if (isSpeaking && musicContext.isPlaying) {
                musicContext.pause();
                didPauseRef.current = true;
            }
        }
    }["usePauseMusicForVoice.useEffect"], [
        isSpeaking,
        musicContext
    ]);
    // Pause music when transcribing starts (covers the processing phase)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePauseMusicForVoice.useEffect": ()=>{
            if (!musicContext) return;
            if (isTranscribing && musicContext.isPlaying) {
                musicContext.pause();
                didPauseRef.current = true;
            }
        }
    }["usePauseMusicForVoice.useEffect"], [
        isTranscribing,
        musicContext
    ]);
    // Reset the ref when voice interaction ends (but don't auto-resume)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePauseMusicForVoice.useEffect": ()=>{
            if (!isRecording && !isSpeaking && !isTranscribing) {
                didPauseRef.current = false;
            }
        }
    }["usePauseMusicForVoice.useEffect"], [
        isRecording,
        isSpeaking,
        isTranscribing
    ]);
}
_s(usePauseMusicForVoice, "MbMuuehGdKEGY/eiMm8z5hs00s8=");
const __TURBOPACK__default__export__ = usePauseMusicForVoice;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useVoiceMode.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useVoiceMode",
    ()=>useVoiceMode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
// ============================================================================
// Constants
// ============================================================================
const DEFAULT_CHUNK_DURATION = 2000; // 2 seconds
const DEFAULT_SILENCE_THRESHOLD = 0.02;
const DEFAULT_SILENCE_DURATION = 1500; // 1.5 seconds
const AUDIO_LEVEL_UPDATE_INTERVAL = 50; // 50ms
// Debug logging
const LOG_PREFIX = '[VoiceMode]';
const log = {
    info: (msg, data)=>console.log(`${LOG_PREFIX} ${msg}`, data ?? ''),
    warn: (msg, data)=>console.warn(`${LOG_PREFIX} ${msg}`, data ?? ''),
    error: (msg, data)=>console.error(`${LOG_PREFIX} ${msg}`, data ?? ''),
    state: (from, to)=>console.log(`${LOG_PREFIX} [STATE] ${from} → ${to}`),
    timing: (label, ms)=>console.log(`${LOG_PREFIX} [TIMING] ${label}: ${ms}ms`)
};
function useVoiceMode(config = {}) {
    _s();
    const { chunkDurationMs = DEFAULT_CHUNK_DURATION, silenceThreshold = DEFAULT_SILENCE_THRESHOLD, silenceDurationMs = DEFAULT_SILENCE_DURATION, whisperEndpoint = '/api/whisper', chatEndpoint = '/api/chat/stream', ttsEndpoint = '/api/tts', onTranscriptUpdate, onResponseStart, onResponseEnd, onError, onStateChange } = config;
    // State
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [transcript, setTranscript] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [response, setResponse] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [audioIntensity, setAudioIntensity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Refs for cleanup and management
    const mediaRecorderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioContextRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const analyserRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const streamRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioChunksRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const audioLevelIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const silenceTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const chunkIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastAudioLevelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const silenceStartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const currentAudioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const startTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // State change with logging and callback
    const transitionState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceMode.useCallback[transitionState]": (newState)=>{
            setState({
                "useVoiceMode.useCallback[transitionState]": (prev)=>{
                    if (prev !== newState) {
                        log.state(prev, newState);
                        onStateChange?.(newState);
                    }
                    return newState;
                }
            }["useVoiceMode.useCallback[transitionState]"]);
        }
    }["useVoiceMode.useCallback[transitionState]"], [
        onStateChange
    ]);
    // Cleanup all resources
    const cleanup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceMode.useCallback[cleanup]": ()=>{
            log.info('cleanup() - releasing all resources');
            // Stop intervals
            if (audioLevelIntervalRef.current) {
                clearInterval(audioLevelIntervalRef.current);
                audioLevelIntervalRef.current = null;
            }
            if (silenceTimeoutRef.current) {
                clearTimeout(silenceTimeoutRef.current);
                silenceTimeoutRef.current = null;
            }
            if (chunkIntervalRef.current) {
                clearInterval(chunkIntervalRef.current);
                chunkIntervalRef.current = null;
            }
            // Stop media recorder
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                try {
                    mediaRecorderRef.current.stop();
                } catch  {
                // Ignore
                }
            }
            mediaRecorderRef.current = null;
            // Stop stream tracks
            if (streamRef.current) {
                streamRef.current.getTracks().forEach({
                    "useVoiceMode.useCallback[cleanup]": (track)=>track.stop()
                }["useVoiceMode.useCallback[cleanup]"]);
                streamRef.current = null;
            }
            // Close audio context
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
            analyserRef.current = null;
            // Stop any playing audio
            if (currentAudioRef.current) {
                currentAudioRef.current.pause();
                currentAudioRef.current = null;
            }
            // Abort any pending requests
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
            // Reset refs
            audioChunksRef.current = [];
            silenceStartRef.current = null;
        }
    }["useVoiceMode.useCallback[cleanup]"], []);
    // Update audio intensity for UI feedback
    const updateAudioLevel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceMode.useCallback[updateAudioLevel]": ()=>{
            if (!analyserRef.current) return;
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            // Calculate average level
            let sum = 0;
            for(let i = 0; i < dataArray.length; i++){
                sum += dataArray[i];
            }
            const level = sum / dataArray.length / 255;
            setAudioIntensity(level);
            lastAudioLevelRef.current = level;
            // Detect silence for auto-send
            if (level < silenceThreshold) {
                if (!silenceStartRef.current) {
                    silenceStartRef.current = Date.now();
                } else if (Date.now() - silenceStartRef.current > silenceDurationMs) {
                // Silence detected long enough - could trigger auto-send here
                // For now, we rely on manual tap-to-send per the UX
                }
            } else {
                silenceStartRef.current = null;
            }
        }
    }["useVoiceMode.useCallback[updateAudioLevel]"], [
        silenceThreshold,
        silenceDurationMs
    ]);
    // Transcribe audio chunk via Whisper
    const transcribeChunk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceMode.useCallback[transcribeChunk]": async (audioBlob)=>{
            const formData = new FormData();
            formData.append('audio', audioBlob, 'chunk.webm');
            formData.append('language', 'en');
            const startTime = Date.now();
            log.info('transcribeChunk() - sending to Whisper', {
                size: audioBlob.size
            });
            try {
                const response = await fetch(whisperEndpoint, {
                    method: 'POST',
                    body: formData,
                    signal: abortControllerRef.current?.signal
                });
                if (!response.ok) {
                    throw new Error(`Whisper error: ${response.status}`);
                }
                const result = await response.json();
                log.timing('STT', Date.now() - startTime);
                return result.text || '';
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    log.info('Transcription aborted');
                    return '';
                }
                throw err;
            }
        }
    }["useVoiceMode.useCallback[transcribeChunk]"], [
        whisperEndpoint
    ]);
    // Get LLM response via streaming chat
    const getAIResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceMode.useCallback[getAIResponse]": async (userMessage)=>{
            const startTime = Date.now();
            log.info('getAIResponse() - sending to LLM', {
                length: userMessage.length
            });
            onResponseStart?.();
            try {
                const response = await fetch(chatEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messages: [
                            {
                                role: 'user',
                                content: userMessage
                            }
                        ],
                        model: 'claude',
                        stream: true
                    }),
                    signal: abortControllerRef.current?.signal
                });
                if (!response.ok) {
                    throw new Error(`Chat error: ${response.status}`);
                }
                // Read streaming response
                const reader = response.body?.getReader();
                if (!reader) throw new Error('No response body');
                const decoder = new TextDecoder();
                let fullResponse = '';
                let firstTokenTime = null;
                while(true){
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');
                    for (const line of lines){
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if (data.content) {
                                    if (!firstTokenTime) {
                                        firstTokenTime = Date.now();
                                        log.timing('LLM first token', firstTokenTime - startTime);
                                    }
                                    fullResponse += data.content;
                                    setResponse(fullResponse);
                                }
                            } catch  {
                            // Ignore parse errors for non-JSON lines
                            }
                        }
                    }
                }
                log.timing('LLM total', Date.now() - startTime);
                return fullResponse;
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    log.info('LLM request aborted');
                    return '';
                }
                throw err;
            }
        }
    }["useVoiceMode.useCallback[getAIResponse]"], [
        chatEndpoint,
        onResponseStart
    ]);
    // Speak response via TTS
    const speakResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceMode.useCallback[speakResponse]": async (text)=>{
            const startTime = Date.now();
            log.info('speakResponse() - sending to TTS', {
                length: text.length
            });
            try {
                const response = await fetch(ttsEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text,
                        voice: 'nova'
                    }),
                    signal: abortControllerRef.current?.signal
                });
                if (!response.ok) {
                    throw new Error(`TTS error: ${response.status}`);
                }
                const audioBlob = await response.blob();
                log.timing('TTS', Date.now() - startTime);
                // Play audio
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                currentAudioRef.current = audio;
                return new Promise({
                    "useVoiceMode.useCallback[speakResponse]": (resolve, reject)=>{
                        audio.onended = ({
                            "useVoiceMode.useCallback[speakResponse]": ()=>{
                                URL.revokeObjectURL(audioUrl);
                                currentAudioRef.current = null;
                                resolve();
                            }
                        })["useVoiceMode.useCallback[speakResponse]"];
                        audio.onerror = ({
                            "useVoiceMode.useCallback[speakResponse]": ()=>{
                                URL.revokeObjectURL(audioUrl);
                                currentAudioRef.current = null;
                                reject(new Error('Audio playback failed'));
                            }
                        })["useVoiceMode.useCallback[speakResponse]"];
                        audio.play().catch(reject);
                    }
                }["useVoiceMode.useCallback[speakResponse]"]);
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    log.info('TTS aborted');
                    return;
                }
                throw err;
            }
        }
    }["useVoiceMode.useCallback[speakResponse]"], [
        ttsEndpoint
    ]);
    // Start voice mode (begin listening)
    const start = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceMode.useCallback[start]": async ()=>{
            log.info('start() - initializing voice mode');
            startTimeRef.current = Date.now();
            cleanup();
            setError(null);
            setTranscript('');
            setResponse('');
            audioChunksRef.current = [];
            try {
                // Request microphone
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    }
                });
                streamRef.current = stream;
                // Set up audio analysis
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                const audioContext = new AudioContextClass();
                audioContextRef.current = audioContext;
                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.5;
                analyserRef.current = analyser;
                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);
                // Create media recorder
                const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
                const mediaRecorder = new MediaRecorder(stream, {
                    mimeType
                });
                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.ondataavailable = ({
                    "useVoiceMode.useCallback[start]": (event)=>{
                        if (event.data.size > 0) {
                            audioChunksRef.current.push(event.data);
                        }
                    }
                })["useVoiceMode.useCallback[start]"];
                // Start recording
                mediaRecorder.start(100); // Collect data every 100ms
                abortControllerRef.current = new AbortController();
                // Start audio level monitoring
                audioLevelIntervalRef.current = setInterval(updateAudioLevel, AUDIO_LEVEL_UPDATE_INTERVAL);
                transitionState('listening');
                log.timing('Mic ready', Date.now() - startTimeRef.current);
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : 'Failed to start voice mode';
                log.error('start() failed', err);
                setError(errorMsg);
                onError?.(errorMsg);
                cleanup();
            }
        }
    }["useVoiceMode.useCallback[start]"], [
        cleanup,
        updateAudioLevel,
        transitionState,
        onError
    ]);
    // Stop voice mode completely
    const stop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceMode.useCallback[stop]": ()=>{
            log.info('stop() - ending voice mode');
            cleanup();
            transitionState('idle');
            setAudioIntensity(0);
        }
    }["useVoiceMode.useCallback[stop]"], [
        cleanup,
        transitionState
    ]);
    // Send current audio for processing (manual trigger)
    const send = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceMode.useCallback[send]": async ()=>{
            if (state !== 'listening' || audioChunksRef.current.length === 0) {
                log.warn('send() - nothing to send', {
                    state,
                    chunks: audioChunksRef.current.length
                });
                return;
            }
            log.info('send() - processing audio');
            const totalStartTime = Date.now();
            // Stop recording but keep resources
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
            transitionState('processing');
            try {
                // Combine audio chunks
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: mediaRecorderRef.current?.mimeType || 'audio/webm'
                });
                audioChunksRef.current = [];
                // Transcribe
                const text = await transcribeChunk(audioBlob);
                if (!text.trim()) {
                    log.warn('Empty transcript, returning to listening');
                    await start(); // Restart listening
                    return;
                }
                setTranscript(text);
                onTranscriptUpdate?.(text, true);
                log.info('Transcript ready', {
                    text: text.substring(0, 50) + '...'
                });
                // Get AI response
                const aiResponse = await getAIResponse(text);
                if (!aiResponse.trim()) {
                    log.warn('Empty AI response');
                    onResponseEnd?.('');
                    await start();
                    return;
                }
                onResponseEnd?.(aiResponse);
                // Speak response
                transitionState('speaking');
                await speakResponse(aiResponse);
                // Return to listening after speaking
                log.timing('Total round-trip', Date.now() - totalStartTime);
                await start();
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : 'Processing failed';
                log.error('send() failed', err);
                setError(errorMsg);
                onError?.(errorMsg);
                stop();
            }
        }
    }["useVoiceMode.useCallback[send]"], [
        state,
        start,
        stop,
        transcribeChunk,
        getAIResponse,
        speakResponse,
        transitionState,
        onTranscriptUpdate,
        onResponseEnd,
        onError
    ]);
    // Interrupt speaking and switch back to listening
    const interrupt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVoiceMode.useCallback[interrupt]": ()=>{
            log.info('interrupt() - stopping speech, returning to listening');
            // Stop current audio playback
            if (currentAudioRef.current) {
                currentAudioRef.current.pause();
                currentAudioRef.current = null;
            }
            // Abort any pending requests
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            // Restart listening
            start();
        }
    }["useVoiceMode.useCallback[interrupt]"], [
        start
    ]);
    // Cleanup on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useVoiceMode.useEffect": ()=>{
            return ({
                "useVoiceMode.useEffect": ()=>{
                    cleanup();
                }
            })["useVoiceMode.useEffect"];
        }
    }["useVoiceMode.useEffect"], [
        cleanup
    ]);
    return {
        state,
        isActive: state !== 'idle',
        transcript,
        response,
        audioIntensity,
        error,
        start,
        stop,
        send,
        interrupt
    };
}
_s(useVoiceMode, "q8D424RRi5u6NJmvA9IvgIZA1cw=");
const __TURBOPACK__default__export__ = useVoiceMode;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/usePerformanceMetrics.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePerformanceMetrics",
    ()=>usePerformanceMetrics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const initialMetrics = {
    fcp: null,
    lcp: null,
    cls: null,
    fid: null,
    inp: null,
    ttfb: null,
    pageLoadTime: null,
    domInteractive: null,
    resourceCount: 0,
    transferSize: 0,
    overallScore: "fast",
    primaryMetric: null
};
function getOverallScore(metrics) {
    const { lcp, fcp, cls, ttfb, pageLoadTime } = metrics;
    // Primary metric for scoring (prefer LCP, fallback to FCP, then pageLoadTime)
    const primaryTime = lcp ?? fcp ?? pageLoadTime ?? 0;
    // Google's Core Web Vitals thresholds
    // LCP: Good < 2500ms, Needs Improvement < 4000ms, Poor >= 4000ms
    // FCP: Good < 1800ms, Needs Improvement < 3000ms, Poor >= 3000ms
    // CLS: Good < 0.1, Needs Improvement < 0.25, Poor >= 0.25
    // TTFB: Good < 800ms, Needs Improvement < 1800ms, Poor >= 1800ms
    let score = 0;
    let count = 0;
    if (primaryTime > 0) {
        if (primaryTime < 1500) score += 3;
        else if (primaryTime < 2500) score += 2;
        else if (primaryTime < 4000) score += 1;
        count++;
    }
    if (ttfb && ttfb > 0) {
        if (ttfb < 400) score += 3;
        else if (ttfb < 800) score += 2;
        else if (ttfb < 1800) score += 1;
        count++;
    }
    if (cls !== null && cls !== undefined) {
        if (cls < 0.1) score += 3;
        else if (cls < 0.25) score += 2;
        else score += 1;
        count++;
    }
    if (count === 0) return "fast";
    const avg = score / count;
    if (avg >= 2.5) return "fast";
    if (avg >= 1.5) return "moderate";
    return "slow";
}
function usePerformanceMetrics() {
    _s();
    const [metrics, setMetrics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialMetrics);
    const [isSupported, setIsSupported] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const updateMetrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePerformanceMetrics.useCallback[updateMetrics]": (updates)=>{
            setMetrics({
                "usePerformanceMetrics.useCallback[updateMetrics]": (prev)=>{
                    const newMetrics = {
                        ...prev,
                        ...updates
                    };
                    // Recalculate primary metric and score
                    newMetrics.primaryMetric = newMetrics.lcp ?? newMetrics.fcp ?? newMetrics.pageLoadTime;
                    newMetrics.overallScore = getOverallScore(newMetrics);
                    return newMetrics;
                }
            }["usePerformanceMetrics.useCallback[updateMetrics]"]);
        }
    }["usePerformanceMetrics.useCallback[updateMetrics]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePerformanceMetrics.useEffect": ()=>{
            if (("TURBOPACK compile-time value", "object") === "undefined" || !window.performance) {
                setIsSupported(false);
                return;
            }
            // Get navigation timing data
            const getNavigationTiming = {
                "usePerformanceMetrics.useEffect.getNavigationTiming": ()=>{
                    const navigation = performance.getEntriesByType("navigation")[0];
                    if (navigation) {
                        const pageLoadTime = navigation.loadEventEnd - navigation.startTime;
                        const domInteractive = navigation.domInteractive - navigation.startTime;
                        const ttfb = navigation.responseStart - navigation.requestStart;
                        updateMetrics({
                            pageLoadTime: pageLoadTime > 0 ? Math.round(pageLoadTime) : null,
                            domInteractive: domInteractive > 0 ? Math.round(domInteractive) : null,
                            ttfb: ttfb > 0 ? Math.round(ttfb) : null
                        });
                    }
                }
            }["usePerformanceMetrics.useEffect.getNavigationTiming"];
            // Get resource timing data
            const getResourceTiming = {
                "usePerformanceMetrics.useEffect.getResourceTiming": ()=>{
                    const resources = performance.getEntriesByType("resource");
                    const totalSize = resources.reduce({
                        "usePerformanceMetrics.useEffect.getResourceTiming.totalSize": (acc, r)=>acc + (r.transferSize || 0)
                    }["usePerformanceMetrics.useEffect.getResourceTiming.totalSize"], 0);
                    updateMetrics({
                        resourceCount: resources.length,
                        transferSize: Math.round(totalSize / 1024)
                    });
                }
            }["usePerformanceMetrics.useEffect.getResourceTiming"];
            // Initial timing collection after page load
            if (document.readyState === "complete") {
                getNavigationTiming();
                getResourceTiming();
            } else {
                window.addEventListener("load", {
                    "usePerformanceMetrics.useEffect": ()=>{
                        // Wait a bit for metrics to stabilize
                        setTimeout({
                            "usePerformanceMetrics.useEffect": ()=>{
                                getNavigationTiming();
                                getResourceTiming();
                            }
                        }["usePerformanceMetrics.useEffect"], 100);
                    }
                }["usePerformanceMetrics.useEffect"]);
            }
            // Observe paint timing (FCP)
            const paintObserver = new PerformanceObserver({
                "usePerformanceMetrics.useEffect": (entryList)=>{
                    for (const entry of entryList.getEntries()){
                        if (entry.name === "first-contentful-paint") {
                            updateMetrics({
                                fcp: Math.round(entry.startTime)
                            });
                        }
                    }
                }
            }["usePerformanceMetrics.useEffect"]);
            try {
                paintObserver.observe({
                    type: "paint",
                    buffered: true
                });
            } catch  {
            // Paint observer not supported
            }
            // Observe LCP
            const lcpObserver = new PerformanceObserver({
                "usePerformanceMetrics.useEffect": (entryList)=>{
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    if (lastEntry) {
                        updateMetrics({
                            lcp: Math.round(lastEntry.startTime)
                        });
                    }
                }
            }["usePerformanceMetrics.useEffect"]);
            try {
                lcpObserver.observe({
                    type: "largest-contentful-paint",
                    buffered: true
                });
            } catch  {
            // LCP observer not supported
            }
            // Observe CLS
            let clsValue = 0;
            const clsObserver = new PerformanceObserver({
                "usePerformanceMetrics.useEffect": (entryList)=>{
                    for (const entry of entryList.getEntries()){
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if (!entry.hadRecentInput) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            clsValue += entry.value;
                            updateMetrics({
                                cls: Math.round(clsValue * 1000) / 1000
                            });
                        }
                    }
                }
            }["usePerformanceMetrics.useEffect"]);
            try {
                clsObserver.observe({
                    type: "layout-shift",
                    buffered: true
                });
            } catch  {
            // CLS observer not supported
            }
            // Observe FID
            const fidObserver = new PerformanceObserver({
                "usePerformanceMetrics.useEffect": (entryList)=>{
                    for (const entry of entryList.getEntries()){
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const fidEntry = entry;
                        updateMetrics({
                            fid: Math.round(fidEntry.processingStart - fidEntry.startTime)
                        });
                    }
                }
            }["usePerformanceMetrics.useEffect"]);
            try {
                fidObserver.observe({
                    type: "first-input",
                    buffered: true
                });
            } catch  {
            // FID observer not supported
            }
            // Observe INP (Interaction to Next Paint)
            const inpObserver = new PerformanceObserver({
                "usePerformanceMetrics.useEffect": (entryList)=>{
                    for (const entry of entryList.getEntries()){
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const duration = entry.duration;
                        if (duration) {
                            updateMetrics({
                                inp: Math.round(duration)
                            });
                        }
                    }
                }
            }["usePerformanceMetrics.useEffect"]);
            try {
                inpObserver.observe({
                    type: "event",
                    buffered: true
                });
            } catch  {
            // INP observer not supported
            }
            return ({
                "usePerformanceMetrics.useEffect": ()=>{
                    paintObserver.disconnect();
                    lcpObserver.disconnect();
                    clsObserver.disconnect();
                    fidObserver.disconnect();
                    inpObserver.disconnect();
                }
            })["usePerformanceMetrics.useEffect"];
        }
    }["usePerformanceMetrics.useEffect"], [
        updateMetrics
    ]);
    // Force refresh metrics
    const refreshMetrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePerformanceMetrics.useCallback[refreshMetrics]": ()=>{
            if (("TURBOPACK compile-time value", "object") === "undefined" || !window.performance) return;
            const navigation = performance.getEntriesByType("navigation")[0];
            const resources = performance.getEntriesByType("resource");
            if (navigation) {
                const pageLoadTime = navigation.loadEventEnd - navigation.startTime;
                const ttfb = navigation.responseStart - navigation.requestStart;
                const totalSize = resources.reduce({
                    "usePerformanceMetrics.useCallback[refreshMetrics].totalSize": (acc, r)=>acc + (r.transferSize || 0)
                }["usePerformanceMetrics.useCallback[refreshMetrics].totalSize"], 0);
                updateMetrics({
                    pageLoadTime: pageLoadTime > 0 ? Math.round(pageLoadTime) : null,
                    ttfb: ttfb > 0 ? Math.round(ttfb) : null,
                    resourceCount: resources.length,
                    transferSize: Math.round(totalSize / 1024)
                });
            }
        }
    }["usePerformanceMetrics.useCallback[refreshMetrics]"], [
        updateMetrics
    ]);
    return {
        metrics,
        isSupported,
        refreshMetrics
    };
}
_s(usePerformanceMetrics, "It9jtKgbswYPf819ASjtU8KHr1I=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useProviderStatus.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useProviderStatus",
    ()=>useProviderStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
const POLL_INTERVAL = 30000; // 30 seconds
const INITIAL_TIMEOUT = 8000; // 8 seconds for health check
function useProviderStatus() {
    _s();
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        providerType: 'cloud',
        status: 'connecting',
        lastChecked: 0
    });
    const isCheckingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const checkHealth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProviderStatus.useCallback[checkHealth]": async ()=>{
            if (isCheckingRef.current) return;
            isCheckingRef.current = true;
            try {
                // Check health with timeout for better UX
                const controller = new AbortController();
                const timeoutId = setTimeout({
                    "useProviderStatus.useCallback[checkHealth].timeoutId": ()=>controller.abort()
                }["useProviderStatus.useCallback[checkHealth].timeoutId"], INITIAL_TIMEOUT);
                const healthRes = await fetch('/api/health/providers?checkCloud=false', {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                if (!healthRes.ok) {
                    setStatus({
                        "useProviderStatus.useCallback[checkHealth]": (prev)=>({
                                ...prev,
                                status: 'disconnected',
                                error: 'Health check failed',
                                lastChecked: Date.now()
                            })
                    }["useProviderStatus.useCallback[checkHealth]"]);
                    return;
                }
                const health = await healthRes.json();
                // Determine provider based on what's available
                // Priority: Lynkr > Local > Cloud
                let actualProvider = 'cloud';
                let connectionStatus = 'connected';
                let latency;
                if (health.summary.lynkrAvailable) {
                    actualProvider = 'lynkr';
                    connectionStatus = 'connected';
                    latency = health.providers.lynkr.latencyMs;
                } else if (health.summary.localAvailable) {
                    actualProvider = 'local';
                    connectionStatus = 'connected';
                    latency = health.providers.ollama.latencyMs;
                } else {
                    // Default to cloud - assume cloud is always available
                    actualProvider = 'cloud';
                    connectionStatus = 'connected';
                }
                setStatus({
                    providerType: actualProvider,
                    status: connectionStatus,
                    latencyMs: latency,
                    lastChecked: Date.now()
                });
            } catch (err) {
                // On error, assume cloud fallback is working
                setStatus({
                    providerType: 'cloud',
                    status: 'connected',
                    lastChecked: Date.now()
                });
            } finally{
                isCheckingRef.current = false;
            }
        }
    }["useProviderStatus.useCallback[checkHealth]"], []);
    // Initial check with a small delay to not block render
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useProviderStatus.useEffect": ()=>{
            const timer = setTimeout(checkHealth, 1000);
            return ({
                "useProviderStatus.useEffect": ()=>clearTimeout(timer)
            })["useProviderStatus.useEffect"];
        }
    }["useProviderStatus.useEffect"], [
        checkHealth
    ]);
    // Periodic polling
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useProviderStatus.useEffect": ()=>{
            const interval = setInterval(checkHealth, POLL_INTERVAL);
            return ({
                "useProviderStatus.useEffect": ()=>clearInterval(interval)
            })["useProviderStatus.useEffect"];
        }
    }["useProviderStatus.useEffect"], [
        checkHealth
    ]);
    // Helper function to get display color
    const getStatusColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProviderStatus.useCallback[getStatusColor]": ()=>{
            switch(status.status){
                case 'connected':
                    return '#22c55e'; // green-500
                case 'connecting':
                    return '#f97316'; // orange-500
                case 'disconnected':
                    return '#ef4444'; // red-500
                default:
                    return '#6b7280'; // gray-500
            }
        }
    }["useProviderStatus.useCallback[getStatusColor]"], [
        status.status
    ]);
    // Helper function to get provider display name
    const getProviderDisplayName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProviderStatus.useCallback[getProviderDisplayName]": ()=>{
            switch(status.providerType){
                case 'lynkr':
                    return 'Lynkr';
                case 'local':
                    return 'Local';
                case 'cloud':
                    return 'Cloud';
                default:
                    return 'Unknown';
            }
        }
    }["useProviderStatus.useCallback[getProviderDisplayName]"], [
        status.providerType
    ]);
    return {
        ...status,
        isChecking: isCheckingRef.current,
        refresh: checkHealth,
        getStatusColor,
        getProviderDisplayName
    };
}
_s(useProviderStatus, "4312ZO2I3YdaB5vJyOYTSLUepWI=");
const __TURBOPACK__default__export__ = useProviderStatus;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_hooks_e22ed949._.js.map