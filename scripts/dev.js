/* eslint-disable @typescript-eslint/no-var-requires */
const concurrently = require('concurrently')
const path = require('path')

const command = 'npm run dev'

const { result } = concurrently(
    [
        { command, name: 'api', cwd: path.resolve('packages/api') },
        { command, name: 'join', cwd: path.resolve('packages/join') },
        { command, name: 'policy', cwd: path.resolve('packages/policy') },
        { command, name: 'world', cwd: path.resolve('packages/world') }
    ],
    {
        prefixColors: 'auto'
    }
)

result.then(
    () => {},
    error => console.error(error)
)
