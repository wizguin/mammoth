import { Command, InvalidArgumentError } from 'commander'

interface Options {
    name: string,
    host: string,
    port: number,
    maxUsers: number
}

function parseNumber(value: string) {
    const parsedValue = parseInt(value, 10)

    if (isNaN(parsedValue)) {
        throw new InvalidArgumentError('Not a number')
    }

    return parsedValue
}

const program = new Command()

program
    .requiredOption('-n, --name <name>', 'name of the world')

    .option('-h, --host <host>', 'host address', '0.0.0.0')

    .requiredOption('-p, --port <port>', 'port to listen on', parseNumber)

    .option('-m, --maxUsers <maxUsers>', 'maximum number of users', parseNumber, 300)

program.parse(process.argv)

const options = program.opts() as Options

export const name = options.name
export const host = options.host
export const port = options.port
export const maxUsers = options.maxUsers
