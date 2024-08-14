import { format } from 'winston'

const { combine, colorize, errors, json, printf, timestamp } = format

export const formatDev = combine(
    errors({ stack: true }),
    timestamp({
        format: 'HH:mm:ss'
    }),
    printf(({ timestamp, message, level, stack, ...meta }) => {
        // Error stack
        if (stack) {
            return `[${timestamp}] ${stack}`
        }

        const log = `[${timestamp}] ${message}`

        const hasMeta = Object.keys(meta).length > 0

        // Metadata
        if (hasMeta) {
            return `${log} ${JSON.stringify(meta)}`
        }

        return log
    }),
    colorize({ all: true })
)

export const formatProd = combine(
    errors({ stack: true }),
    timestamp(),
    json()
)
