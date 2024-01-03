import { AppwriteException } from 'node-appwrite';

/**
 * Throws an error if any of the keys are missing from the object
 */
export function throwIfMissing(obj: any, keys: string[]): void {
    const missing: string[] = [];
    for (let key of keys) {
        if (!(key in obj) || !obj[key]) {
            missing.push(key);
        }
    }
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
}

interface HeaderKeyValue {
    key: string;
    value?: string;
}

export function throwIfMissingHeader(headers: any, keys: HeaderKeyValue[]): void {
    const missing: string[] = [];
    for (let item of keys) {
        const lowerCaseKey = item.key.toLocaleLowerCase();
        if (!(lowerCaseKey in headers) || !headers[lowerCaseKey]) {
            missing.push(lowerCaseKey);
            continue;
        }
        if (!headers[lowerCaseKey].includes(item.value.toLocaleLowerCase())) {
            missing.push(lowerCaseKey + ' not include ' + item.value);
            break;
        }
    }
    if (missing.length > 0) {
        throw new Error(`Missing required header fields: ${missing.join(', ')}`);
    }
}

export function getErrorMessage(error: unknown) {
    if (error instanceof AppwriteException) return error;
    if (error instanceof Error) return error.message;
    if (typeof error === 'object') return JSON.stringify(error);
    return `${error}`;
}

const safeJsonParse = <T>(str: string) => {
    try {
        const jsonValue: T = JSON.parse(str);

        return jsonValue;
    } catch {
        return undefined;
    }
};
// const safeJsonParse: <T>(str: string) => T | undefined ✅

// Response handling
export function successResp(message: string, data: any): any {
    return { success: true, message: message, data: data };
}

interface ErrorResp {
    message: string;
    type?: string;
    code?: number;
    detail?: any;
}

interface ErrorRespExtend extends ErrorResp {
    success: boolean;
}

export function errorResp(model: ErrorResp): ErrorRespExtend {
    return { success: false, message: model.message, type: model.type, code: model.code, detail: model.detail };
}

export function errorRespFromError(error: any): ErrorRespExtend {
    if (error instanceof AppwriteException) {
        const type: string = Object(error.response).type;
        return { success: false, message: error.message, type: type, code: error.code, detail: error.response };
    }
    if (error instanceof Error) {
        return { success: false, message: error.message, type: error.name };
    }
    if (typeof error === 'object') {
        return { success: false, message: 'Unknown error check detail', detail: error };
    }
    return { success: false, message: 'Unknown error check detail', detail: `${error}` };
}
