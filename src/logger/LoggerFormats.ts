import { name } from '../args/Args'

import { format } from 'winston'

const { colorize, combine, printf, timestamp, splat } = format

export const defaultFormat = combine(
    timestamp({
        format: 'HH:mm:ss'
    }),
    splat(),
    printf(message => {
        return `${message.timestamp} [${name}] ${message.message}`
    })
)

export const formatFile = combine(
    timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    printf(message => {
        return `${message.timestamp} [${message.level}] ${message.message}`
    })
)

export const formatConsole = combine(colorize({ all: true }))
