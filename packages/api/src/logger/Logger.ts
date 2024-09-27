import { colors, type CustomLogger, levels } from './LoggerLevels'
import { formatDev, formatProd } from './LoggerFormats'

import { addColors, createLogger, transports } from 'winston'

const options = {
    levels: levels,
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production'
        ? formatProd
        : formatDev,

    transports: [
        new transports.Console()
    ]
}

addColors(colors)

export default createLogger(options) as CustomLogger
