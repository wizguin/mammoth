import { logLevel } from '@config'
import { addColors, createLogger, transports } from 'winston'

import { defaultFormat, formatConsole, formatFile } from './LoggerFormats'
import { colors, CustomLogger, levels } from './LoggerLevels'


const id = process.argv[2]

const options = {
    levels: levels,
    level: logLevel,
    format: defaultFormat,

    transports: [
        new transports.File({
            level: 'error',
            filename: `${id}.error.log`,
            dirname: 'logs',
            format: formatFile
        }),
        new transports.File({
            filename: `${id}.combined.log`,
            dirname: 'logs',
            format: formatFile
        }),
        new transports.Console({
            format: formatConsole
        })
    ]
}

addColors(colors)

export default createLogger(options) as CustomLogger
