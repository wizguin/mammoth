import { colors, type CustomLogger, levels } from './LoggerLevels'
import { defaultFormat, formatConsole, formatFile } from './LoggerFormats'
import { name } from '../args/Args'

import { addColors, createLogger, transports } from 'winston'

const options = {
    levels: levels,
    level: 'info',
    format: defaultFormat,

    transports: [
        new transports.File({
            level: 'error',
            filename: `${name}.error.log`,
            dirname: 'logs',
            format: formatFile
        }),
        new transports.File({
            filename: `${name}.combined.log`,
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
