export function buildResponse(params: Record<string, number | string>) {
    const response = []

    for (const key in params) {
        response.push(`&${key}=${params[key]}`)
    }

    return response.join('')
}

export function buildError(errorCode: number, message?: string) {
    return message
        ? buildResponse({ e: errorCode, em: message })
        : buildResponse({ e: errorCode })
}
