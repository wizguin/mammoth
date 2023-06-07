import { logLevel } from '@config'
import { defaultFormat, formatConsole, formatFile } from './LoggerFormats'
import { colors, CustomLogger, levels } from './LoggerLevels'

import { addColors, createLogger, transports } from 'winston'


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
